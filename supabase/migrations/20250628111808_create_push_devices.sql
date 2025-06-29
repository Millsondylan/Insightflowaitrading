-- Create push_devices table
CREATE TABLE IF NOT EXISTS push_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios', 'web', 'macos', 'windows', 'linux')),
  push_token TEXT NOT NULL,
  device_name TEXT,
  device_model TEXT,
  app_version TEXT,
  os_version TEXT,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_push_devices_user_id ON push_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_push_devices_token ON push_devices(push_token);

-- Set up Row Level Security (RLS)
ALTER TABLE push_devices ENABLE ROW LEVEL SECURITY;

-- Users can view their own push devices
CREATE POLICY push_devices_select_policy ON push_devices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own push devices
CREATE POLICY push_devices_insert_policy ON push_devices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own push devices
CREATE POLICY push_devices_update_policy ON push_devices
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own push devices
CREATE POLICY push_devices_delete_policy ON push_devices
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_push_devices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the above function
CREATE TRIGGER update_push_devices_timestamp
BEFORE UPDATE ON push_devices
FOR EACH ROW
EXECUTE FUNCTION update_push_devices_updated_at(); 