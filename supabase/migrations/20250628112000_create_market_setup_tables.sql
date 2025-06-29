-- Create tables for AI-powered market setups

-- 1. Market Setups table - stores generated trade setups
CREATE TABLE IF NOT EXISTS market_setups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  symbol VARCHAR(20) NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  setup_type VARCHAR(50) NOT NULL,
  entry_price DECIMAL(18,8),
  stop_loss DECIMAL(18,8),
  take_profit DECIMAL(18,8),
  risk_reward_ratio DECIMAL(5,2),
  confidence_level INT CHECK (confidence_level BETWEEN 1 AND 10),
  setup_image_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'entered', 'cancelled', 'completed')),
  entry_time TIMESTAMP WITH TIME ZONE,
  exit_time TIMESTAMP WITH TIME ZONE,
  result VARCHAR(20) CHECK (result IN ('win', 'loss', 'breakeven', NULL)),
  profit_loss DECIMAL(18,8),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  tags TEXT[]
);

-- 2. User Strategies table - stores user-defined strategies
CREATE TABLE IF NOT EXISTS user_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  strategy_text TEXT NOT NULL,
  ai_parsed JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Strategy Setups table - links strategies to matching market setups
CREATE TABLE IF NOT EXISTS strategy_setups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES user_strategies(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  entry DECIMAL NOT NULL,
  sl DECIMAL NOT NULL,
  tp DECIMAL NOT NULL,
  confidence INTEGER NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Public Setups table - stores setups shared publicly
CREATE TABLE IF NOT EXISTS public_setups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES user_strategies(id) ON DELETE SET NULL,
  symbol VARCHAR(20) NOT NULL,
  entry DECIMAL NOT NULL,
  sl DECIMAL NOT NULL,
  tp DECIMAL NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  stats JSONB DEFAULT '{}'::jsonb,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Setup Interactions tables - tracks likes and views
CREATE TABLE IF NOT EXISTS setup_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setup_id UUID NOT NULL REFERENCES public_setups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Ensure a user can only like a setup once
  CONSTRAINT setup_likes_unique UNIQUE (setup_id, user_id)
);

CREATE TABLE IF NOT EXISTS setup_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setup_id UUID NOT NULL REFERENCES public_setups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Setup Leaderboard table - cache for top ranked setups
CREATE TABLE IF NOT EXISTS setup_leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setup_id UUID NOT NULL REFERENCES public_setups(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  score DECIMAL NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add the missing trading preferences to user_preferences
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS trading_style VARCHAR(20) DEFAULT 'swing', -- 'scalp', 'swing', 'day', 'position'
ADD COLUMN IF NOT EXISTS risk_ratio DECIMAL DEFAULT 2.0, -- default 1:2 risk:reward
ADD COLUMN IF NOT EXISTS favorite_indicators TEXT[] DEFAULT ARRAY['EMA', 'RSI']::TEXT[];

-- Setup RLS policies
-- Market Setups
ALTER TABLE market_setups ENABLE ROW LEVEL SECURITY;
CREATE POLICY market_setups_user_policy ON market_setups
  FOR ALL USING (auth.uid() = user_id OR is_public = TRUE);

-- User Strategies
ALTER TABLE user_strategies ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_strategies_user_policy ON user_strategies
  FOR ALL USING (auth.uid() = user_id OR is_public = TRUE);

-- Strategy Setups
ALTER TABLE strategy_setups ENABLE ROW LEVEL SECURITY;
CREATE POLICY strategy_setups_policy ON strategy_setups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_strategies
      WHERE user_strategies.id = strategy_setups.strategy_id
      AND (user_strategies.user_id = auth.uid() OR user_strategies.is_public = TRUE)
    )
  );

-- Public Setups
ALTER TABLE public_setups ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_setups_policy ON public_setups
  FOR ALL USING (true); -- All users can view public setups

-- Setup Likes
ALTER TABLE setup_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY setup_likes_policy ON setup_likes
  FOR ALL USING (auth.uid() = user_id);

-- Setup Views
ALTER TABLE setup_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY setup_views_policy ON setup_views
  FOR ALL USING (auth.uid() = user_id);

-- Setup Leaderboard
ALTER TABLE setup_leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY setup_leaderboard_policy ON setup_leaderboard
  FOR SELECT USING (true); -- Anyone can view leaderboard

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_market_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_market_setups_updated_at
  BEFORE UPDATE ON market_setups
  FOR EACH ROW
  EXECUTE FUNCTION update_market_tables_updated_at();

CREATE TRIGGER update_user_strategies_updated_at
  BEFORE UPDATE ON user_strategies
  FOR EACH ROW
  EXECUTE FUNCTION update_market_tables_updated_at();

