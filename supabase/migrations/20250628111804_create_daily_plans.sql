-- Create a table for daily trading plans
CREATE TABLE IF NOT EXISTS daily_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  focus_note TEXT NOT NULL,
  selected_strategies UUID[] DEFAULT '{}',
  market_condition TEXT,
  risk_level TEXT,
  trading_goals TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_id ON daily_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_date ON daily_plans(date);

-- Add RLS (Row Level Security) policies for daily_plans
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own daily plans
CREATE POLICY "Users can view own daily plans"
  ON daily_plans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own daily plans
CREATE POLICY "Users can insert own daily plans"
  ON daily_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own daily plans
CREATE POLICY "Users can update own daily plans"
  ON daily_plans
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own daily plans
CREATE POLICY "Users can delete own daily plans"
  ON daily_plans
  FOR DELETE
  USING (auth.uid() = user_id); 