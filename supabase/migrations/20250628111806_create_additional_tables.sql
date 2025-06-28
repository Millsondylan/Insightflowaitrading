-- Create a table for strategy backtests
CREATE TABLE IF NOT EXISTS strategy_backtests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES trading_strategies(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  initial_balance NUMERIC NOT NULL DEFAULT 10000,
  final_balance NUMERIC NOT NULL,
  total_trades INTEGER NOT NULL,
  winning_trades INTEGER NOT NULL,
  losing_trades INTEGER NOT NULL,
  profit_factor NUMERIC,
  sharpe_ratio NUMERIC,
  max_drawdown NUMERIC,
  win_rate NUMERIC,
  results_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for strategy versions
CREATE TABLE IF NOT EXISTS strategy_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID REFERENCES trading_strategies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  changes_summary TEXT,
  performance_data JSONB DEFAULT '{}',
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for market analysis
CREATE TABLE IF NOT EXISTS market_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  sentiment TEXT,
  key_levels NUMERIC[] DEFAULT '{}',
  indicators JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create a table for trading goals
CREATE TABLE IF NOT EXISTS trading_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  goal_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  target_date DATE,
  status TEXT DEFAULT 'in_progress',
  progress_data JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for risk management settings
CREATE TABLE IF NOT EXISTS risk_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  max_position_size NUMERIC NOT NULL,
  max_daily_drawdown NUMERIC NOT NULL,
  default_stop_loss_percent NUMERIC NOT NULL,
  default_take_profit_percent NUMERIC NOT NULL,
  max_trades_per_day INTEGER,
  allowed_symbols TEXT[] DEFAULT '{}',
  risk_per_trade_percent NUMERIC NOT NULL,
  compounding_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_percentages CHECK (
    max_daily_drawdown BETWEEN 0 AND 100 AND
    default_stop_loss_percent BETWEEN 0 AND 100 AND
    default_take_profit_percent BETWEEN 0 AND 100 AND
    risk_per_trade_percent BETWEEN 0 AND 100
  )
);

-- Create a table for trading sessions
CREATE TABLE IF NOT EXISTS trading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  initial_balance NUMERIC NOT NULL,
  final_balance NUMERIC,
  pnl NUMERIC,
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  losing_trades INTEGER DEFAULT 0,
  emotional_state TEXT,
  focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for market correlations
CREATE TABLE IF NOT EXISTS market_correlations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_pair TEXT[] NOT NULL,
  timeframe TEXT NOT NULL,
  correlation_value NUMERIC NOT NULL CHECK (correlation_value BETWEEN -1 AND 1),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  data_points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(symbol_pair, timeframe, start_date, end_date)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_strategy_backtests_strategy_id ON strategy_backtests(strategy_id);
CREATE INDEX IF NOT EXISTS idx_strategy_backtests_user_id ON strategy_backtests(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_versions_strategy_id ON strategy_versions(strategy_id);
CREATE INDEX IF NOT EXISTS idx_market_analysis_symbol ON market_analysis(symbol);
CREATE INDEX IF NOT EXISTS idx_market_analysis_user_id ON market_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_goals_user_id ON trading_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_settings_user_id ON risk_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_sessions_user_id ON trading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_market_correlations_symbol_pair ON market_correlations USING gin(symbol_pair);

-- Add RLS policies
ALTER TABLE strategy_backtests ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for strategy_backtests
CREATE POLICY "Users can view own backtests" ON strategy_backtests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own backtests" ON strategy_backtests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own backtests" ON strategy_backtests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own backtests" ON strategy_backtests FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for strategy_versions
CREATE POLICY "Users can view own strategy versions" ON strategy_versions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own strategy versions" ON strategy_versions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own strategy versions" ON strategy_versions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own strategy versions" ON strategy_versions FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for market_analysis
CREATE POLICY "Users can view own market analysis" ON market_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own market analysis" ON market_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own market analysis" ON market_analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own market analysis" ON market_analysis FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for trading_goals
CREATE POLICY "Users can view own goals" ON trading_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own goals" ON trading_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON trading_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON trading_goals FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for risk_settings
CREATE POLICY "Users can view own risk settings" ON risk_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own risk settings" ON risk_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own risk settings" ON risk_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own risk settings" ON risk_settings FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for trading_sessions
CREATE POLICY "Users can view own sessions" ON trading_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON trading_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON trading_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON trading_sessions FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_strategy_backtests_updated_at
    BEFORE UPDATE ON strategy_backtests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_goals_updated_at
    BEFORE UPDATE ON trading_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_settings_updated_at
    BEFORE UPDATE ON risk_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_sessions_updated_at
    BEFORE UPDATE ON trading_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 