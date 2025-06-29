-- Referral program tables and enhancements

-- Table to track referrals between users
CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_id UUID NOT NULL REFERENCES profiles(id),
  referral_code TEXT NOT NULL,
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  earnings_percentage DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_referrer FOREIGN KEY (referrer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_referred FOREIGN KEY (referred_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT unique_referral UNIQUE (referrer_id, referred_id)
);

-- Table to track referral payments
CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_id UUID NOT NULL REFERENCES profiles(id),
  referral_id UUID NOT NULL REFERENCES user_referrals(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  original_payment_amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  payment_method TEXT,
  wallet_address TEXT,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_referrer FOREIGN KEY (referrer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_referred FOREIGN KEY (referred_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_referral FOREIGN KEY (referral_id) REFERENCES user_referrals(id) ON DELETE CASCADE
);

-- Table to store user referral codes
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  code TEXT NOT NULL UNIQUE,
  clicks_count INTEGER DEFAULT 0,
  signups_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table to track PineScript shares and counts for free tier upgrades
CREATE TABLE IF NOT EXISTS pinescript_share_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  shares_count INTEGER DEFAULT 0,
  months_earned INTEGER DEFAULT 0,
  last_redemption_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Add referral-related columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS total_referral_earnings DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS referral_payout_wallet TEXT;

-- Function to generate a unique referral code
CREATE OR REPLACE FUNCTION generate_unique_referral_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random code (alphanumeric, 8 characters)
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to update PineScript share rewards
CREATE OR REPLACE FUNCTION update_pinescript_share_rewards()
RETURNS TRIGGER AS $$
BEGIN
  -- Get current count of shares for this user
  DECLARE
    current_count INTEGER;
    current_earned INTEGER;
  BEGIN
    SELECT COALESCE(shares_count, 0), COALESCE(months_earned, 0)
    INTO current_count, current_earned
    FROM pinescript_share_rewards
    WHERE user_id = NEW.user_id;
    
    IF NOT FOUND THEN
      -- Create new record if doesn't exist
      INSERT INTO pinescript_share_rewards (user_id, shares_count, months_earned)
      VALUES (NEW.user_id, 1, 0);
    ELSE
      -- Update existing record
      UPDATE pinescript_share_rewards
      SET shares_count = current_count + 1,
          months_earned = FLOOR((current_count + 1) / 5),
          updated_at = NOW()
      WHERE user_id = NEW.user_id;
      
      -- If they've reached a new multiple of 5, extend their subscription
      IF FLOOR((current_count + 1) / 5) > current_earned THEN
        -- Extend subscription by 30 days
        UPDATE profiles
        SET limit_pinescript = FALSE,
            subscription_end = CASE
                WHEN subscription_end IS NULL OR subscription_end < NOW() THEN NOW() + INTERVAL '30 days'
                ELSE subscription_end + INTERVAL '30 days'
            END
        WHERE id = NEW.user_id;
      END IF;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment share count and reward user
CREATE TRIGGER trigger_pinescript_share_rewards
AFTER INSERT ON pinescript_shares
FOR EACH ROW
WHEN (NEW.is_public = TRUE)
EXECUTE FUNCTION update_pinescript_share_rewards();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer_id ON user_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred_id ON user_referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_referrer_id ON referral_earnings(referrer_id);
CREATE INDEX IF NOT EXISTS idx_pinescript_share_rewards_user_id ON pinescript_share_rewards(user_id); 