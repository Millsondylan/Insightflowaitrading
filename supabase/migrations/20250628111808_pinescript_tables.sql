-- Pine Script related tables

-- Table to track PineScript generation requests
CREATE TABLE IF NOT EXISTS pinescript_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  script_type TEXT NOT NULL CHECK (script_type IN ('strategy', 'indicator', 'library')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'error')),
  processing_time_ms INTEGER,
  metadata JSONB,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table to store the actual Pine Script outputs
CREATE TABLE IF NOT EXISTS pinescript_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES pinescript_requests(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  code TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  syntax_valid BOOLEAN,
  has_errors BOOLEAN DEFAULT FALSE,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_request_id FOREIGN KEY (request_id) REFERENCES pinescript_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table to manage user quotas and limits
CREATE TABLE IF NOT EXISTS user_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  resource_type TEXT NOT NULL,
  monthly_limit INTEGER NOT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  reset_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, resource_type),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table to store user feedback about generated Pine Scripts
CREATE TABLE IF NOT EXISTS pinescript_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pinescript_id UUID NOT NULL REFERENCES pinescript_outputs(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_pinescript_id FOREIGN KEY (pinescript_id) REFERENCES pinescript_outputs(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table to track Pine Script shares and exports
CREATE TABLE IF NOT EXISTS pinescript_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pinescript_id UUID NOT NULL REFERENCES pinescript_outputs(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  share_token TEXT NOT NULL UNIQUE,
  views_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_pinescript_id FOREIGN KEY (pinescript_id) REFERENCES pinescript_outputs(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Add columns to user_settings table to store Pine Script preferences
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS pinescript_settings JSONB DEFAULT '{"defaultScriptType": "indicator", "compactMode": false, "showComments": true, "defaultTimeframe": "1D"}';

-- Add columns to profiles table to track Pine Script usage
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS limit_pinescript BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS pinescript_monthly_requests INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pinescript_last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pinescript_requests_user_id ON pinescript_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_pinescript_outputs_request_id ON pinescript_outputs(request_id);
CREATE INDEX IF NOT EXISTS idx_user_limits_user_id ON user_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_pinescript_shares_token ON pinescript_shares(share_token);

-- Function to reset monthly Pine Script quota
CREATE OR REPLACE FUNCTION reset_monthly_pinescript_quota()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pinescript_monthly_requests >= 1 AND (
    NEW.pinescript_last_reset IS NULL OR 
    EXTRACT(MONTH FROM NOW()) != EXTRACT(MONTH FROM NEW.pinescript_last_reset) OR
    EXTRACT(YEAR FROM NOW()) != EXTRACT(YEAR FROM NEW.pinescript_last_reset)
  ) THEN
    NEW.pinescript_monthly_requests := 0;
    NEW.pinescript_last_reset := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to reset monthly quota
DROP TRIGGER IF EXISTS trigger_reset_pinescript_quota ON profiles;
CREATE TRIGGER trigger_reset_pinescript_quota
BEFORE UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.pinescript_monthly_requests IS DISTINCT FROM NEW.pinescript_monthly_requests)
EXECUTE FUNCTION reset_monthly_pinescript_quota();

-- Function to increment Pine Script usage
CREATE OR REPLACE FUNCTION increment_pinescript_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET pinescript_monthly_requests = pinescript_monthly_requests + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track Pine Script usage
DROP TRIGGER IF EXISTS trigger_increment_pinescript_usage ON pinescript_requests;
CREATE TRIGGER trigger_increment_pinescript_usage
AFTER INSERT ON pinescript_requests
FOR EACH ROW
EXECUTE FUNCTION increment_pinescript_usage(); 