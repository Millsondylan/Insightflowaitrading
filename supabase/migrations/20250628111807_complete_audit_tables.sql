-- =====================================================
-- INSIGHT FLOW COMPLETE AUDIT TABLES
-- =====================================================
-- This migration ensures 100% database persistence compliance
-- with full Lovable.dev compatibility and user personalization

-- =====================================================
-- ACADEMY SYSTEM TABLES
-- =====================================================

-- Academy Categories (e.g., Forex, Stocks, Crypto, etc.)
CREATE TABLE IF NOT EXISTS academy_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  color_scheme JSONB DEFAULT '{"primary": "#3B82F6", "secondary": "#1E40AF"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Academy Courses with comprehensive metadata
CREATE TABLE IF NOT EXISTS academy_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES academy_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  course_type TEXT[] DEFAULT '{}', -- ['emotion_control', 'technical', 'options', 'psychology', 'macro', 'sentiment', 'risk_theory']
  icon TEXT,
  duration_hours INTEGER DEFAULT 0,
  modules_count INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  tags TEXT[] DEFAULT '{}',
  prerequisites UUID[] DEFAULT '{}', -- References to other course IDs
  learning_objectives JSONB DEFAULT '[]',
  author_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Academy Progress tracking per user
CREATE TABLE IF NOT EXISTS academy_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage NUMERIC(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  module_checkpoints JSONB DEFAULT '{}', -- {"module_id": {"completed": true, "timestamp": "..."}}
  quiz_answers JSONB DEFAULT '[]', -- Store all quiz attempts and scores
  time_spent_seconds INTEGER DEFAULT 0,
  reflection_timestamps TIMESTAMP WITH TIME ZONE[] DEFAULT '{}',
  notes TEXT[] DEFAULT '{}',
  UNIQUE(user_id, course_id)
);

-- User Course Feedback for ratings and difficulty logs
CREATE TABLE IF NOT EXISTS user_course_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  difficulty_rating TEXT CHECK (difficulty_rating IN ('too_easy', 'just_right', 'too_hard')),
  comment TEXT,
  helpful_modules TEXT[] DEFAULT '{}',
  improvement_suggestions TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, course_id)
);

-- Course Challenges with auto-marked results
CREATE TABLE IF NOT EXISTS course_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT CHECK (challenge_type IN ('simulation', 'quiz', 'practical', 'analysis')),
  requirements JSONB DEFAULT '{}', -- e.g., {"simulate_breakouts": 3, "use_indicators": ["RSI", "trend"]}
  passing_criteria JSONB DEFAULT '{}',
  time_limit_minutes INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- MARKET INTELLIGENCE TABLES
-- =====================================================

-- Market Assets Library
CREATE TABLE IF NOT EXISTS market_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  asset_class TEXT CHECK (asset_class IN ('forex', 'stocks', 'crypto', 'commodities', 'futures', 'indices', 'volatility', 'bonds')),
  exchange TEXT,
  tags TEXT[] DEFAULT '{}',
  volatility_profile TEXT CHECK (volatility_profile IN ('low', 'medium', 'high', 'extreme')),
  avg_true_range JSONB DEFAULT '{}', -- {"1d": 1.5, "1h": 0.3, "5m": 0.1}
  trading_hours JSONB DEFAULT '{}', -- {"start": "09:30", "end": "16:00", "timezone": "EST"}
  contract_specs JSONB DEFAULT '{}', -- For futures/options
  correlation_pairs TEXT[] DEFAULT '{}', -- Commonly correlated symbols
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enhanced Market Correlations with visualization data
ALTER TABLE market_correlations ADD COLUMN IF NOT EXISTS color_palette JSONB DEFAULT '{"positive": "#10B981", "negative": "#EF4444", "neutral": "#6B7280"}';
ALTER TABLE market_correlations ADD COLUMN IF NOT EXISTS correlation_trend NUMERIC[] DEFAULT '{}'; -- Historical correlation values
ALTER TABLE market_correlations ADD COLUMN IF NOT EXISTS significance_level NUMERIC DEFAULT 0; -- Statistical significance

