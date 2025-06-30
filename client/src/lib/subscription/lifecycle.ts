import { supabase } from '../../integrations/supabase/client';
import { SubscriptionPlan, UserSubscription, PaymentMethod, PaymentProcessor, SubscriptionEvent, PaymentIntent } from './types';

// Extend PaymentProcessor interface
interface ExtendedPaymentProcessor extends PaymentProcessor {
  createPaymentIntent(params: any): Promise<PaymentIntent>;
  processPayment(intentId: string): Promise<any>;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'suspended' | 'trial';
  startDate: Date;
  endDate: Date;
  trialEndDate?: Date;
  currentPeriod: {
    startDate: Date;
    endDate: Date;
    isTrialPeriod: boolean;
  };
  paymentMethod: PaymentMethod;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
  addOns: {
    id: string;
    startDate: Date;
    endDate?: Date;
    autoRenew: boolean;
  }[];
  usage: {
    strategies: number;
    backtests: number;
    alerts: number;
    apiCalls: number;
  };
  billingHistory: {
    invoiceId: string;
    amount: number;
    status: string;
    date: Date;
  }[];
  metadata: {
    lastModifiedBy: string;
    lastModifiedAt: Date;
    notes: string;
    customFields: Record<string, any>;
  };
  version: number;
}

export class SubscriptionLifecycle {
  private paymentProcessor: ExtendedPaymentProcessor;
  private readonly RENEWAL_CHECK_INTERVAL = 3600000; // 1 hour
  private readonly TRIAL_CHECK_INTERVAL = 3600000; // 1 hour
  private readonly USAGE_CHECK_INTERVAL = 3600000; // 1 hour

  constructor(paymentProcessor: ExtendedPaymentProcessor) {
    this.paymentProcessor = paymentProcessor;
    this.startBackgroundTasks();
  }

  private startBackgroundTasks(): void {
    setInterval(() => this.checkRenewals(), this.RENEWAL_CHECK_INTERVAL);
    setInterval(() => this.checkTrials(), this.TRIAL_CHECK_INTERVAL);
    setInterval(() => this.checkUsageLimits(), this.USAGE_CHECK_INTERVAL);
  }

