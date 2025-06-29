-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL UNIQUE,
  uses_count INT DEFAULT 0,
  max_uses INT DEFAULT 10,
  discount_percent INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Add RLS policies
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Users can view their own referral codes
CREATE POLICY referral_codes_select_policy
  ON referral_codes FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can create referral codes for now
CREATE POLICY referral_codes_insert_policy
  ON referral_codes FOR INSERT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE auth.email() IN (SELECT email FROM admin_users)
    )
  );

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_unique_referral_code(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Generate a random code with user prefix
  SELECT CONCAT(
    SUBSTRING(
      (SELECT email FROM auth.users WHERE id = user_id),
      1, 3
    ),
    '-',
    UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6))
  ) INTO new_code;
  
  -- Check if code already exists
  SELECT EXISTS(
    SELECT 1 FROM referral_codes WHERE code = new_code
  ) INTO code_exists;
  
  -- If code exists, recursively try again
  IF code_exists THEN
    RETURN generate_unique_referral_code(user_id);
  END IF;
  
  RETURN new_code;
END;
$$; 