-- User Favorite Pairs with notification preferences
CREATE TABLE IF NOT EXISTS user_favorite_pairs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  symbol_pair TEXT[] NOT NULL,
  notify_on_inverse_correlation BOOLEAN DEFAULT false,
  correlation_threshold NUMERIC DEFAULT 0.8,
  custom_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, symbol_pair)
);

-- Market Mood Feed combining sentiment, volatility, and correlations
CREATE TABLE IF NOT EXISTS market_mood_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  market_summary JSONB NOT NULL, -- {"sentiment": "bullish", "volatility": "high", "key_events": [...]}
  correlation_shifts JSONB DEFAULT '[]', -- Notable correlation changes
  volatility_alerts JSONB DEFAULT '[]',
  sentiment_indicators JSONB DEFAULT '{}',
  ai_brief TEXT, -- GPT-generated daily summary
  expires_at TIMESTAMP WITH TIME ZONE
);

-- User Market Focus for personalized content
CREATE TABLE IF NOT EXISTS user_market_focus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  focused_markets TEXT[] DEFAULT '{}', -- ['forex', 'crypto', 'stocks']
  favorite_symbols TEXT[] DEFAULT '{}',
  trading_hours_preference JSONB DEFAULT '{}',
  news_preferences JSONB DEFAULT '{}',
  technical_indicator_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- =====================================================
-- USER PERSONALIZATION & SETTINGS
-- =====================================================

-- Comprehensive User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Notification Preferences
  notification_channels JSONB DEFAULT '{"email": true, "push": true, "in_app": true}',
  notification_types JSONB DEFAULT '{
    "trade_alerts": true,
    "market_updates": true,
    "strategy_signals": true,
    "journal_reminders": true,
    "goal_progress": true,
    "course_updates": true,
    "community_mentions": true
  }',
  quiet_hours JSONB DEFAULT '{"enabled": false, "start": "22:00", "end": "08:00", "timezone": "UTC"}',
  
  -- Visual Preferences
  theme_preferences JSONB DEFAULT '{"mode": "dark", "accent_color": "#3B82F6", "chart_theme": "tradingview"}',
  layout_preferences JSONB DEFAULT '{"sidebar_collapsed": false, "default_view": "dashboard"}',
  chart_settings JSONB DEFAULT '{}',
  
  -- Feature Toggles
  feature_toggles JSONB DEFAULT '{
    "ai_copilot": true,
    "auto_journaling": false,
    "smart_notifications": true,
    "voice_narration": false,
    "keyboard_shortcuts": true,
    "beta_features": false
  }',
  
  -- Behavioral Preferences
  coaching_tone TEXT DEFAULT 'balanced' CHECK (coaching_tone IN ('supportive', 'balanced', 'challenging', 'analytical')),
  reminder_frequency TEXT DEFAULT 'daily' CHECK (reminder_frequency IN ('hourly', 'daily', 'weekly', 'custom')),
  language TEXT DEFAULT 'en',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- User Notifications Queue
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}', -- Additional context data
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  channels TEXT[] DEFAULT '{in_app}', -- ['email', 'push', 'in_app', 'sms']
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'read', 'failed', 'cancelled')),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- AI & COPILOT SYSTEM TABLES
-- =====================================================

