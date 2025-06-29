-- Create a table for caching market correlation data
CREATE TABLE IF NOT EXISTS market_correlations_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_set TEXT NOT NULL,  -- JSON string of sorted asset symbols
  timeframe TEXT NOT NULL,  -- 1d, 7d, 30d, 90d, 1y
  correlation_data JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_asset_timeframe UNIQUE (asset_set, timeframe)
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_market_correlations_asset_time ON market_correlations_cache(asset_set, timeframe);

-- Create a function to clean up old cache entries
CREATE OR REPLACE FUNCTION cleanup_old_correlations()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete cache entries older than 7 days
  DELETE FROM market_correlations_cache
  WHERE last_updated < NOW() - INTERVAL '7 days';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically clean up old cache entries
DROP TRIGGER IF EXISTS trigger_cleanup_correlations ON market_correlations_cache;
CREATE TRIGGER trigger_cleanup_correlations
AFTER INSERT ON market_correlations_cache
FOR EACH STATEMENT
EXECUTE FUNCTION cleanup_old_correlations(); 