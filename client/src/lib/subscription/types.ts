export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;  // milliseconds
  features: string[];
  limits: {
    strategies: number;
    backtests: number;
    alerts: number;
    apiCalls: number;
  };
}

export type PaymentMethod = 'card' | 'crypto' | 'paypal';

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

export interface PaymentRequest {
  userId?: string;
  method: PaymentMethod;
  details: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    name?: string;
    email: string;
  };
  tier: SubscriptionTier;
  amount?: number;
  currency?: string;
  description?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  createdAt: string;
  method: PaymentMethod;
}

export type SubscriptionStatus = 
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'suspended'
  | 'trial';

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: number;
  endDate: number;
  paymentMethod: PaymentMethod;
  lastPayment?: Payment;
  features: string[];
  metadata: {
    createdAt: number;
    platform: string;
    promoCode: string | null;
    lastUpdated?: number;
    cancellationReason?: string;
    cancelledAt?: number;
    lastRenewal?: number;
    previousPlan?: string;
    upgradedAt?: number;
  };
}

export interface SubscriptionEvent {
  type: 
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled'
    | 'subscription_renewed'
    | 'subscription_upgraded'
    | 'subscription_expired'
    | 'payment_failed';
  subscription: UserSubscription;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Add missing type definitions
export interface subscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  limits: Record<string, number>;
  addOns: planAddOn[];
  discounts: planDiscount[];
  metadata: {
    displayOrder: number;
    isPopular: boolean;
    recommendedFor: string[];
    customization: {
      color: string;
      icon: string;
      highlights: string[];
    };
    availability: {
      regions: string[];
      userTypes: string[];
      startDate?: Date;
      endDate?: Date;
    };
    requirements: {
      minUsers?: number;
      maxUsers?: number;
      verificationNeeded?: boolean;
      documents?: string[];
    };
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'deprecated' | 'discontinued';
}

export interface planDiscount {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: Date;
  endDate: Date;
  conditions: {
    minSubscriptionMonths?: number;
    maxUsageCount?: number;
    userTypes?: string[];
    regions?: string[];
  };
  metadata: Record<string, any>;
}

export interface planAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface paymentMethod {
  id: string;
  type: 'card' | 'crypto' | 'bank';
  last4?: string;
  brand?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'subscription' | 'one_time';
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

export interface TxVerificationResult {
  verified: boolean;
  transactionHash?: string;
  error?: string;
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
  userId?: string;
}

export interface paymentReceipt {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
  metadata?: Record<string, any>;
}

export interface PaymentTransaction {
  id: string;
  intentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
} 