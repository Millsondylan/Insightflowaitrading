export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: PlanFeature[];
  limits: PlanLimit[];
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  isIncluded: boolean;
  metadata?: Record<string, any>;
}

export interface PlanLimit {
  key: string;
  value: number;
  unit: string;
  description: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'crypto' | 'paypal';
  provider: string;
  details: Record<string, any>;
  isDefault: boolean;
  metadata?: Record<string, any>;
}

export interface PaymentProcessor {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'crypto';
  config: Record<string, any>;
  isActive: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethodId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  intentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processor: string;
  processorTransactionId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReceipt {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionEvent {
  id: string;
  subscriptionId: string;
  type: 'created' | 'renewed' | 'cancelled' | 'expired' | 'payment_failed';
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethodId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
}

export interface PlanDiscount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface TxVerificationResult {
  success: boolean;
  data?: {
    amount: number;
    fromAddress: string;
    txHash: string;
    timestamp: string;
  };
  error?: string;
}

export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export type SubscriptionStatus = 
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'suspended'
  | 'trial';

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  cryptoPrice?: number;
  cryptoCurrency?: string;
  cryptoAddress?: string;
  features: string[];
  interval: 'monthly' | 'yearly';
}

export interface paymentRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentHash?: string;
  createdAt: string;
}

export interface activityEvent {
  id: string;
  type: string;
  label: string;
  timestamp: string;
  userId: string;
  path?: string;
  metadata?: Record<string, any>;
}

// Additional missing types
export interface paymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'subscription' | 'one_time' | 'refund';
  createdAt: string;
  paymentMethodId?: string;
}

export interface livePaperAccount {
  id: string;
  balance: number;
  currency: string;
  status: 'active' | 'suspended';
}

export interface position {
  id: string;
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  side: 'long' | 'short';
}

export interface tradeOrder {
  id: string;
  symbol: string;
  quantity: number;
  orderType: 'market' | 'limit' | 'stop';
  direction: 'buy' | 'sell';
  timeInForce: 'day' | 'gtc' | 'ioc';
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  price?: number;
  stopPrice?: number;
  createdAt: string;
} 