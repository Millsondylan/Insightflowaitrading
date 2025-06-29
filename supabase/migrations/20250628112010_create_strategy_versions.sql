-- Create strategy_versions table
CREATE TABLE IF NOT EXISTS strategy_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  changes_summary TEXT,
  performance_data JSONB DEFAULT '{}'::jsonb,
  is_live BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  improvement_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create strategy_performance_log table
CREATE TABLE IF NOT EXISTS strategy_performance_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  version_id UUID REFERENCES strategy_versions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  performance_metrics JSONB NOT NULL,
  log_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  is_backtest BOOLEAN DEFAULT true
);

-- Add RLS policies
ALTER TABLE strategy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_performance_log ENABLE ROW LEVEL SECURITY;

-- Strategy versions policies
CREATE POLICY strategy_versions_select_policy
  ON strategy_versions FOR SELECT
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT collaborator_id FROM strategy_collaborators 
      WHERE strategy_id = strategy_versions.strategy_id
    )
  );

CREATE POLICY strategy_versions_insert_policy
  ON strategy_versions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT collaborator_id FROM strategy_collaborators 
      WHERE strategy_id = strategy_versions.strategy_id AND can_edit = true
    )
  );

CREATE POLICY strategy_versions_update_policy
  ON strategy_versions FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT collaborator_id FROM strategy_collaborators 
      WHERE strategy_id = strategy_versions.strategy_id AND can_edit = true
    )
  );

-- Strategy performance log policies
CREATE POLICY strategy_performance_log_select_policy
  ON strategy_performance_log FOR SELECT
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT collaborator_id FROM strategy_collaborators 
      WHERE strategy_id = strategy_performance_log.strategy_id
    )
  );

CREATE POLICY strategy_performance_log_insert_policy
  ON strategy_performance_log FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT collaborator_id FROM strategy_collaborators 
      WHERE strategy_id = strategy_performance_log.strategy_id AND can_edit = true
    )
  );

-- Function to update strategy when a new version is created
CREATE OR REPLACE FUNCTION update_strategy_on_version_create()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the last_updated timestamp on the parent strategy
  UPDATE strategies
  SET last_updated = NOW(),
      version_count = version_count + 1
  WHERE id = NEW.strategy_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for strategy updates
CREATE TRIGGER update_strategy_on_version_create_trigger
  AFTER INSERT ON strategy_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_strategy_on_version_create();

-- Function to handle setting a version as active
CREATE OR REPLACE FUNCTION set_active_strategy_version()
RETURNS TRIGGER AS $$
BEGIN
  -- If this version is being set as active, deactivate all other versions
  IF NEW.is_active = true AND OLD.is_active = false THEN
    UPDATE strategy_versions
    SET is_active = false
    WHERE strategy_id = NEW.strategy_id
      AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for active version management
CREATE TRIGGER set_active_strategy_version_trigger
  BEFORE UPDATE OF is_active ON strategy_versions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION set_active_strategy_version(); 