-- Create user_devices table for push notifications
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token TEXT NOT NULL,
  platform VARCHAR(20) NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Each device token should be unique per user
  CONSTRAINT user_device_token_unique UNIQUE (user_id, device_token)
);

-- Add RLS policies
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- Users can only access their own devices
CREATE POLICY user_devices_user_policy
  ON user_devices
  USING (auth.uid() = user_id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION update_user_devices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_devices_updated_at
  BEFORE UPDATE ON user_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_user_devices_updated_at();

-- Create indexes for faster queries
CREATE INDEX user_devices_user_id_idx ON user_devices(user_id);
CREATE INDEX user_devices_platform_idx ON user_devices(platform); 