-- Create a table for replay data
CREATE TABLE IF NOT EXISTS replay_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  candles JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  annotations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_replay_data_user_id ON replay_data(user_id);
CREATE INDEX IF NOT EXISTS idx_replay_data_trade_id ON replay_data(trade_id);
CREATE INDEX IF NOT EXISTS idx_replay_data_symbol ON replay_data(symbol);
CREATE INDEX IF NOT EXISTS idx_replay_data_timeframe ON replay_data(timeframe);
CREATE INDEX IF NOT EXISTS idx_replay_data_start_time ON replay_data(start_time);

-- Add RLS (Row Level Security) policies for replay_data
ALTER TABLE replay_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own replay data
CREATE POLICY "Users can view own replay data"
  ON replay_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own replay data
CREATE POLICY "Users can insert own replay data"
  ON replay_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own replay data
CREATE POLICY "Users can update own replay data"
  ON replay_data
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own replay data
CREATE POLICY "Users can delete own replay data"
  ON replay_data
  FOR DELETE
  USING (auth.uid() = user_id); 