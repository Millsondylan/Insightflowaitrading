-- Check if the table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_preferences') THEN
    -- Create user_preferences table if it doesn't exist
    CREATE TABLE user_preferences (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      dark_mode_enabled BOOLEAN DEFAULT true,
      preferred_language VARCHAR(10) DEFAULT 'en',
      notification_enabled BOOLEAN DEFAULT true,
      gesture_enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  ELSE
    -- Add the new columns to the existing table
    BEGIN
      ALTER TABLE user_preferences
      ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en';
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_preferences
      ADD COLUMN IF NOT EXISTS gesture_enabled BOOLEAN DEFAULT true;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_preferences
      ADD COLUMN IF NOT EXISTS dark_mode_enabled BOOLEAN DEFAULT true;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
  END IF;
END $$;

-- Add default index for faster lookup
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Set up RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for selecting preferences (users can only view their own)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'allow_select_own_preferences'
  ) THEN
    CREATE POLICY allow_select_own_preferences ON user_preferences
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add RLS policy for inserting preferences (users can only insert their own)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'allow_insert_own_preferences'
  ) THEN
    CREATE POLICY allow_insert_own_preferences ON user_preferences
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add RLS policy for updating preferences (users can only update their own)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'allow_update_own_preferences'
  ) THEN
    CREATE POLICY allow_update_own_preferences ON user_preferences
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger WHERE tgname = 'trigger_update_user_preferences_updated_at'
  ) THEN
    CREATE TRIGGER trigger_update_user_preferences_updated_at
      BEFORE UPDATE ON user_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_user_preferences_updated_at();
  END IF;
END $$; 