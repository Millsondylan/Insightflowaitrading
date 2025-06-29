-- Create chart_analysis table for ML vision processing
CREATE TABLE IF NOT EXISTS chart_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  yolo_json JSONB,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  asset_symbol TEXT,
  timeframe TEXT,
  tags TEXT[]
);

-- Add indexes
CREATE INDEX chart_analysis_user_id_idx ON chart_analysis (user_id);
CREATE INDEX chart_analysis_asset_symbol_idx ON chart_analysis (asset_symbol);

-- Add Row Level Security
ALTER TABLE chart_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own chart analysis"
  ON chart_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chart analysis"
  ON chart_analysis FOR INSERT
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chart analysis"
  ON chart_analysis FOR UPDATE
  USING (auth.uid() = user_id); 