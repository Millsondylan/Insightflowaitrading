
-- Create missing tables for the application

-- AI suggested setups table
CREATE TABLE IF NOT EXISTS public.ai_suggested_setups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
    entry_price NUMERIC NOT NULL,
    stop_loss NUMERIC NOT NULL,
    take_profit NUMERIC NOT NULL,
    rationale TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User saved setups table
CREATE TABLE IF NOT EXISTS public.user_saved_setups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    setup_id UUID REFERENCES public.ai_suggested_setups(id) ON DELETE CASCADE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market correlations table
CREATE TABLE IF NOT EXISTS public.market_correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol_pair TEXT[] NOT NULL,
    correlation_value NUMERIC NOT NULL,
    timeframe TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    data_points INTEGER NOT NULL,
    correlation_trend NUMERIC[],
    significance_level NUMERIC,
    color_palette JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorite pairs table
CREATE TABLE IF NOT EXISTS public.user_favorite_pairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol_pair TEXT[] NOT NULL,
    notify_on_inverse_correlation BOOLEAN DEFAULT FALSE,
    correlation_threshold NUMERIC DEFAULT 0.8,
    custom_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market setups table
CREATE TABLE IF NOT EXISTS public.market_setups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    entry NUMERIC NOT NULL,
    sl NUMERIC NOT NULL,
    tp NUMERIC NOT NULL,
    trade_type TEXT NOT NULL CHECK (trade_type IN ('LONG', 'SHORT')),
    confidence_score NUMERIC DEFAULT 0,
    pattern_description TEXT,
    indicator_data JSONB,
    ai_generated BOOLEAN DEFAULT FALSE,
    strategy_id UUID,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User authentication sessions table
CREATE TABLE IF NOT EXISTS public.user_auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    authenticated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User referrals table
CREATE TABLE IF NOT EXISTS public.user_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    earnings_percentage NUMERIC DEFAULT 10
);

-- Referral earnings table
CREATE TABLE IF NOT EXISTS public.referral_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed'))
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tx_hash TEXT NOT NULL UNIQUE,
    cryptocurrency TEXT NOT NULL,
    amount TEXT,
    status TEXT NOT NULL,
    confirmation_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'dark',
    timezone TEXT DEFAULT 'UTC',
    notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading volume data table
CREATE TABLE IF NOT EXISTS public.trading_volume_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL,
    volume NUMERIC NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    timeframe TEXT DEFAULT '1d'
);

-- Add referral fields to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referral_payout_wallet TEXT,
ADD COLUMN IF NOT EXISTS total_referral_earnings NUMERIC DEFAULT 0;

-- Enable RLS on all new tables
ALTER TABLE public.ai_suggested_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_volume_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own suggested setups" ON public.ai_suggested_setups
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suggested setups" ON public.ai_suggested_setups
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggested setups" ON public.ai_suggested_setups
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suggested setups" ON public.ai_suggested_setups
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own saved setups" ON public.user_saved_setups
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved setups" ON public.user_saved_setups
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved setups" ON public.user_saved_setups
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved setups" ON public.user_saved_setups
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view market correlations" ON public.market_correlations
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view their favorite pairs" ON public.user_favorite_pairs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their favorite pairs" ON public.user_favorite_pairs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their favorite pairs" ON public.user_favorite_pairs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their favorite pairs" ON public.user_favorite_pairs
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public market setups" ON public.market_setups
FOR SELECT TO authenticated USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own market setups" ON public.market_setups
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own market setups" ON public.market_setups
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own market setups" ON public.market_setups
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their auth sessions" ON public.user_auth_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their auth sessions" ON public.user_auth_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their auth sessions" ON public.user_auth_sessions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their auth sessions" ON public.user_auth_sessions
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their referral data" ON public.user_referrals
FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can view their earnings" ON public.referral_earnings
FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view their wallet transactions" ON public.wallet_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their wallet transactions" ON public.wallet_transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their wallet transactions" ON public.wallet_transactions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their wallet transactions" ON public.wallet_transactions
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their preferences" ON public.user_preferences
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their preferences" ON public.user_preferences
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their preferences" ON public.user_preferences
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their preferences" ON public.user_preferences
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view trading volume data" ON public.trading_volume_data
FOR SELECT TO authenticated USING (true);

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate random 8-character code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT EXISTS(
            SELECT 1 FROM public.profiles WHERE referral_code = code
        ) INTO exists_check;
        
        -- If code doesn't exist, return it
        IF NOT exists_check THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$;
