import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionPlan } from './plans';
import { PaymentMethod, PaymentProcessor } from './payments';
import { SubscriptionEvent, UserSubscription } from './types';

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

export interface SubscriptionEvent {
  id: string;
  subscriptionId: string;
  type: 'created' | 'renewed' | 'canceled' | 'expired' | 'suspended' | 'resumed' | 'plan_changed' | 'trial_ended';
  timestamp: Date;
  data: Record<string, any>;
  metadata: Record<string, any>;
}

export class SubscriptionLifecycle {
  private supabase: SupabaseClient;
  private paymentProcessor: PaymentProcessor;
  private readonly RENEWAL_CHECK_INTERVAL = 3600000; // 1 hour
  private readonly TRIAL_CHECK_INTERVAL = 3600000; // 1 hour
  private readonly USAGE_CHECK_INTERVAL = 3600000; // 1 hour

  constructor(
    supabase: SupabaseClient,
    paymentProcessor: PaymentProcessor
  ) {
    this.supabase = supabase;
    this.paymentProcessor = paymentProcessor;
    this.startBackgroundTasks();
  }

  private startBackgroundTasks(): void {
    setInterval(() => this.checkRenewals(), this.RENEWAL_CHECK_INTERVAL);
    setInterval(() => this.checkTrials(), this.TRIAL_CHECK_INTERVAL);
    setInterval(() => this.checkUsageLimits(), this.USAGE_CHECK_INTERVAL);
  }