  public async createSubscription({
    userId,
    planId,
    paymentMethod,
    addOnIds = [],
    discountIds = [],
    isRecurring = true,
    isSetupFee = false,
    isTrial = false
  }: {
    userId: string;
    planId: string;
    paymentMethod: PaymentMethod;
    addOnIds?: string[];
    discountIds?: string[];
    isRecurring?: boolean;
    isSetupFee?: boolean;
    isTrial?: boolean;
  }): Promise<UserSubscription> {
    try {
      // Create subscription record
      const { data: subscription, error } = await (supabase as any)
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: isTrial ? 'trial' : 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          auto_renew: isRecurring,
          metadata: {
            addOnIds,
            discountIds,
            isSetupFee,
            isTrial
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Log subscription event
      await this.logSubscriptionEvent({
        subscriptionId: subscription.id,
        type: 'created',
        description: `Subscription created for plan ${planId}`,
        metadata: { planId, isTrial, isRecurring }
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async cancelSubscription(subscriptionId: string, reason?: string): Promise<UserSubscription> {
    try {
      const { data: subscription, error } = await (supabase as any)
        .from('subscriptions')
        .update({
          status: 'cancelled',
          metadata: {
            cancellationReason: reason,
            cancelledAt: new Date().toISOString()
          }
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;

      // Log cancellation event
      await this.logSubscriptionEvent({
        subscriptionId: subscription.id,
        type: 'cancelled',
        description: `Subscription cancelled${reason ? `: ${reason}` : ''}`,
        metadata: { reason }
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async changePlan(subscriptionId: string, newPlanId: string): Promise<UserSubscription> {
    try {
      const { data: subscription, error } = await (supabase as any)
        .from('subscriptions')
        .update({
          plan_id: newPlanId,
          metadata: {
            planChangedAt: new Date().toISOString(),
            previousPlan: newPlanId
          }
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;

      // Log plan change event
      await this.logSubscriptionEvent({
        subscriptionId: subscription.id,
        type: 'renewed',
        description: `Plan changed to ${newPlanId}`,
        metadata: { newPlanId, previousPlan: subscription.plan_id }
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to change plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async updatePaymentMethod(subscriptionId: string, paymentMethod: PaymentMethod): Promise<UserSubscription> {
    try {
      const { data: subscription, error } = await (supabase as any)
        .from('subscriptions')
        .update({
          payment_method_id: paymentMethod.id,
          metadata: {
            paymentMethodUpdatedAt: new Date().toISOString()
          }
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;

      return subscription;
    } catch (error) {
      throw new Error(`Failed to update payment method: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    try {
      const { data: subscription, error } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (error) throw error;
      return subscription;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  public async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    try {
      const { data: subscriptions, error } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return subscriptions || [];
    } catch (error) {
      console.error('Failed to get user subscriptions:', error);
      return [];
    }
  }

  private async checkRenewals(): Promise<void> {
    try {
      // Get subscriptions due for renewal
      const { data: subscriptions } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .eq('status', 'active')
        .eq('autoRenew', true)
        .lte('endDate', new Date(Date.now() + 24 * 60 * 60 * 1000)); // Due within 24 hours

      if (!subscriptions) return;

      await Promise.all(
        subscriptions.map(async (subscription) => {
          try {
            await this.processRenewal(subscription);
          } catch (error) {
            console.error(`Failed to process renewal for subscription ${subscription.id}:`, error);
          }
        })
      );
    } catch (error) {
      console.error('Failed to check renewals:', error);
    }
  }

  private async processRenewal(subscription: Subscription): Promise<void> {
    try {
      // Create payment intent
      const paymentIntent = await this.paymentProcessor.createPaymentIntent({
        userId: subscription.userId,
        planId: subscription.planId,
        paymentMethod: subscription.paymentMethod,
        addOnIds: subscription.addOns.map(addon => addon.id),
        isRecurring: true
      });

      // Process payment
      await this.paymentProcessor.processPayment(paymentIntent.id);

      // Calculate new dates
      const newStartDate = new Date(subscription.endDate);
      const newEndDate = new Date(newStartDate);
      newEndDate.setMonth(newEndDate.getMonth() + (subscription.currentPeriod.endDate.getTime() - subscription.currentPeriod.startDate.getTime() > 31536000000 ? 12 : 1));

      // Update subscription
      await (supabase as any)
        .from('subscriptions')
        .update({
          currentPeriod: {
            startDate: newStartDate,
            endDate: newEndDate,
            isTrialPeriod: false
          },
          endDate: newEndDate,
          billingHistory: [
            ...subscription.billingHistory,
            {
              invoiceId: paymentIntent.id,
              amount: paymentIntent.amount,
              status: 'paid',
              date: new Date()
            }
          ]
        })
        .eq('id', subscription.id);

      // Log event
      await this.logSubscriptionEvent({
        subscriptionId: subscription.id,
        type: 'renewed',
        description: `Subscription renewed for plan ${subscription.planId}`,
        metadata: { newStartDate, newEndDate, paymentIntentId: paymentIntent.id }
      });
    } catch (error) {
      // Handle failed renewal
      await this.handleFailedRenewal(subscription, error as Error);
    }
  }

  private async handleFailedRenewal(subscription: Subscription, error: Error): Promise<void> {
    // Implementation for handling failed renewal
    console.error('Failed renewal for subscription:', subscription.id, error);
  }

  private async checkTrials(): Promise<void> {
    try {
      // Get trials ending soon
      const { data: trials } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .eq('status', 'trial')
        .lte('trialEndDate', new Date(Date.now() + 24 * 60 * 60 * 1000)); // Ending within 24 hours

      if (!trials) return;

      await Promise.all(
        trials.map(async (subscription) => {
          try {
            await this.processTrialEnd(subscription);
          } catch (error) {
            console.error(`Failed to process trial end for subscription ${subscription.id}:`, error);
          }
        })
      );
    } catch (error) {
      console.error('Failed to check trials:', error);
    }
  }

  private async processTrialEnd(subscription: Subscription): Promise<void> {
    try {
      // Create payment intent for first billing period
      const paymentIntent = await this.paymentProcessor.createPaymentIntent({
        userId: subscription.userId,
        planId: subscription.planId,
        paymentMethod: subscription.paymentMethod,
        addOnIds: subscription.addOns.map(addon => addon.id)
      });

      // Process payment
      await this.paymentProcessor.processPayment(paymentIntent.id);

      // Update subscription
      await (supabase as any)
        .from('subscriptions')
        .update({
          status: 'active',
          currentPeriod: {
            startDate: new Date(subscription.trialEndDate!),
            endDate: subscription.endDate,
            isTrialPeriod: false
          },
          billingHistory: [
            ...subscription.billingHistory,
            {
              invoiceId: paymentIntent.id,
              amount: paymentIntent.amount,
              status: 'paid',
              date: new Date()
            }
          ]
        })
        .eq('id', subscription.id);

      // Log event
      await this.logSubscriptionEvent({
        subscriptionId: subscription.id,
        type: 'trial_ended',
        description: `Subscription trial ended for plan ${subscription.planId}`,
        metadata: { outcome: 'converted', paymentIntentId: paymentIntent.id }
      });
    } catch (error) {
      // Handle failed trial conversion
      await this.handleFailedTrialConversion(subscription, error as Error);
    }
  }

  private async handleFailedTrialConversion(subscription: Subscription, error: Error): Promise<void> {
    // Implementation for handling failed trial conversion
    console.error('Failed trial conversion for subscription:', subscription.id, error);
  }

  private async checkUsageLimits(): Promise<void> {
    try {
      // Get active subscriptions
      const { data: subscriptions } = await (supabase as any)
        .from('subscriptions')
        .select('*, subscription_plans!inner(*)')
        .in('status', ['active', 'trial']);

      if (!subscriptions) return;

      await Promise.all(
        subscriptions.map(async (subscription) => {
          try {
            await this.checkSubscriptionUsage(subscription);
          } catch (error) {
            console.error(`Failed to check usage for subscription ${subscription.id}:`, error);
          }
        })
      );
    } catch (error) {
      console.error('Failed to check usage limits:', error);
    }
  }

  private async checkSubscriptionUsage(subscription: Subscription & { subscription_plans: SubscriptionPlan }): Promise<void> {
    const usage = subscription.usage || {};
    const plan = subscription.subscription_plans;

    if (!plan) return;

    for (const limit of plan.limits || []) {
      const currentUsage = usage[limit.key] || 0;
      const limitValue = limit.value;

      if (currentUsage >= limitValue) {
        // Usage limit exceeded
        await this.handleUsageLimitExceeded(subscription, limit);
      } else if (currentUsage >= limitValue * 0.9) {
        // Usage approaching limit
        await this.handleUsageLimitWarning(subscription, limit, currentUsage);
      }
    }
  }

  private async handleUsageLimitExceeded(subscription: Subscription, limit: any): Promise<void> {
    // Implementation for handling usage limit exceeded
    console.error('Usage limit exceeded for subscription:', subscription.id, limit);
  }

  private async handleUsageLimitWarning(subscription: Subscription, limit: any, currentUsage: number): Promise<void> {
    // Implementation for handling usage approaching limit
    console.warn('Usage approaching limit for subscription:', subscription.id, limit, currentUsage);
  }

  private async logSubscriptionEvent(event: Omit<SubscriptionEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      await (supabase as any).from('subscription_events').insert({
        subscription_id: event.subscriptionId,
        type: event.type,
        description: event.description,
        metadata: event.metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log subscription event:', error);
    }
  }
}

export async function handleSubscriptionEvent(event: SubscriptionEvent): Promise<void> {
  // Log the event
  await logEvent(event);

  // Handle specific event types
  switch (event.type) {
    case 'subscription_created':
      await handleSubscriptionCreated(event);
      break;
    case 'subscription_updated':
      await handleSubscriptionUpdated(event);
      break;
    case 'subscription_cancelled':
      await handleSubscriptionCancelled(event);
      break;
    case 'subscription_renewed':
      await handleSubscriptionRenewed(event);
      break;
    case 'subscription_upgraded':
      await handleSubscriptionUpgraded(event);
      break;
    case 'subscription_expired':
      await handleSubscriptionExpired(event);
      break;
    case 'payment_failed':
      await handlePaymentFailed(event);
      break;
  }

  // Send notifications
  await sendNotifications(event);
}

async function logEvent(event: SubscriptionEvent): Promise<void> {
  // In a real implementation, this would log to a database or event store
  console.log('Subscription Event:', {
    type: event.type,
    subscriptionId: event.subscriptionId,
    userId: event.userId,
    timestamp: event.timestamp,
    metadata: event.metadata
  });
}

async function handleSubscriptionCreated(event: SubscriptionEvent): Promise<void> {
  // Handle new subscription creation
  // - Set up user access
  // - Initialize usage tracking
  // - Send welcome email
  // - Set up monitoring
}

async function handleSubscriptionUpdated(event: SubscriptionEvent): Promise<void> {
  // Handle subscription updates
  // - Update user access
  // - Update usage limits
  // - Send confirmation
}

async function handleSubscriptionCancelled(event: SubscriptionEvent): Promise<void> {
  // Handle subscription cancellation
  // - Schedule access removal
  // - Send cancellation confirmation
  // - Initiate win-back flow
}

async function handleSubscriptionRenewed(event: SubscriptionEvent): Promise<void> {
  // Handle subscription renewal
  // - Reset usage counters
  // - Send confirmation
  // - Update billing records
}

async function handleSubscriptionUpgraded(event: SubscriptionEvent): Promise<void> {
  // Handle subscription upgrade
  // - Update access levels
  // - Send welcome to new plan
  // - Update usage limits
}

async function handleSubscriptionExpired(event: SubscriptionEvent): Promise<void> {
  // Handle subscription expiration
  // - Remove access
  // - Archive data
  // - Send expiration notice
}

async function handlePaymentFailed(event: SubscriptionEvent): Promise<void> {
  // Handle failed payments
  // - Retry payment
  // - Send payment failure notice
  // - Start dunning process
}

async function sendNotifications(event: SubscriptionEvent): Promise<void> {
  // In a real implementation, this would:
  // - Send emails
  // - Send in-app notifications
  // - Send webhooks to integrated systems
  // - Notify admin dashboard
} 