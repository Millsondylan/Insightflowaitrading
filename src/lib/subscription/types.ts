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

export interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto' | 'paypal';
  details: {
    last4?: string;
    brand?: string;
    walletAddress?: string;
    email?: string;
  };
  isDefault: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  description: string;
  timestamp: number;
  metadata?: Record<string, any>;
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