-- Copilot Interaction Logs
CREATE TABLE IF NOT EXISTS copilot_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  component_context TEXT NOT NULL, -- Which UI component triggered the copilot
  user_query TEXT,
  copilot_response TEXT NOT NULL,
  response_type TEXT CHECK (response_type IN ('suggestion', 'warning', 'explanation', 'fix', 'insight')),
  scope_context JSONB DEFAULT '{}', -- {strategy_id, journal_id, trade_id, etc}
  user_history_key TEXT, -- Key for maintaining conversation context
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Lesson Commentary & Narration
CREATE TABLE IF NOT EXISTS lesson_commentary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_section TEXT NOT NULL,
  narrator_style TEXT DEFAULT 'friendly' CHECK (narrator_style IN ('friendly', 'professional', 'enthusiastic', 'calm')),
  generated_commentary TEXT NOT NULL,
  user_context JSONB DEFAULT '{}', -- User's learning history, preferences
  timestamp_in_lesson INTEGER, -- Seconds into the lesson
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Coaching Feedback System
CREATE TABLE IF NOT EXISTS coaching_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feedback_type TEXT CHECK (feedback_type IN ('trade_review', 'journal_analysis', 'goal_progress', 'behavior_pattern', 'risk_alert')),
  context_data JSONB NOT NULL, -- Trade IDs, journal entries, etc.
  ai_analysis TEXT NOT NULL,
  suggestions JSONB DEFAULT '[]',
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'critical')),
  user_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  follow_up_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- SYSTEM MONITORING & INTEGRITY
-- =====================================================

-- Comprehensive Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'button_click', 'toggle_change', 'form_submit', 'navigation'
  component_name TEXT NOT NULL,
  component_path TEXT, -- UI component hierarchy
  action_details JSONB DEFAULT '{}',
  client_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  server_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  session_id UUID,
  ip_address INET,
  user_agent TEXT,
  duration_ms INTEGER -- For measuring interaction time
);

