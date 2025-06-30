-- Enable pgcron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create jobs table to track background tasks
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payload JSONB NOT NULL DEFAULT '{}',
  result JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3
);

-- Create scheduled task for blockchain payment revalidation (runs every 10 minutes)
SELECT cron.schedule(
  'revalidate-pending-payments',
  '*/10 * * * *',  -- Every 10 minutes
  $$
    -- Find pending payments that need revalidation
    WITH pending_payments AS (
      SELECT id, tx_hash, cryptocurrency
      FROM wallet_transactions
      WHERE status = 'pending'
      AND created_at > NOW() - INTERVAL '24 hours' -- Only check recent pending transactions
    )
    INSERT INTO jobs (type, payload, status)
    SELECT 
      'payment_verification', 
      jsonb_build_object('tx_id', id, 'tx_hash', tx_hash, 'cryptocurrency', cryptocurrency), 
      'pending'
    FROM pending_payments;
  $$
);

-- Create scheduled task for LLM-powered auto-trade journaling (runs daily at 3 AM)
SELECT cron.schedule(
  'auto-trade-journaling',
  '0 3 * * *', -- Every day at 3 AM
  $$
    -- Find closed trades without journal entries
    WITH unjournaled_trades AS (
      SELECT t.id, t.user_id, t.symbol, t.trade_type, t.entry_price, t.exit_price, t.opened_at, t.closed_at, t.pnl
      FROM trades t
      LEFT JOIN journal_entries j ON j.trade_id = t.id
      WHERE t.status = 'closed'
      AND t.closed_at > NOW() - INTERVAL '48 hours'
      AND j.id IS NULL
    )
    INSERT INTO jobs (type, payload, status)
    SELECT 
      'auto_journaling', 
      jsonb_build_object('trade_id', id, 'user_id', user_id), 
      'pending'
    FROM unjournaled_trades;
  $$
);

-- Create scheduled task for PnL insights (runs weekly on Sunday at 6 AM)
SELECT cron.schedule(
  'generate-pnl-insights',
  '0 6 * * 0', -- Every Sunday at 6 AM
  $$
    -- Find active users with at least 5 trades in the last month
    WITH active_traders AS (
      SELECT user_id
      FROM trades
      WHERE closed_at > NOW() - INTERVAL '30 days'
      GROUP BY user_id
      HAVING COUNT(*) >= 5
    )
    INSERT INTO jobs (type, payload, status)
    SELECT 
      'pnl_insights', 
      jsonb_build_object('user_id', user_id), 
      'pending'
    FROM active_traders;
  $$
);

-- Create function to process jobs in the background
CREATE OR REPLACE FUNCTION process_pending_jobs()
RETURNS INTEGER AS $$
DECLARE
  jobs_processed INTEGER := 0;
  job_record RECORD;
BEGIN
  -- Get up to 10 pending jobs that haven't exceeded max attempts
  FOR job_record IN 
    SELECT id, type, payload 
    FROM jobs 
    WHERE status = 'pending' 
    AND attempts < max_attempts
    ORDER BY created_at ASC
    LIMIT 10
    FOR UPDATE SKIP LOCKED
  LOOP
    -- Mark job as processing
    UPDATE jobs
    SET 
      status = 'processing', 
      started_at = NOW(),
      attempts = attempts + 1,
      updated_at = NOW()
    WHERE id = job_record.id;
    
    -- Log job started
    PERFORM pg_notify(
      'job_events',
      json_build_object(
        'event', 'job_started',
        'job_id', job_record.id,
        'job_type', job_record.type
      )::text
    );
    
    -- Increment counter
    jobs_processed := jobs_processed + 1;
  END LOOP;
  
  RETURN jobs_processed;
END;
$$ LANGUAGE plpgsql;

-- Schedule the job processor to run every minute
SELECT cron.schedule(
  'job-processor',
  '* * * * *',  -- Every minute
  $$
    SELECT process_pending_jobs();
  $$
);

-- Create cron_jobs table
CREATE TABLE IF NOT EXISTS cron_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_name VARCHAR(100) NOT NULL,
  schedule VARCHAR(100) NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  handler_function VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add RLS policies
ALTER TABLE cron_jobs ENABLE ROW LEVEL SECURITY;

-- Only admins can manage cron jobs
CREATE POLICY cron_jobs_admin_policy
  ON cron_jobs
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE auth.email() IN (SELECT email FROM admin_users)
    )
  );

-- Create function to update next_run based on schedule
CREATE OR REPLACE FUNCTION calculate_next_run(schedule TEXT, last_run TIMESTAMP WITH TIME ZONE)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
DECLARE
  next_run TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Simple implementation - just add hours for now
  -- In a real implementation, you'd parse cron syntax
  IF schedule = 'hourly' THEN
    next_run := last_run + INTERVAL '1 hour';
  ELSIF schedule = 'daily' THEN
    next_run := last_run + INTERVAL '1 day';
  ELSIF schedule = 'weekly' THEN
    next_run := last_run + INTERVAL '7 days';
  ELSIF schedule = 'monthly' THEN
    next_run := last_run + INTERVAL '1 month';
  ELSE
    -- Default to daily if schedule not recognized
    next_run := last_run + INTERVAL '1 day';
  END IF;
  
  RETURN next_run;
END;
$$;

-- Create function to update job after run
CREATE OR REPLACE FUNCTION update_job_after_run()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_run = NOW();
  NEW.next_run = calculate_next_run(NEW.schedule, NEW.last_run);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for job updates
CREATE TRIGGER update_job_after_run_trigger
  BEFORE UPDATE OF status ON cron_jobs
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_job_after_run(); 