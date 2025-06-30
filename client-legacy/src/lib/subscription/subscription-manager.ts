import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '../db/types';
import { Strategy } from '../strategy/types';
import { SubscriptionPlan, PaymentMethod, SubscriptionStatus, UserSubscription } from './types';
import { plans } from './plans';
import { processPayment, refundPayment } from './payments';
import { handleSubscriptionEvent } from './lifecycle';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: {
    type: string;
    last4?: string;
    expiryDate?: string;
  };
  usage: {
    strategies: number;
    backtests: number;
    alerts: number;
    apiCalls: number;
  };
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  metadata: Record<string, any>;
  createdAt: Date;
}

export type TransactionType = 
  | 'subscription'
  | 'strategy_purchase'
  | 'referral_bonus'
  | 'content_sale';

export type TransactionStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface ReferralProgram {
  code: string;
  userId: string;
  referrals: number;
  earnings: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export class SubscriptionManager {
  private supabase: SupabaseClient;
  private readonly plans: SubscriptionPlan[];
  private readonly USAGE_CHECK_INTERVAL = 3600000; // 1 hour

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.plans = plans;
    this.startUsageChecks();
  }

  private startUsageChecks(): void {
    setInterval(() => this.checkUsageLimits(), this.USAGE_CHECK_INTERVAL);
  }

  async createSubscription(
    userId: string,
    planId: string,
    paymentMethod: PaymentMethod
  ): Promise<UserSubscription> {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    // Process initial payment
    const payment = await processPayment({
      userId,
      amount: plan.price,
      currency: plan.currency,
      paymentMethod,
      description: `Subscription to ${plan.name}`
    });

    // Create subscription record
    const subscription: UserSubscription = {
      id: this.generateSubscriptionId(),
      userId,
      planId,
      status: 'active',
      startDate: new Date().getTime(),
      endDate: this.calculateEndDate(plan.duration),
      paymentMethod,
      lastPayment: payment,
      features: plan.features,
      metadata: {
        createdAt: new Date().getTime(),
        platform: 'web',
        promoCode: null
      }
    };

    // Handle subscription creation lifecycle event
    await handleSubscriptionEvent({
      type: 'subscription_created',
      subscription,
      timestamp: new Date().getTime()
    });

    return subscription;
  }

  async updateSubscription(
    subscriptionId: string,
    updates: Partial<UserSubscription>
  ): Promise<UserSubscription> {
    // Validate updates
    if (updates.planId) {
      const newPlan = this.plans.find(p => p.id === updates.planId);
      if (!newPlan) {
        throw new Error(`Plan ${updates.planId} not found`);
      }
    }

    // Apply updates
    const subscription = await this.getSubscription(subscriptionId);
    const updatedSubscription = {
      ...subscription,
      ...updates,
      metadata: {
        ...subscription.metadata,
        lastUpdated: new Date().getTime()
      }
    };

    // Handle subscription update lifecycle event
    await handleSubscriptionEvent({
      type: 'subscription_updated',
      subscription: updatedSubscription,
      timestamp: new Date().getTime()
    });

    return updatedSubscription;
  }

  async cancelSubscription(
    subscriptionId: string,
    reason?: string
  ): Promise<UserSubscription> {
    const subscription = await this.getSubscription(subscriptionId);
    
    // Process refund if needed
    if (subscription.status === 'active' && subscription.lastPayment) {
      await refundPayment({
        paymentId: subscription.lastPayment.id,
        amount: this.calculateRefundAmount(subscription),
        reason: reason || 'Customer cancellation'
      });
    }

    // Update subscription status
    const cancelledSubscription = await this.updateSubscription(subscriptionId, {
      status: 'cancelled',
      metadata: {
        ...subscription.metadata,
        cancellationReason: reason,
        cancelledAt: new Date().getTime()
      }
    });

    // Handle subscription cancellation lifecycle event
    await handleSubscriptionEvent({
      type: 'subscription_cancelled',
      subscription: cancelledSubscription,
      timestamp: new Date().getTime()
    });

    return cancelledSubscription;
  }

  async processRenewal(subscriptionId: string): Promise<UserSubscription> {
    const subscription = await this.getSubscription(subscriptionId);
    const plan = this.plans.find(p => p.id === subscription.planId);

    if (!plan) {
      throw new Error(`Plan ${subscription.planId} not found`);
    }

    // Process renewal payment
    const payment = await processPayment({
      userId: subscription.userId,
      amount: plan.price,
      currency: plan.currency,
      paymentMethod: subscription.paymentMethod,
      description: `Renewal of ${plan.name} subscription`
    });

    // Update subscription
    const renewedSubscription = await this.updateSubscription(subscriptionId, {
      endDate: this.calculateEndDate(plan.duration, subscription.endDate),
      lastPayment: payment,
      metadata: {
        ...subscription.metadata,
        lastRenewal: new Date().getTime()
      }
    });

    // Handle subscription renewal lifecycle event
    await handleSubscriptionEvent({
      type: 'subscription_renewed',
      subscription: renewedSubscription,
      timestamp: new Date().getTime()
    });

    return renewedSubscription;
  }

  async upgradeSubscription(
    subscriptionId: string,
    newPlanId: string
  ): Promise<UserSubscription> {
    const subscription = await this.getSubscription(subscriptionId);
    const newPlan = this.plans.find(p => p.id === newPlanId);
    const oldPlan = this.plans.find(p => p.id === subscription.planId);

    if (!newPlan || !oldPlan) {
      throw new Error('Invalid plan');
    }

    // Calculate prorated amount
    const proratedAmount = this.calculateProratedAmount(
      subscription,
      oldPlan,
      newPlan
    );

    // Process upgrade payment
    const payment = await processPayment({
      userId: subscription.userId,
      amount: proratedAmount,
      currency: newPlan.currency,
      paymentMethod: subscription.paymentMethod,
      description: `Upgrade to ${newPlan.name}`
    });

    // Update subscription
    const upgradedSubscription = await this.updateSubscription(subscriptionId, {
      planId: newPlanId,
      features: newPlan.features,
      lastPayment: payment,
      metadata: {
        ...subscription.metadata,
        previousPlan: subscription.planId,
        upgradedAt: new Date().getTime()
      }
    });

    // Handle subscription upgrade lifecycle event
    await handleSubscriptionEvent({
      type: 'subscription_upgraded',
      subscription: upgradedSubscription,
      timestamp: new Date().getTime()
    });

    return upgradedSubscription;
  }

  private async getSubscription(id: string): Promise<UserSubscription> {
    // Implement subscription retrieval from database
    throw new Error('Not implemented');
  }

  private generateSubscriptionId(): string {
    return `sub_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateEndDate(duration: number, startFrom?: number): number {
    const start = startFrom || new Date().getTime();
    return start + duration;
  }

  private calculateRefundAmount(subscription: UserSubscription): number {
    if (!subscription.lastPayment) return 0;

    const now = new Date().getTime();
    const timeElapsed = now - subscription.startDate;
    const totalDuration = subscription.endDate - subscription.startDate;
    const unusedTime = totalDuration - timeElapsed;

    if (unusedTime <= 0) return 0;

    return (subscription.lastPayment.amount * unusedTime) / totalDuration;
  }

  private calculateProratedAmount(
    subscription: UserSubscription,
    oldPlan: SubscriptionPlan,
    newPlan: SubscriptionPlan
  ): number {
    const now = new Date().getTime();
    const unusedTime = subscription.endDate - now;
    const unusedAmount = (oldPlan.price * unusedTime) / oldPlan.duration;
    const newAmount = (newPlan.price * unusedTime) / newPlan.duration;

    return Math.max(0, newAmount - unusedAmount);
  }

  public async checkUsageLimits(): Promise<void> {
    const { data: activeSubscriptions, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error checking usage limits:', error);
      return;
    }

    await Promise.all(
      activeSubscriptions.map(async (subscription) => {
        const plan = this.plans.find(p => p.id === subscription.planId);
        if (!plan) return;

        // Check each limit
        const limits = ['strategies', 'backtests', 'alerts', 'apiCalls'] as const;
        for (const limit of limits) {
          if (subscription.usage[limit] >= plan.limits[limit]) {
            await this.handleLimitExceeded(subscription, limit);
          }
        }
      })
    );
  }

  public async trackUsage(
    userId: string,
    subscriptionId: string,
    type: keyof Subscription['usage'],
    increment: number = 1
  ): Promise<void> {
    const { data: subscription, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('userId', userId)
      .single();

    if (error || !subscription) {
      throw new Error('Subscription not found');
    }

    const plan = this.plans.find(p => p.id === subscription.planId);
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    const newUsage = subscription.usage[type] + increment;

    // Check if would exceed limit
    if (newUsage > plan.limits[type]) {
      throw new Error(`Usage limit exceeded for ${type}`);
    }

    // Update usage
    const { error: updateError } = await this.supabase
      .from('subscriptions')
      .update({
        usage: {
          ...subscription.usage,
          [type]: newUsage
        }
      })
      .eq('id', subscriptionId);

    if (updateError) {
      throw new Error('Failed to update usage');
    }

    // Log usage
    await this.logSubscriptionEvent(subscriptionId, 'usage_updated', {
      userId,
      type,
      increment,
      newTotal: newUsage
    });
  }

  private async handleLimitExceeded(
    subscription: Subscription,
    limit: keyof Subscription['usage']
  ): Promise<void> {
    // Log event
    await this.logSubscriptionEvent(subscription.id, 'limit_exceeded', {
      userId: subscription.userId,
      limit,
      currentUsage: subscription.usage[limit]
    });

    // Notify user
    await this.notifyUser(subscription.userId, 'limit_exceeded', {
      limit,
      currentUsage: subscription.usage[limit]
    });
  }

  private async updateUserSubscription(
    userId: string,
    subscriptionId: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        subscriptionId,
        subscriptionStatus: 'active'
      })
      .eq('id', userId);

    if (error) {
      throw new Error('Failed to update user subscription');
    }
  }

  private async logSubscriptionEvent(
    subscriptionId: string,
    event: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('subscription_events')
      .insert({
        subscriptionId,
        event,
        metadata,
        timestamp: new Date()
      });

    if (error) {
      console.error('Failed to log subscription event:', error);
    }
  }

  private async notifyUser(
    userId: string,
    notificationType: string,
    data: Record<string, any>
  ): Promise<void> {
    // Implementation would depend on notification system
    const { error } = await this.supabase
      .from('notifications')
      .insert({
        userId,
        type: notificationType,
        data,
        read: false,
        timestamp: new Date()
      });

    if (error) {
      console.error('Failed to create notification:', error);
    }
  }

  public async addPaymentMethod(
    userId: string,
    method: Omit<paymentMethod, 'id'>
  ): Promise<paymentMethod> {
    // Implement payment method addition
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...method
    };
  }

  public async createReferralProgram(
    userId: string
  ): Promise<ReferralProgram> {
    const code = this.generateReferralCode();
    
    const program: ReferralProgram = {
      code,
      userId,
      referrals: 0,
      earnings: 0,
      status: 'active',
      createdAt: new Date()
    };

    // Save to database
    await this.saveReferralProgram(program);

    return program;
  }

  private generateReferralCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private async saveReferralProgram(program: ReferralProgram): Promise<void> {
    // Save to database
  }

  public async processReferral(
    referralCode: string,
    newUserId: string
  ): Promise<void> {
    const program = await this.getReferralProgram(referralCode);
    if (!program || program.status !== 'active') {
      throw new Error('Invalid referral code');
    }

    // Update referral stats
    program.referrals++;
    program.earnings += 50;  // $50 per referral

    // Create referral bonus transaction
    await this.processPayment({
      userId: program.userId,
      amount: 50,
      currency: 'USD',
      type: 'referral_bonus',
      metadata: {
        referralCode,
        newUserId
      }
    });

    // Save updated program
    await this.saveReferralProgram(program);
  }

  private async getReferralProgram(code: string): Promise<ReferralProgram | null> {
    // Fetch from database
    return null;
  }

  public async createStrategyMarketplace(
    strategy: Strategy,
    price: number
  ): Promise<void> {
    // Implement strategy marketplace listing
  }

  public async purchaseStrategy(
    userId: string,
    strategyId: string,
    paymentMethod: PaymentMethod
  ): Promise<transaction> {
    // Implement strategy purchase
    return {} as Transaction;
  }

  public async getSubscriptionMetrics(): Promise<{
    totalRevenue: number;
    activeSubscribers: number;
    churnRate: number;
    averageRevenuePerUser: number;
  }> {
    // Implement subscription metrics calculation
    return {
      totalRevenue: 0,
      activeSubscribers: 0,
      churnRate: 0,
      averageRevenuePerUser: 0
    };
  }

  public async getUsageMetrics(userId: string): Promise<{
    strategiesUsed: number;
    backtestsRun: number;
    apiCallsMade: number;
  }> {
    // Implement usage metrics calculation
    return {
      strategiesUsed: 0,
      backtestsRun: 0,
      apiCallsMade: 0
    };
  }
} 