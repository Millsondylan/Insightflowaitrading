-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tx_hash TEXT NOT NULL,
    cryptocurrency TEXT NOT NULL,
    amount TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 12,
    verification_timestamp TIMESTAMPTZ NOT NULL,
    confirmation_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_wallet_transactions_tx_hash ON wallet_transactions(tx_hash);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);

-- Add RLS policies
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY wallet_transactions_select_policy ON wallet_transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only the user can insert their own transactions
CREATE POLICY wallet_transactions_insert_policy ON wallet_transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Only the user can update their own transactions
CREATE POLICY wallet_transactions_update_policy ON wallet_transactions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_wallet_transactions_updated_at
BEFORE UPDATE ON wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_transactions_updated_at(); 