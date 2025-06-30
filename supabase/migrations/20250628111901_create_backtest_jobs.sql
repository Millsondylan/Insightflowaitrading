-- Create backtest_jobs table for background processing
CREATE TABLE IF NOT EXISTS backtest_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID,
  status TEXT CHECK (status IN ('queued','running','done','failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  result JSONB,
  error TEXT,
  params JSONB
);

-- Add indexes
CREATE INDEX backtest_jobs_user_id_idx ON backtest_jobs (user_id);
CREATE INDEX backtest_jobs_status_idx ON backtest_jobs (status);

-- Add Row Level Security
ALTER TABLE backtest_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own backtest jobs"
  ON backtest_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own backtest jobs"
  ON backtest_jobs FOR INSERT
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only allow users to update status of their own jobs
CREATE POLICY "Users can update their own backtest jobs"
  ON backtest_jobs FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a function for serverless workers to update job status
CREATE OR REPLACE FUNCTION update_backtest_job_status(
  job_id UUID,
  new_status TEXT,
  job_result JSONB DEFAULT NULL,
  job_error TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  UPDATE backtest_jobs
  SET 
    status = new_status,
    result = COALESCE(job_result, result),
    error = COALESCE(job_error, error),
    updated_at = now()
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 