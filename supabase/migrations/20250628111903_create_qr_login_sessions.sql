-- Create QR login sessions table for cross-device authentication
CREATE TABLE IF NOT EXISTS qr_login_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending','authenticated','expired','used')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  authenticated_at TIMESTAMP WITH TIME ZONE,
  device_info JSONB
);

-- Add indexes
CREATE INDEX qr_login_sessions_user_id_idx ON qr_login_sessions (user_id);
CREATE INDEX qr_login_sessions_session_id_idx ON qr_login_sessions (session_id);
CREATE INDEX qr_login_sessions_status_idx ON qr_login_sessions (status);

-- Add Row Level Security
ALTER TABLE qr_login_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own QR login sessions"
  ON qr_login_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own QR login sessions"
  ON qr_login_sessions FOR INSERT
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR login sessions"
  ON qr_login_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a function to expire old sessions
CREATE OR REPLACE FUNCTION expire_old_qr_sessions() RETURNS VOID AS $$
BEGIN
  UPDATE qr_login_sessions
  SET status = 'expired'
  WHERE expires_at < now() AND status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a cron job to run every 15 minutes
-- Note: This requires pg_cron extension which should be enabled in Supabase
-- If not available, this can be done through a scheduled serverless function
SELECT cron.schedule('*/15 * * * *', $$SELECT expire_old_qr_sessions()$$); 