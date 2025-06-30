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