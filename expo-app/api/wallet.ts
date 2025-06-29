import { supabase } from '@/lib/supabase';

interface PlanDetails {
  amount: number;
  interval: string;
  duration: string;
}

interface Plans {
  [key: string]: PlanDetails;
}

/**
 * Get payment details for a subscription plan
 */
export async function getPaymentDetails(userId: string, plan: string) {
  // Mock payment data
  const plans: Plans = {
    monthly: {
      amount: 29.99,
      interval: 'monthly',
      duration: '30 days',
    },
    quarterly: {
      amount: 79.99,
      interval: 'quarterly',
      duration: '90 days',
    },
    annual: {
      amount: 299.99,
      interval: 'annual',
      duration: '365 days',
    },
  };

  const cryptoWallets = {
    BTC: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    ETH: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    USDT: 'TKQvCcExwTNtBNiNfJZPKVKGMgwK3eSqz3',
  };

  // In a real implementation, you would fetch this from a database
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      plan: plan,
      planDetails: plans[plan] || plans.monthly,
      wallets: cryptoWallets,
      expiresIn: 3600, // 1 hour to complete payment
      orderId: `order-${Date.now()}-${userId.substring(0, 8)}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting payment details:', error);
    throw new Error('Failed to get payment details');
  }
}

/**
 * Verify a crypto transaction for subscription payment
 */
export async function verifyTransaction(
  userId: string,
  plan: string,
  walletAddress: string,
  txHash: string,
  currency: string
) {
  // In a real implementation, this would call a blockchain API to verify the transaction
  try {
    // Simulate API call delay and verification process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock a successful verification
    const success = true; // In reality, this would be based on the blockchain verification
    
    if (success) {
      return {
        status: 'success',
        message: 'Payment verified successfully',
        transactionId: txHash,
        subscription: {
          userId,
          plan,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          status: 'active',
        },
      };
    } else {
      return {
        status: 'failed',
        message: 'Payment verification failed',
        reason: 'Transaction not found or insufficient amount',
      };
    }
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw new Error('Failed to verify transaction');
  }
}

/**
 * Get current exchange rates for crypto currencies
 */
export async function getExchangeRate() {
  // In a real implementation, this would call an exchange API
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock exchange rates (these would come from an API in reality)
    return {
      BTC: {
        USD: 38742.50,
        EUR: 35821.45,
      },
      ETH: {
        USD: 2194.25,
        EUR: 2032.15,
      },
      USDT: {
        USD: 1,
        EUR: 0.925,
      },
    };
  } catch (error) {
    console.error('Error getting exchange rates:', error);
    throw new Error('Failed to get exchange rates');
  }
}

/**
 * Calculate the equivalent crypto amount based on fiat amount and exchange rate
 */
export function calculateCryptoAmount(fiatAmount: number, rate: number, currency: string) {
  if (!rate) return 0;
  
  const amount = fiatAmount / rate;
  
  // Format the amount based on the cryptocurrency
  switch (currency) {
    case 'BTC':
      return parseFloat(amount.toFixed(8)); // BTC typically uses 8 decimal places
    case 'ETH':
      return parseFloat(amount.toFixed(6)); // ETH typically uses 6 decimal places
    case 'USDT':
      return parseFloat(amount.toFixed(2)); // USDT typically uses 2 decimal places
    default:
      return parseFloat(amount.toFixed(6));
  }
} 