  public async createSubscription(params: {
    userId: string;
    planId: string;
    paymentMethod: PaymentMethod;
    startDate?: Date;
    trialDays?: number;
    addOnIds?: string[];
    metadata?: Record<string, any>;
  }): Promise<Subscription> {
    try {
      // Get plan details
      const { data: plan, error } = await this.supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', params.planId)
        .single();

      if (error || !plan) {
        throw new Error('Plan not found');
      }

      const now = new Date();
      const startDate = params.startDate || now;
      const trialEndDate = params.trialDays 
        ? new Date(startDate.getTime() + params.trialDays * 24 * 60 * 60 * 1000)
        : undefined;

      // Calculate end date based on plan interval
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (plan.price.interval === 'yearly' ? 12 : 1));

      // Create subscription
      const subscription: Subscription = {
        id: Math.random().toString(36).substr(2, 9),
        userId: params.userId,
        planId: params.planId,
        status: trialEndDate ? 'trial' : 'active',
        startDate,
        endDate,
        trialEndDate,
        currentPeriod: {
          startDate,
          endDate: trialEndDate || endDate,
          isTrialPeriod: !!trialEndDate
        },
        paymentMethod: params.paymentMethod,
        autoRenew: true,
        cancelAtPeriodEnd: false,
        addOns: [],
        usage: {
          strategies: 0,
          backtests: 0,
          alerts: 0,
          apiCalls: 0
        },
        billingHistory: [],
        metadata: {
          lastModifiedBy: 'system',
          lastModifiedAt: now,
          notes: '',
          customFields: params.metadata || {}
        },
        version: 1
      };

      // Add add-ons if specified
      if (params.addOnIds) {
        const { data: addOns } = await this.supabase
          .from('plan_addons')
          .select('*')
          .in('id', params.addOnIds);

        if (addOns) {
          subscription.addOns = addOns.map(addon => ({
            id: addon.id,
            startDate,
            autoRenew: true
          }));
        }
      }

      // Process initial payment if not trial
      if (!trialEndDate) {
        const paymentIntent = await this.paymentProcessor.createPaymentIntent({
          userId: params.userId,
          planId: params.planId,
          paymentMethod: params.paymentMethod,
          addOnIds: params.addOnIds
        });

        await this.paymentProcessor.processPayment(paymentIntent.id);

        subscription.billingHistory.push({
          invoiceId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: 'paid',
          date: now
        });
      }

      // Save subscription
      await this.supabase
        .from('subscriptions')
        .insert(subscription);

      // Log event
      await this.logSubscriptionEvent({
        subscriptionId: subscription.id,
        type: 'created',
        data: {
          planId: params.planId,
          startDate,
          endDate,
          trialEndDate
        },
        metadata: {}
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  public async cancelSubscription(params: {
    subscriptionId: string;
    userId: string;
    cancelImmediately?: boolean;
    reason?: string;
  }): Promise<void> {
    try {
      // Get subscription
      const { data: subscription, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('id', params.subscriptionId)
        .eq('userId', params.userId)
        .single();

      if (error || !subscription) {
        throw new Error('Subscription not found');
      }

      if (params.cancelImmediately) {
        // Update subscription status
        await this.supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            endDate: new Date(),
            autoRenew: false,
            metadata: {
              ...subscription.metadata,
              lastModifiedBy: 'user',
              lastModifiedAt: new Date(),
              cancellationReason: params.reason
            }
          })
          .eq('id', params.subscriptionId);

        // Process refund if needed
        const unusedDays = Math.ceil(
          (subscription.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        );
        
        if (unusedDays > 0) {
          const lastPayment = subscription.billingHistory[subscription.billingHistory.length - 1];
          const refundAmount = (lastPayment.amount / 30) * unusedDays;

          await this.paymentProcessor.refundPayment({
            transactionId: lastPayment.invoiceId,
            amount: refundAmount,
            reason: 'Subscription canceled'
          });
        }
      } else {
        // Update subscription to cancel at period end
        await this.supabase
          .from('subscriptions')
          .update({
            cancelAtPeriodEnd: true,
            autoRenew: false,
            metadata: {
              ...subscription.metadata,
              lastModifiedBy: 'user',
              lastModifiedAt: new Date(),
              cancellationReason: params.reason
            }
          })
          .eq('id', params.subscriptionId);
      }

      // Log event
      await this.logSubscriptionEvent({
        subscriptionId: params.subscriptionId,
        type: 'canceled',
        data: {
          cancelImmediately: params.cancelImmediately,
          reason: params.reason
        },
        metadata: {}
      });
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  public async changePlan(params: {
    subscriptionId: string;
    userId: string;
    newPlanId: string;
    prorate?: boolean;
  }): Promise<void> {
    try {
      // Get current subscription
      const { data: subscription, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('id', params.subscriptionId)
        .eq('userId', params.userId)
        .single();

      if (error || !subscription) {
        throw new Error('Subscription not found');
      }

      // Get new plan
      const { data: newPlan } = await this.supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', params.newPlanId)
        .single();

      if (!newPlan) {
        throw new Error('New plan not found');
      }

      if (params.prorate) {
        // Calculate prorated amounts
        const unusedDays = Math.ceil(
          (subscription.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        );
        
        const oldPlanCredit = (subscription.billingHistory[subscription.billingHistory.length - 1].amount / 30) * unusedDays;
        const newPlanCharge = (newPlan.price.amount / 30) * unusedDays;
        const proratedCharge = newPlanCharge - oldPlanCredit;

        if (proratedCharge > 0) {
          // Process additional payment
          const paymentIntent = await this.paymentProcessor.createPaymentIntent({
            userId: params.userId,
            planId: params.newPlanId,
            paymentMethod: subscription.paymentMethod,
            metadata: {
              type: 'plan_change',
              proratedAmount: true
            }
          });

          await this.paymentProcessor.processPayment(paymentIntent.id);
        } else if (proratedCharge < 0) {
          // Process refund
          const lastPayment = subscription.billingHistory[subscription.billingHistory.length - 1];
          await this.paymentProcessor.refundPayment({
            transactionId: lastPayment.invoiceId,
            amount: Math.abs(proratedCharge),
            reason: 'Plan downgrade proration'
          });
        }
      }

      // Update subscription
      await this.supabase
        .from('subscriptions')
        .update({
          planId: params.newPlanId,
          metadata: {
            ...subscription.metadata,
            lastModifiedBy: 'user',
            lastModifiedAt: new Date(),
            previousPlanId: subscription.planId
          }
        })
        .eq('id', params.subscriptionId);

      // Log event
      await this.logSubscriptionEvent({
        subscriptionId: params.subscriptionId,
        type: 'plan_changed',
        data: {
          oldPlanId: subscription.planId,
          newPlanId: params.newPlanId,
          prorated: params.prorate
        },
        metadata: {}
      });
    } catch (error) {
      throw new Error(`Failed to change plan: ${error.message}`);
    }
  }

  public async updatePaymentMethod(params: {
    subscriptionId: string;
    userId: string;
    paymentMethod: PaymentMethod;
  }): Promise<void> {
    try {
      // Update subscription
      await this.supabase
        .from('subscriptions')
        .update({
          paymentMethod: params.paymentMethod,
          metadata: {
            lastModifiedBy: 'user',
            lastModifiedAt: new Date()
          }
        })
        .eq('id', params.subscriptionId)
        .eq('userId', params.userId);
    } catch (error) {
      throw new Error(`Failed to update payment method: ${error.message}`);
    }
  }

  public async getSubscription(
    subscriptionId: string,
    userId: string
  ): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('userId', userId)
      .single();

    if (error) throw error;
    return data;
  }

  public async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data || [];
  }

  private async checkRenewals(): Promise<void> {
    try {
      // Get subscriptions due for renewal
      const { data: subscriptions } = await this.supabase
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
      await this.supabase
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
        data: {
          newStartDate,
          newEndDate,
          paymentIntentId: paymentIntent.id
        },
        metadata: {}
      });
    } catch (error) {
      // Handle failed renewal
      await this.handleFailedRenewal(subscription, error);
    }
  }

  private async handleFailedRenewal(
    subscription: Subscription,
    error: Error
  ): Promise<void> {
    // Update subscription status
    await this.supabase
      .from('subscriptions')
      .update({
        status: 'suspended',
        metadata: {
          ...subscription.metadata,
          lastModifiedBy: 'system',
          lastModifiedAt: new Date(),
          renewalError: error.message
        }
      })
      .eq('id', subscription.id);

    // Log event
    await this.logSubscriptionEvent({
      subscriptionId: subscription.id,
      type: 'suspended',
      data: {
        reason: 'Failed renewal',
        error: error.message
      },
      metadata: {}
    });

    // Notify user
    await this.notifyUser(subscription.userId, 'renewal_failed', {
      subscriptionId: subscription.id,
      error: error.message
    });
  }

  private async checkTrials(): Promise<void> {
    try {
      // Get trials ending soon
      const { data: trials } = await this.supabase
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
      await this.supabase
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
        data: {
          outcome: 'converted',
          paymentIntentId: paymentIntent.id
        },
        metadata: {}
      });
    } catch (error) {
      // Handle failed trial conversion
      await this.handleFailedTrialConversion(subscription, error);
    }
  }

  private async handleFailedTrialConversion(
    subscription: Subscription,
    error: Error
  ): Promise<void> {
    // Update subscription status
    await this.supabase
      .from('subscriptions')
      .update({
        status: 'expired',
        metadata: {
          ...subscription.metadata,
          lastModifiedBy: 'system',
          lastModifiedAt: new Date(),
          trialConversionError: error.message
        }
      })
      .eq('id', subscription.id);

    // Log event
    await this.logSubscriptionEvent({
      subscriptionId: subscription.id,
      type: 'trial_ended',
      data: {
        outcome: 'expired',
        error: error.message
      },
      metadata: {}
    });

    // Notify user
    await this.notifyUser(subscription.userId, 'trial_conversion_failed', {
      subscriptionId: subscription.id,
      error: error.message
    });
  }

  private async checkUsageLimits(): Promise<void> {
    try {
      // Get active subscriptions
      const { data: subscriptions } = await this.supabase
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

  private async checkSubscriptionUsage(
    subscription: Subscription & { subscription_plans: SubscriptionPlan }
  ): Promise<void> {
    const plan = subscription.subscription_plans;
    const usage = subscription.usage;
    const limits = plan.limits;

    // Check each limit
    for (const [key, limit] of Object.entries(limits)) {
      if (usage[key as keyof typeof usage] >= limit) {
        await this.handleLimitExceeded(subscription, key as keyof typeof usage);
      } else if (usage[key as keyof typeof usage] >= limit * 0.9) {
        await this.notifyUser(subscription.userId, 'usage_warning', {
          subscriptionId: subscription.id,
          feature: key,
          usage: usage[key as keyof typeof usage],
          limit
        });
      }
    }
  }

  private async handleLimitExceeded(
    subscription: Subscription,
    feature: keyof Subscription['usage']
  ): Promise<void> {
    // Log event
    await this.logSubscriptionEvent({
      subscriptionId: subscription.id,
      type: 'suspended',
      data: {
        reason: 'Usage limit exceeded',
        feature,
        usage: subscription.usage[feature]
      },
      metadata: {}
    });

    // Notify user
    await this.notifyUser(subscription.userId, 'usage_limit_exceeded', {
      subscriptionId: subscription.id,
      feature,
      usage: subscription.usage[feature]
    });
  }

  private async logSubscriptionEvent(event: Omit<SubscriptionEvent, 'id' | 'timestamp'>): Promise<void> {
    await this.supabase
      .from('subscription_events')
      .insert({
        ...event,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date()
      });
  }

  private async notifyUser(
    userId: string,
    type: string,
    data: Record<string, any>
  ): Promise<void> {
    await this.supabase
      .from('notifications')
      .insert({
        userId,
        type,
        data,
        read: false,
        timestamp: new Date()
      });
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
    subscriptionId: event.subscription.id,
    userId: event.subscription.userId,
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