-- UI Error Captures with GPT Triage
CREATE TABLE IF NOT EXISTS ui_error_captures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  component_stack TEXT,
  browser_info JSONB DEFAULT '{}',
  gpt_analysis TEXT, -- AI-generated explanation
  user_facing_message TEXT, -- Simplified explanation for users
  suggested_actions JSONB DEFAULT '[]',
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resolution_status TEXT DEFAULT 'new' CHECK (resolution_status IN ('new', 'triaged', 'in_progress', 'resolved', 'wont_fix')),
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Interaction Heatmap for UX Optimization
CREATE TABLE IF NOT EXISTS interaction_heatmap (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  component_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'click', 'hover', 'focus', 'scroll'
  x_position INTEGER,
  y_position INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  time_on_component INTEGER, -- Milliseconds
  interaction_count INTEGER DEFAULT 1,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- User Journey State for session continuity
CREATE TABLE IF NOT EXISTS user_journey_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  current_path TEXT NOT NULL,
  journey_stack JSONB DEFAULT '[]', -- Navigation history
  form_states JSONB DEFAULT '{}', -- Unsaved form data
  component_states JSONB DEFAULT '{}', -- UI component states
  feature_interactions JSONB DEFAULT '{}', -- Which features were used
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, session_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Academy indexes
CREATE INDEX idx_academy_courses_category ON academy_courses(category_id);
CREATE INDEX idx_academy_courses_difficulty ON academy_courses(difficulty);
CREATE INDEX idx_academy_progress_user ON academy_progress(user_id);
CREATE INDEX idx_academy_progress_course ON academy_progress(course_id);
CREATE INDEX idx_course_feedback_user ON user_course_feedback(user_id);

-- Market indexes
CREATE INDEX idx_market_assets_class ON market_assets(asset_class);
CREATE INDEX idx_market_assets_symbol ON market_assets(symbol);
CREATE INDEX idx_user_favorite_pairs_user ON user_favorite_pairs(user_id);
CREATE INDEX idx_market_mood_generated ON market_mood_feed(generated_at DESC);

-- User personalization indexes
CREATE INDEX idx_user_notifications_user ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_status ON user_notifications(status);
CREATE INDEX idx_user_notifications_created ON user_notifications(created_at DESC);

-- AI system indexes
CREATE INDEX idx_copilot_logs_user ON copilot_logs(user_id);
CREATE INDEX idx_copilot_logs_session ON copilot_logs(session_id);
CREATE INDEX idx_coaching_feedback_user ON coaching_feedback(user_id);
CREATE INDEX idx_coaching_feedback_type ON coaching_feedback(feedback_type);

-- Monitoring indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(server_timestamp DESC);
CREATE INDEX idx_ui_errors_severity ON ui_error_captures(severity);
CREATE INDEX idx_interaction_heatmap_page ON interaction_heatmap(page_path);
CREATE INDEX idx_journey_state_session ON user_journey_state(session_id);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Academy RLS
ALTER TABLE academy_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_market_focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_commentary ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_heatmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_state ENABLE ROW LEVEL SECURITY;

-- User can only access their own data policies
CREATE POLICY "Users manage own progress" ON academy_progress 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users manage own feedback" ON user_course_feedback 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users manage own favorites" ON user_favorite_pairs 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users manage own market focus" ON user_market_focus 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users manage own settings" ON user_settings 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users view own notifications" ON user_notifications 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users view own copilot logs" ON copilot_logs 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users view own lesson commentary" ON lesson_commentary 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users view own coaching feedback" ON coaching_feedback 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users manage own heatmap data" ON interaction_heatmap 
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users manage own journey state" ON user_journey_state 
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for some tables
CREATE POLICY "Public can view courses" ON academy_courses 
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Public can view categories" ON academy_categories 
  FOR SELECT USING (true);
  
CREATE POLICY "Public can view market assets" ON market_assets 
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Public can view market mood" ON market_mood_feed 
  FOR SELECT USING (expires_at IS NULL OR expires_at > NOW());

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

CREATE TRIGGER update_academy_categories_updated_at
  BEFORE UPDATE ON academy_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_academy_courses_updated_at
  BEFORE UPDATE ON academy_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_market_assets_updated_at
  BEFORE UPDATE ON market_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_user_market_focus_updated_at
  BEFORE UPDATE ON user_market_focus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL SEED DATA
-- =====================================================

-- Insert default academy categories
INSERT INTO academy_categories (name, description, icon, display_order, color_scheme) VALUES
  ('Forex', 'Master currency trading in the world''s largest market', 'DollarSign', 1, '{"primary": "#10B981", "secondary": "#059669"}'),
  ('Stocks', 'Trade equities with confidence and precision', 'TrendingUp', 2, '{"primary": "#3B82F6", "secondary": "#2563EB"}'),
  ('Crypto', 'Navigate the volatile world of digital assets', 'Bitcoin', 3, '{"primary": "#F59E0B", "secondary": "#D97706"}'),
  ('Options', 'Advanced derivatives trading strategies', 'Settings', 4, '{"primary": "#8B5CF6", "secondary": "#7C3AED"}'),
  ('Futures', 'Trade commodities and index futures', 'BarChart', 5, '{"primary": "#EF4444", "secondary": "#DC2626"}'),
  ('Psychology', 'Master your mind for consistent profits', 'Brain', 6, '{"primary": "#EC4899", "secondary": "#DB2777"}')
ON CONFLICT (name) DO NOTHING;

-- Insert default market assets (sample data)
INSERT INTO market_assets (symbol, name, asset_class, exchange, tags, volatility_profile) VALUES
  ('EUR/USD', 'Euro/US Dollar', 'forex', 'Interbank', ARRAY['major', 'liquid'], 'low'),
  ('BTC/USD', 'Bitcoin/US Dollar', 'crypto', 'Multiple', ARRAY['volatile', 'crypto'], 'extreme'),
  ('AAPL', 'Apple Inc.', 'stocks', 'NASDAQ', ARRAY['tech', 'large-cap'], 'medium'),
  ('GC', 'Gold Futures', 'futures', 'COMEX', ARRAY['commodity', 'safe-haven'], 'medium'),
  ('SPY', 'S&P 500 ETF', 'indices', 'NYSE', ARRAY['index', 'liquid'], 'low')
ON CONFLICT (symbol) DO NOTHING; 