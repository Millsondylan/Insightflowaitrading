import { supabase } from '@/integrations/supabase/client';
import { PlanType } from './subscriptionPlans';
import { TxVerificationResult } from './verifyTx';

export interface PaymentRecord {
  userWallet: string;
  plan: PlanType;
  chain: string;
  amount: number;
  txHash: string;
  confirmedAt: string;
}

/**
 * Save a verified payment to Supabase
 * @param userId The user's ID
 * @param paymentInfo The payment information
 * @returns Promise that resolves to the saved payment record
 */
export const savePayment = async (
  userId: string,
  payment: {
    plan: PlanType;
    chain: string;
    txResult: TxVerificationResult;
  }
): Promise<PaymentRecord> => {
  if (!payment.txResult.success || !payment.txResult.data) {
    throw new Error('Cannot save unsuccessful payment');
  }

  const { plan, chain, txResult } = payment;
  const { amount, fromAddress, txHash, timestamp } = txResult.data;

  // Prepare the payment record
  const paymentRecord: PaymentRecord = {
    userWallet: fromAddress,
    plan,
    chain,
    amount,
    txHash,
    confirmedAt: timestamp
  };

  try {
    // Calculate expiry based on plan duration
    const now = new Date();
    let expiryDate = new Date(now);

    switch (plan) {
      case 'monthly':
        expiryDate.setDate(now.getDate() + 30);
        break;
      case 'quarterly':
        expiryDate.setDate(now.getDate() + 90);
        break;
      case 'yearly':
        expiryDate.setDate(now.getDate() + 365);
        break;
    }

    // Save the payment record to Supabase using the existing subscriptions table
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        amount: amount,
        created_at: new Date().toISOString(),
        currency: chain,
        expires_at: expiryDate.toISOString(),
        payment_hash: txHash,
        status: 'active',
        tier: plan,
        user_id: userId
      }]);

    if (error) {
      console.error('Error saving payment to Supabase:', error);
      throw new Error(`Failed to save payment: ${error.message}`);
    }

    console.log('Payment saved successfully:', data);

    // Update user's subscription info in profile
    await updateUserSubscription(userId, plan, expiryDate.toISOString());

    return paymentRecord;
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};

/**
 * Update a user's subscription in Supabase
 * @param userId The user's ID
 * @param plan The subscription plan
 * @param expiryDate The subscription expiry date
 */
async function updateUserSubscription(userId: string, plan: PlanType, expiryDate: string): Promise<void> {
  try {
    const now = new Date();
    
    // Update the user's profile with subscription info
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: plan,
        subscription_end: expiryDate,
        updated_at: now.toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user subscription:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update user subscription:', error);
    throw error;
  }
} 