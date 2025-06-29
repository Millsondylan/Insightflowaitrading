-- Create ai_agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('onboarding', 'strategy', 'market', 'journal', 'alert')),
  context JSONB NOT NULL DEFAULT '{}',
  suggestions JSONB NOT NULL DEFAULT '[]',
  triggered_by VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Add indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_agent_type ON ai_agents(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);

-- Set up Row Level Security (RLS)
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

-- RLS policies

-- Users can view their own agents
CREATE POLICY ai_agents_select_policy ON ai_agents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own agents
CREATE POLICY ai_agents_insert_policy ON ai_agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own agents
CREATE POLICY ai_agents_update_policy ON ai_agents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own agents
CREATE POLICY ai_agents_delete_policy ON ai_agents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update an agent's suggestions
CREATE OR REPLACE FUNCTION update_agent_suggestions(
  agent_id UUID,
  new_suggestions JSONB
) RETURNS void AS $$
BEGIN
  UPDATE ai_agents
  SET suggestions = new_suggestions, 
      status = 'completed',
      completed_at = NOW()
  WHERE id = agent_id;
END;
$$ LANGUAGE plpgsql;

-- Create notification view for agents that have completed
CREATE OR REPLACE VIEW v_ai_agent_notifications AS
SELECT 
  a.id as agent_id,
  a.user_id,
  a.agent_type,
  a.status,
  a.created_at,
  a.completed_at,
  jsonb_array_length(a.suggestions) as suggestion_count,
  EXISTS (SELECT 1 FROM notifications n WHERE n.reference_id = a.id::text) as is_notified
FROM ai_agents a
WHERE 
  a.status = 'completed' 
  AND a.completed_at > NOW() - INTERVAL '24 hours'
  AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.reference_id = a.id::text);

-- Create a function to trigger notifications when agents complete
CREATE OR REPLACE FUNCTION notify_completed_agent() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO notifications (
      user_id, 
      title, 
      description, 
      type,
      reference_type,
      reference_id,
      is_read
    ) VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.agent_type = 'strategy' THEN 'Strategy Suggestions Ready'
        WHEN NEW.agent_type = 'market' THEN 'Market Analysis Available'
        WHEN NEW.agent_type = 'onboarding' THEN 'Onboarding Tips'
        WHEN NEW.agent_type = 'journal' THEN 'Journal Insights Ready'
        WHEN NEW.agent_type = 'alert' THEN 'Market Alert'
        ELSE 'AI Assistant Update'
      END,
      CASE 
        WHEN NEW.agent_type = 'strategy' THEN 'Your AI assistant has generated strategy suggestions'
        WHEN NEW.agent_type = 'market' THEN 'Market analysis has been prepared for you'
        WHEN NEW.agent_type = 'onboarding' THEN 'Tips to help you get started'
        WHEN NEW.agent_type = 'journal' THEN 'Trading journal insights are ready for review'
        WHEN NEW.agent_type = 'alert' THEN 'Important market alert requires your attention'
        ELSE 'Your AI assistant has updates for you'
      END,
      'ai_agent',
      NEW.agent_type,
      NEW.id::text,
      false
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to fire the notification function
CREATE TRIGGER trigger_notify_completed_agent
AFTER UPDATE ON ai_agents
FOR EACH ROW
EXECUTE FUNCTION notify_completed_agent(); 