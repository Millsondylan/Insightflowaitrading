
-- Create a table for journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  pair TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  entryPrice NUMERIC NOT NULL,
  exitPrice NUMERIC NOT NULL,
  chartUrl TEXT,
  reason TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('Bullish', 'Bearish')),
  tags TEXT[] DEFAULT '{}',
  userId UUID REFERENCES profiles(id),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create a table for AI reflections
CREATE TABLE IF NOT EXISTS ai_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journalEntryId UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  userId UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  suggestion TEXT NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  provider TEXT NOT NULL DEFAULT 'auto',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(userId);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(createdAt);
CREATE INDEX IF NOT EXISTS idx_ai_reflections_journal_entry_id ON ai_reflections(journalEntryId);
CREATE INDEX IF NOT EXISTS idx_ai_reflections_user_id ON ai_reflections(userId);
CREATE INDEX IF NOT EXISTS idx_ai_reflections_created_at ON ai_reflections(createdAt);

-- Add RLS (Row Level Security) policies for journal_entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own journal entries
CREATE POLICY "Users can view own journal entries"
  ON journal_entries
  FOR SELECT
  USING (auth.uid() = userId);

-- Policy: Users can only insert their own journal entries and the userId must match their auth.uid
CREATE POLICY "Users can insert own journal entries"
  ON journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Policy: Users can only update their own journal entries
CREATE POLICY "Users can update own journal entries"
  ON journal_entries
  FOR UPDATE
  USING (auth.uid() = userId);

-- Policy: Users can only delete their own journal entries
CREATE POLICY "Users can delete own journal entries"
  ON journal_entries
  FOR DELETE
  USING (auth.uid() = userId);

-- Add RLS (Row Level Security) policies for ai_reflections
ALTER TABLE ai_reflections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own AI reflections
CREATE POLICY "Users can view own ai reflections"
  ON ai_reflections
  FOR SELECT
  USING (auth.uid() = userId);

-- Policy: Users can only insert their own AI reflections
CREATE POLICY "Users can insert own ai reflections"
  ON ai_reflections
  FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Policy: Users can only update their own AI reflections
CREATE POLICY "Users can update own ai reflections"
  ON ai_reflections
  FOR UPDATE
  USING (auth.uid() = userId);

-- Policy: Users can only delete their own AI reflections
CREATE POLICY "Users can delete own ai reflections"
  ON ai_reflections
  FOR DELETE
  USING (auth.uid() = userId);

-- Create storage bucket for trade chart images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trade-charts', 'trade-charts', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the trade-charts bucket
CREATE POLICY "Anyone can view trade charts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trade-charts');

CREATE POLICY "Authenticated users can upload trade charts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'trade-charts' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
