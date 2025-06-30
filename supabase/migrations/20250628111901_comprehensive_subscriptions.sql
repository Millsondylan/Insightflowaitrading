-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_usd NUMERIC NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'pending')),
    is_trial BOOLEAN DEFAULT false,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('crypto', 'credit_card', 'free_trial', 'referral')),
    payment_details JSONB DEFAULT '{}',
    crypto_tx_hash TEXT,
    crypto_amount TEXT,
    crypto_currency TEXT,
    renewal_reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_usd, duration_days, features)
VALUES 
('Free Trial', 'Access all features for 14 days', 0, 14, '{"ai_trading": true, "strategy_builder": true, "backtest": true, "journal": true}'),
('Monthly', 'Monthly subscription with all features', 29.99, 30, '{"ai_trading": true, "strategy_builder": true, "backtest": true, "journal": true, "priority_support": true}'),
('Quarterly', 'Save 15% with quarterly billing', 76.99, 90, '{"ai_trading": true, "strategy_builder": true, "backtest": true, "journal": true, "priority_support": true}'),
('Yearly', 'Save 25% with annual billing', 269.99, 365, '{"ai_trading": true, "strategy_builder": true, "backtest": true, "journal": true, "priority_support": true, "premium_strategies": true}')
ON CONFLICT DO NOTHING;

-- Create wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    tx_hash TEXT NOT NULL UNIQUE,
    cryptocurrency TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    confirmation_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_tx_hash ON wallet_transactions(tx_hash);

-- Add RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY subscriptions_select_policy ON subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can view subscription plans
CREATE POLICY subscription_plans_select_policy ON subscription_plans
    FOR SELECT
    USING (true);

-- Users can view their own wallet transactions
CREATE POLICY wallet_transactions_select_policy ON wallet_transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_subscriptions_updated_at();

-- Function to create a free trial subscription
CREATE OR REPLACE FUNCTION create_free_trial_subscription()
RETURNS TRIGGER AS $$
DECLARE
    trial_plan_id UUID;
    trial_days INTEGER := 14; -- 14 day trial by default
BEGIN
    -- Get the ID of the Free Trial plan
    SELECT id INTO trial_plan_id FROM subscription_plans WHERE name = 'Free Trial' LIMIT 1;
    
    -- If we found a trial plan, create a subscription
    IF trial_plan_id IS NOT NULL THEN
        INSERT INTO subscriptions (
            user_id,
            plan_id,
            status,
            is_trial,
            starts_at,
            expires_at,
            payment_method
        )
        VALUES (
            NEW.id, 
            trial_plan_id,
            'trial',
            true,
            NOW(),
            NOW() + (trial_days || ' days')::INTERVAL,
            'free_trial'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up trigger on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_free_trial_subscription(); 