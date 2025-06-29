-- Check if the table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profile') THEN
    -- Create user_profile table if it doesn't exist
    CREATE TABLE user_profile (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'pro')),
      style TEXT[],
      favorite_markets TEXT[],
      favorite_timeframes TEXT[],
      favorite_symbols TEXT[],
      indicators TEXT[],
      risk_profile TEXT CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
      struggles TEXT,
      wants_ai_trading BOOLEAN DEFAULT false,
      wants_voice_coach BOOLEAN DEFAULT false,
      wants_alerts BOOLEAN DEFAULT false,
      onboarding_completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  ELSE
    -- Add the new columns to the existing table
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'pro'));
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS style TEXT[];
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS favorite_markets TEXT[];
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS favorite_timeframes TEXT[];
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS favorite_symbols TEXT[];
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS indicators TEXT[];
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS risk_profile TEXT CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive'));
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS struggles TEXT;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS wants_ai_trading BOOLEAN DEFAULT false;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS wants_voice_coach BOOLEAN DEFAULT false;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS wants_alerts BOOLEAN DEFAULT false;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profile
      ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
  END IF;
END $$;

-- Add index for faster lookup
CREATE INDEX IF NOT EXISTS idx_user_profile_user_id ON user_profile(user_id);

-- Set up RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON user_profile FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON user_profile FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON user_profile FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_user_profile_updated_at ON user_profile;
CREATE TRIGGER trigger_update_user_profile_updated_at
BEFORE UPDATE ON user_profile
FOR EACH ROW
EXECUTE FUNCTION update_user_profile_updated_at();

-- Create admin analytics table
CREATE TABLE IF NOT EXISTS admin_user_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  experience TEXT,
  style TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policy for admin_user_summary
ALTER TABLE admin_user_summary ENABLE ROW LEVEL SECURITY;

-- Only admins can view this table
CREATE POLICY "Only admins can view user summary" 
ON admin_user_summary FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create a trigger to update admin_user_summary when user_profile is updated
CREATE OR REPLACE FUNCTION update_admin_user_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_user_summary (user_id, experience, style, created_at)
  VALUES (NEW.user_id, NEW.experience, NEW.style, NEW.created_at)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    experience = EXCLUDED.experience,
    style = EXCLUDED.style;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admin_user_summary
DROP TRIGGER IF EXISTS trigger_update_admin_user_summary ON user_profile;
CREATE TRIGGER trigger_update_admin_user_summary
AFTER INSERT OR UPDATE OF experience, style ON user_profile
FOR EACH ROW
EXECUTE FUNCTION update_admin_user_summary(); 