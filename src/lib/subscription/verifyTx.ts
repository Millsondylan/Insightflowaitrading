import { SUPPORTED_CHAINS } from '../wallet/chains';
import { convertUSDToCrypto } from './convertUSDToCrypto';
import { PlanType } from './subscriptionPlans';
import { WALLET_ADDRESSES } from '@/lib/config';

export interface TxVerificationResult {
  success: boolean;
  message: string;
  data?: {
    amount: number;
    fromAddress: string;
    toAddress: string;
    txHash: string;
    confirmed: boolean;
    timestamp: string;
  };
  error?: string;
}

/**
 * Verify a transaction on the blockchain
 * @param txHash Transaction hash
 * @param chainId Chain ID (e.g., 'BTC', 'ETH', 'TRX')
 * @param planId The subscription plan ID
 * @returns Promise that resolves to a verification result
 */
export const verifyTransaction = async (
  txHash: string, 
  chainId: string, 
  planId: PlanType
): Promise<TxVerificationResult> => {
  try {
    // Get the required amount for the plan in the selected cryptocurrency
    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    // Get plan price and target wallet address
    const planPriceUSD = getPlanPriceUSD(planId);
    const requiredAmount = await convertUSDToCrypto(planPriceUSD, chain.ticker);
    const targetWalletAddress = getWalletAddress(chainId);

    if (!targetWalletAddress) {
      throw new Error(`No receiving wallet configured for ${chainId}`);
    }

    console.log(`Required amount for ${planId} plan on ${chainId}: ${requiredAmount} ${chain.ticker}`);
    
    // Call the appropriate blockchain explorer API to verify the transaction
    // In a real app, we would make actual API calls to blockchain explorers
    const txData = await mockVerifyTransactionOnChain(
      txHash, 
      chainId, 
      targetWalletAddress,
      requiredAmount
    );

    if (!txData.valid) {
      return {
        success: false,
        message: txData.message || 'Invalid transaction',
        error: txData.error
      };
    }

    // If transaction is valid, return success result
    return {
      success: true,
      message: `Payment verified for ${planId} plan`,
      data: {
        amount: txData.amount,
        fromAddress: txData.fromAddress,
        toAddress: txData.toAddress,
        txHash,
        confirmed: txData.confirmed,
        timestamp: txData.timestamp
      }
    };
  } catch (error: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any) {
    console.error('Transaction verification error:', error);
    return {
      success: false,
      message: 'Failed to verify transaction',
      error: error.message
    };
  }
};

/**
 * Get the plan price in USD
 * @param planId The subscription plan ID
 * @returns The plan price in USD
 */
function getPlanPriceUSD(planId: PlanType): number {
  switch (planId) {
    case 'monthly': return 10;
    case 'quarterly': return 25;
    case 'yearly': return 50;
    default: throw new Error(`Unknown plan: ${planId}`);
  }
}

/**
 * Get the wallet address for a specific chain
 * @param chainId Chain ID (e.g., 'BTC', 'ETH', 'TRX')
 * @returns The wallet address for the specified chain
 */
function getWalletAddress(chainId: string): string | null {
  if (chainId === 'ETH') return WALLET_ADDRESSES.eth;
  if (chainId === 'BTC') return WALLET_ADDRESSES.btc;
  if (chainId === 'TRX') return WALLET_ADDRESSES.usdt;
  return null;
}

/**
 * Mock verification function - in a real app, this would call blockchain explorer APIs
 */
async function mockVerifyTransactionOnChain(
  txHash: string,
  chainId: string,
  targetAddress: string,
  requiredAmount: number
): Promise<{
  valid: boolean;
  confirmed: boolean;
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  message?: string;
  error?: string;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, validation is based on txHash format and simple checks
  // In a real app, we'd call the appropriate blockchain explorer API
  
  // Validate hash format
  let validFormat = false;
  let fromAddress = '';
  
  // Create a deterministic but seemingly random outcome based on the hash
  const hashSum = txHash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const randomFactor = hashSum % 100;
  const shouldSucceed = randomFactor > 20; // 80% chance to succeed
  
  // Generate a random amount near the required amount
  const paymentMultiplier = 0.8 + (hashSum % 40) / 100; // Between 0.8 and 1.2
  const amount = requiredAmount * paymentMultiplier;
  const sufficientAmount = amount >= requiredAmount;
  
  // Check chain-specific format
  if (chainId === 'BTC') {
    validFormat = /^[0-9a-f]{64}$/i.test(txHash);
    fromAddress = `1${txHash.substring(0, 33)}`;
  } else if (chainId === 'ETH') {
    validFormat = /^0x[0-9a-f]{64}$/i.test(txHash);
    fromAddress = `0x${txHash.substring(2, 42)}`;
  } else if (chainId === 'TRX') {
    validFormat = /^[0-9a-f]{64}$/i.test(txHash);
    fromAddress = `T${txHash.substring(0, 33)}`;
  }

  // Timestamp for the mock transaction
  const timestamp = new Date().toISOString();

  // Validation result
  if (!validFormat) {
    return {
      valid: false,
      confirmed: false,
      amount: 0,
      fromAddress: '',
      toAddress: targetAddress,
      timestamp,
      message: 'Invalid transaction hash format',
      error: 'FORMAT_ERROR'
    };
  }

  if (!shouldSucceed) {
    return {
      valid: false,
      confirmed: false,
      amount: 0,
      fromAddress,
      toAddress: targetAddress,
      timestamp,
      message: 'Transaction not found or pending',
      error: 'TX_NOT_FOUND'
    };
  }

  if (!sufficientAmount) {
    return {
      valid: false,
      confirmed: true,
      amount,
      fromAddress,
      toAddress: targetAddress,
      timestamp,
      message: `Payment amount too low: ${amount.toFixed(8)}`,
      error: 'INSUFFICIENT_AMOUNT'
    };
  }

  // Success case
  return {
    valid: true,
    confirmed: true,
    amount,
    fromAddress,
    toAddress: targetAddress,
    timestamp
  };
} 