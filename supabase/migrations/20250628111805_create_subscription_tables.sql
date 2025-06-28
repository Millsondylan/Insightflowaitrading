-- Create subscription plans table
CREATE TABLE subscription_plans (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  duration BIGINT NOT NULL,  -- in milliseconds
  features JSONB NOT NULL DEFAULT '[]',
  limits JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create plan add-ons table
CREATE TABLE plan_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id VARCHAR REFERENCES subscription_plans(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_amount DECIMAL(10, 2) NOT NULL,
  price_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  features JSONB NOT NULL DEFAULT '[]',
  limits JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'discontinued')),
  CONSTRAINT valid_addon_price_amount CHECK (price_amount >= 0)
);

-- Create plan discounts table
CREATE TABLE plan_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id VARCHAR REFERENCES subscription_plans(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(10) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'canceled')),
  CONSTRAINT valid_discount_value CHECK (value >= 0),
  CONSTRAINT valid_discount_dates CHECK (end_date > start_date)
);

-- Create payment methods table
CREATE TABLE payment_methods (
  id VARCHAR PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE payments (
  id VARCHAR PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id VARCHAR REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR NOT NULL,
  payment_method_id VARCHAR REFERENCES payment_methods(id) ON DELETE SET NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id VARCHAR PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status VARCHAR NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method_id VARCHAR REFERENCES payment_methods(id) ON DELETE SET NULL,
  last_payment_id VARCHAR REFERENCES payments(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subscription events table
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id VARCHAR NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create usage tracking table
CREATE TABLE subscription_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id VARCHAR NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  metric VARCHAR NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subscription_id, metric, period_start, period_end)
);

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_subscription_events_subscription_id ON subscription_events(subscription_id);
CREATE INDEX idx_subscription_events_type ON subscription_events(type);
CREATE INDEX idx_subscription_usage_subscription_id ON subscription_usage(subscription_id);
CREATE INDEX idx_subscription_usage_metric ON subscription_usage(metric);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_usage_updated_at
  BEFORE UPDATE ON subscription_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Plans are readable by all authenticated users
CREATE POLICY "Plans are readable by all users"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (true);

-- Payment methods are only accessible by their owners
CREATE POLICY "Payment methods are only accessible by their owners"
  ON payment_methods FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Payments are only accessible by their owners
CREATE POLICY "Payments are only accessible by their owners"
  ON payments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Subscriptions are only accessible by their owners
CREATE POLICY "Subscriptions are only accessible by their owners"
  ON subscriptions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Subscription events are only accessible by subscription owners
CREATE POLICY "Subscription events are only accessible by subscription owners"
  ON subscription_events FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM subscriptions 
      WHERE id = subscription_id
    )
  );

-- Usage data is only accessible by subscription owners
CREATE POLICY "Usage data is only accessible by subscription owners"
  ON subscription_usage FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM subscriptions 
      WHERE id = subscription_id
    )
  );

-- Add-ons are readable by all authenticated users
CREATE POLICY "Add-ons are readable by all authenticated users"
  ON plan_addons
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Discounts are readable by all authenticated users
CREATE POLICY "Discounts are readable by all authenticated users"
  ON plan_discounts
  FOR SELECT
  TO authenticated
  USING (status = 'active'); 