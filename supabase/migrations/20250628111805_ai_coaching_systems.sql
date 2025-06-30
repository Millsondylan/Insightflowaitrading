-- Strategy Evolution Tables
CREATE TABLE strategy_performance_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  win_rate FLOAT,
  avg_drawdown FLOAT,
  avg_r_multiple FLOAT,
  execution_success_rate FLOAT,
  changes JSONB
);

CREATE TABLE strategy_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  code TEXT,
  improvement_reason TEXT,
  is_active BOOLEAN DEFAULT false
);

-- Voice Coaching Tables
CREATE TABLE coach_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  market_context JSONB,
  strategy_id UUID REFERENCES strategies(id),
  transcript JSONB[]
);

-- Adaptive Dashboard Tables
CREATE TABLE user_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_id TEXT NOT NULL,
  position INTEGER,
  pinned BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE,
  settings JSONB
);

-- AI Learning Path Tables
CREATE TABLE user_learning_path (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES academy_lessons(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- AI Suggestions Tables
CREATE TABLE user_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestion TEXT NOT NULL,
  action_button TEXT,
  action_target TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acted_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for all tables
ALTER TABLE strategy_performance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_path ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own strategy performance logs"
  ON strategy_performance_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own strategy versions"
  ON strategy_versions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own coaching sessions"
  ON coach_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own dashboard widgets"
  ON user_dashboard_widgets FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own learning path"
  ON user_learning_path FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own suggestions"
  ON user_suggestions FOR ALL
  USING (auth.uid() = user_id);

-- Add user_preferences column to user_profile table if it doesn't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS ai_preferences JSONB DEFAULT '{
  "strategy_evolution": true,
  "voice_coaching": true,
  "adaptive_dashboard": true,
  "learning_path": true,
  "ai_suggestions": true
}'::jsonb; 