-- Function to sync market_setups to public_setups when is_public is set to true
CREATE OR REPLACE FUNCTION sync_public_setup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_public = TRUE AND (OLD IS NULL OR OLD.is_public = FALSE) THEN
    INSERT INTO public_setups (
      user_id, strategy_id, symbol, entry, sl, tp, timeframe, stats
    ) VALUES (
      NEW.user_id, 
      NEW.strategy_id, 
      NEW.symbol, 
      NEW.entry, 
      NEW.sl, 
      NEW.tp, 
      NEW.timeframe, 
      jsonb_build_object(
        'confidence_score', NEW.confidence_score,
        'pattern_description', NEW.pattern_description
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for syncing to public setups
CREATE TRIGGER sync_market_setup_to_public
  AFTER INSERT OR UPDATE OF is_public ON market_setups
  FOR EACH ROW
  WHEN (NEW.is_public = TRUE)
  EXECUTE FUNCTION sync_public_setup();

-- Create market_setup_votes table
CREATE TABLE IF NOT EXISTS market_setup_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setup_id UUID REFERENCES market_setups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (setup_id, user_id)
);

-- Create market_setup_comments table
CREATE TABLE IF NOT EXISTS market_setup_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setup_id UUID REFERENCES market_setups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_setup_leaderboard table
CREATE TABLE IF NOT EXISTS market_setup_leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_setups INT DEFAULT 0,
  win_count INT DEFAULT 0,
  loss_count INT DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  avg_risk_reward DECIMAL(5,2) DEFAULT 0,
  total_pnl DECIMAL(18,8) DEFAULT 0,
  rank INT,
  points INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE market_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_setup_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_setup_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_setup_leaderboard ENABLE ROW LEVEL SECURITY;

-- Market setups policies
CREATE POLICY market_setups_select_policy
  ON market_setups FOR SELECT
  USING (is_public OR auth.uid() = user_id);

CREATE POLICY market_setups_insert_policy
  ON market_setups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY market_setups_update_policy
  ON market_setups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY market_setups_delete_policy
  ON market_setups FOR DELETE
  USING (auth.uid() = user_id);

-- Market setup votes policies
CREATE POLICY market_setup_votes_select_policy
  ON market_setup_votes FOR SELECT
  USING (true);

CREATE POLICY market_setup_votes_insert_policy
  ON market_setup_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY market_setup_votes_update_policy
  ON market_setup_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY market_setup_votes_delete_policy
  ON market_setup_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Market setup comments policies
CREATE POLICY market_setup_comments_select_policy
  ON market_setup_comments FOR SELECT
  USING (true);

CREATE POLICY market_setup_comments_insert_policy
  ON market_setup_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY market_setup_comments_update_policy
  ON market_setup_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY market_setup_comments_delete_policy
  ON market_setup_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Market setup leaderboard policies
CREATE POLICY market_setup_leaderboard_select_policy
  ON market_setup_leaderboard FOR SELECT
  USING (true);

-- Function to update leaderboard when a setup is completed
CREATE OR REPLACE FUNCTION update_market_setup_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to completed and result is set
  IF NEW.status = 'completed' AND NEW.result IS NOT NULL THEN
    -- Update or insert leaderboard entry
    INSERT INTO market_setup_leaderboard (user_id, total_setups, win_count, loss_count)
    VALUES (NEW.user_id, 1, 
      CASE WHEN NEW.result = 'win' THEN 1 ELSE 0 END,
      CASE WHEN NEW.result = 'loss' THEN 1 ELSE 0 END)
    ON CONFLICT (user_id) DO UPDATE SET
      total_setups = market_setup_leaderboard.total_setups + 1,
      win_count = market_setup_leaderboard.win_count + (CASE WHEN NEW.result = 'win' THEN 1 ELSE 0 END),
      loss_count = market_setup_leaderboard.loss_count + (CASE WHEN NEW.result = 'loss' THEN 1 ELSE 0 END),
      win_rate = CASE 
        WHEN (market_setup_leaderboard.total_setups + 1) > 0 
        THEN (market_setup_leaderboard.win_count + (CASE WHEN NEW.result = 'win' THEN 1 ELSE 0 END))::DECIMAL / (market_setup_leaderboard.total_setups + 1) * 100
        ELSE 0
      END,
      total_pnl = market_setup_leaderboard.total_pnl + COALESCE(NEW.profit_loss, 0),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for leaderboard updates
CREATE TRIGGER update_market_setup_leaderboard_trigger
  AFTER UPDATE OF status, result ON market_setups
  FOR EACH ROW
  EXECUTE FUNCTION update_market_setup_leaderboard(); 