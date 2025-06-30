-- Create coach_sessions table
CREATE TABLE IF NOT EXISTS coach_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  transcript TEXT,
  summary TEXT,
  action_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  session_data JSONB DEFAULT '{}'::jsonb
);

-- Create user_dashboard_widgets table
CREATE TABLE IF NOT EXISTS user_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_type VARCHAR(50) NOT NULL,
  widget_data JSONB DEFAULT '{}'::jsonb,
  position_x INT,
  position_y INT,
  width INT,
  height INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_visible BOOLEAN DEFAULT true,
  dismissed BOOLEAN DEFAULT false
);

-- Create user_learning_path table
CREATE TABLE IF NOT EXISTS user_learning_path (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level VARCHAR(20) DEFAULT 'beginner',
  completed_lessons TEXT[],
  current_focus TEXT,
  next_recommended_lessons JSONB,
  progress_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_suggestions table
CREATE TABLE IF NOT EXISTS user_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestion_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  is_dismissed BOOLEAN DEFAULT false,
  is_implemented BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority INT DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user_profiles table (or alter existing profiles table)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trading_experience VARCHAR(20),
  preferred_markets TEXT[],
  risk_tolerance INT CHECK (risk_tolerance BETWEEN 1 AND 10),
  trading_goals TEXT[],
  preferred_indicators TEXT[],
  learning_style VARCHAR(50),
  ai_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id)
);

-- Add RLS policies
ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_path ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Coach sessions policies
CREATE POLICY coach_sessions_select_policy
  ON coach_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY coach_sessions_insert_policy
  ON coach_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY coach_sessions_update_policy
  ON coach_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- User dashboard widgets policies
CREATE POLICY user_dashboard_widgets_select_policy
  ON user_dashboard_widgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_dashboard_widgets_insert_policy
  ON user_dashboard_widgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_dashboard_widgets_update_policy
  ON user_dashboard_widgets FOR UPDATE
  USING (auth.uid() = user_id);

-- User learning path policies
CREATE POLICY user_learning_path_select_policy
  ON user_learning_path FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_learning_path_insert_policy
  ON user_learning_path FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_learning_path_update_policy
  ON user_learning_path FOR UPDATE
  USING (auth.uid() = user_id);

-- User suggestions policies
CREATE POLICY user_suggestions_select_policy
  ON user_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_suggestions_insert_policy
  ON user_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY user_suggestions_update_policy
  ON user_suggestions FOR UPDATE
  USING (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY user_profiles_select_policy
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_profiles_insert_policy
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_profiles_update_policy
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id); 