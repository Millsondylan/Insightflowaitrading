-- Create user correlation settings table
CREATE TABLE IF NOT EXISTS public.user_correlation_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    favorite_pairs JSONB DEFAULT '[]'::jsonb,
    time_period TEXT DEFAULT '30d',
    color_palette TEXT DEFAULT 'blueRed',
    chart_type TEXT DEFAULT 'heatmap',
    alert_threshold DECIMAL DEFAULT 0.7,
    custom_assets TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create correlation matrix cache table
CREATE TABLE IF NOT EXISTS public.market_correlation_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assets TEXT[] NOT NULL,
    timeframe TEXT NOT NULL,
    matrix JSONB NOT NULL,
    data_points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index on correlation cache for faster lookups
CREATE INDEX IF NOT EXISTS correlation_cache_timeframe_idx ON public.market_correlation_cache(timeframe);
CREATE INDEX IF NOT EXISTS correlation_cache_expires_idx ON public.market_correlation_cache(expires_at);

-- Add additional fields to market_alerts table for correlation alerts
ALTER TABLE IF EXISTS public.market_alerts
ADD COLUMN IF NOT EXISTS correlation_value DECIMAL;

-- Add additional fields to user_notifications table for correlation alerts
ALTER TABLE IF EXISTS public.user_notifications
ADD COLUMN IF NOT EXISTS related_symbols TEXT[];

-- Add RLS policies for user correlation settings
ALTER TABLE public.user_correlation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own correlation settings" 
    ON public.user_correlation_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own correlation settings" 
    ON public.user_correlation_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own correlation settings" 
    ON public.user_correlation_settings FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on user_correlation_settings
CREATE TRIGGER update_user_correlation_settings_updated_at
    BEFORE UPDATE ON public.user_correlation_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 