import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionPlan, PlanDiscount } from './plans';
import { Payment, PaymentMethod } from './types';

export interface PaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  description: string;
  metadata: {
    planId?: string;
    subscriptionId?: string;
    addOnIds?: string[];
    discountIds?: string[];
    isRecurring: boolean;
    isSetupFee: boolean;
    isTrial: boolean;
  };
  error?: {
    code: string;
    message: string;
    details: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTransaction {
  id: string;
  intentId: string;
  type: 'charge' | 'refund' | 'dispute';
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  fee: number;
  net: number;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface PaymentReceipt {
  id: string;
  transactionId: string;
  items: {
    description: string;
    amount: number;
    quantity: number;
    metadata: Record<string, any>;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  description: string;
}

interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
}

export class PaymentProcessor {
  private supabase: SupabaseClient;
  private readonly PAYMENT_TIMEOUT = 300000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  public async createPaymentIntent(params: {
    userId: string;
    planId: string;
    paymentMethod: PaymentMethod;
    addOnIds?: string[];
    discountIds?: string[];
    isRecurring?: boolean;
    isSetupFee?: boolean;
    isTrial?: boolean;
  }): Promise<PaymentIntent> {
    try {
      // Calculate total amount
      const amount = await this.calculateTotalAmount({
        planId: params.planId,
        addOnIds: params.addOnIds,
        discountIds: params.discountIds,
        isSetupFee: params.isSetupFee,
        isTrial: params.isTrial
      });

      // Create payment intent
      const intent: PaymentIntent = {
        id: Math.random().toString(36).substr(2, 9),
        userId: params.userId,
        amount: amount.total,
        currency: 'USD', // TODO: Make configurable
        status: 'pending',
        paymentMethod: params.paymentMethod,
        description: `Subscription payment for plan ${params.planId}`,
        metadata: {
          planId: params.planId,
          addOnIds: params.addOnIds,
          discountIds: params.discountIds,
          isRecurring: params.isRecurring || false,
          isSetupFee: params.isSetupFee || false,
          isTrial: params.isTrial || false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save intent
      await this.supabase
        .from('payment_intents')
        .insert(intent);

      return intent;
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  public async processPayment(intentId: string): Promise<PaymentTransaction> {
    try {
      // Get payment intent
      const { data: intent, error } = await this.supabase
        .from('payment_intents')
        .select('*')
        .eq('id', intentId)
        .single();

      if (error || !intent) {
        throw new Error('Payment intent not found');
      }

      // Update intent status
      await this.updateIntentStatus(intentId, 'processing');

      // Process payment with provider
      const transaction = await this.processWithProvider(intent);

      // Create receipt
      await this.createReceipt(transaction);

      // Update intent status
      await this.updateIntentStatus(intentId, 'completed');

      return transaction;
    } catch (error) {
      await this.handlePaymentError(intentId, error);
      throw error;
    }
  }

  public async refundPayment(params: {
    transactionId: string;
    amount?: number;
    reason?: string;
  }): Promise<PaymentTransaction> {
    try {
      // Get original transaction
      const { data: transaction, error } = await this.supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', params.transactionId)
        .single();

      if (error || !transaction) {
        throw new Error('Transaction not found');
      }

      // Process refund with provider
      const refund = await this.processRefundWithProvider({
        originalTransaction: transaction,
        amount: params.amount || transaction.amount,
        reason: params.reason
      });

      // Create refund transaction
      const refundTransaction: PaymentTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        intentId: transaction.intentId,
        type: 'refund',
        status: 'completed',
        amount: refund.amount,
        currency: transaction.currency,
        fee: refund.fee,
        net: refund.amount - refund.fee,
        metadata: {
          originalTransactionId: transaction.id,
          reason: params.reason,
          refundId: refund.id
        },
        createdAt: new Date()
      };

      await this.supabase
        .from('payment_transactions')
        .insert(refundTransaction);

      return refundTransaction;
    } catch (error) {
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  public async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await this.supabase
      .from('payment_methods')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data || [];
  }

  public async addPaymentMethod(params: {
    userId: string;
    type: PaymentMethod['type'];
    provider: string;
    details: PaymentMethod['details'];
    setAsDefault?: boolean;
  }): Promise<PaymentMethod> {
    try {
      // Validate payment method with provider
      await this.validatePaymentMethodWithProvider(params);

      const paymentMethod: PaymentMethod = {
        id: Math.random().toString(36).substr(2, 9),
        type: params.type,
        provider: params.provider,
        details: params.details,
        isDefault: params.setAsDefault || false,
        metadata: {}
      };

      // If setting as default, update existing default
      if (params.setAsDefault) {
        await this.supabase
          .from('payment_methods')
          .update({ isDefault: false })
          .eq('userId', params.userId)
          .eq('isDefault', true);
      }

      // Save payment method
      await this.supabase
        .from('payment_methods')
        .insert(paymentMethod);

      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to add payment method: ${error.message}`);
    }
  }

  public async removePaymentMethod(params: {
    userId: string;
    paymentMethodId: string;
  }): Promise<void> {
    try {
      // Check if payment method exists
      const { data: paymentMethod, error } = await this.supabase
        .from('payment_methods')
        .select('*')
        .eq('id', params.paymentMethodId)
        .eq('userId', params.userId)
        .single();

      if (error || !paymentMethod) {
        throw new Error('Payment method not found');
      }

      // Check if payment method is in use
      const { data: activeSubscriptions } = await this.supabase
        .from('subscriptions')
        .select('id')
        .eq('userId', params.userId)
        .eq('paymentMethodId', params.paymentMethodId)
        .eq('status', 'active');

      if (activeSubscriptions && activeSubscriptions.length > 0) {
        throw new Error('Payment method is in use by active subscriptions');
      }

      // Remove payment method
      await this.supabase
        .from('payment_methods')
        .delete()
        .eq('id', params.paymentMethodId);

      // If was default, set another as default
      if (paymentMethod.isDefault) {
        const { data: otherMethods } = await this.supabase
          .from('payment_methods')
          .select('*')
          .eq('userId', params.userId)
          .limit(1);

        if (otherMethods && otherMethods.length > 0) {
          await this.supabase
            .from('payment_methods')
            .update({ isDefault: true })
            .eq('id', otherMethods[0].id);
        }
      }
    } catch (error) {
      throw new Error(`Failed to remove payment method: ${error.message}`);
    }
  }

  private async calculateTotalAmount(params: {
    planId: string;
    addOnIds?: string[];
    discountIds?: string[];
    isSetupFee?: boolean;
    isTrial?: boolean;
  }): Promise<{
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  }> {
    // Get plan
    const { data: plan, error } = await this.supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', params.planId)
      .single();

    if (error || !plan) {
      throw new Error('Plan not found');
    }

    // Calculate subtotal
    let subtotal = plan.price.amount;

    // Add setup fee
    if (params.isSetupFee && plan.price.setupFee) {
      subtotal += plan.price.setupFee;
    }

    // Add add-ons
    if (params.addOnIds && params.addOnIds.length > 0) {
      const { data: addOns } = await this.supabase
        .from('plan_addons')
        .select('price')
        .in('id', params.addOnIds);

      if (addOns) {
        subtotal += addOns.reduce((sum, addon) => sum + addon.price, 0);
      }
    }

    // Apply discounts
    let discount = 0;
    if (params.discountIds && params.discountIds.length > 0) {
      const { data: discounts } = await this.supabase
        .from('plan_discounts')
        .select('*')
        .in('id', params.discountIds);

      if (discounts) {
        discounts.forEach(d => {
          if (d.type === 'percentage') {
            discount += subtotal * (d.value / 100);
          } else {
            discount += d.value;
          }
        });
      }
    }

    // Calculate tax
    const tax = (subtotal - discount) * 0.1; // TODO: Make configurable

    // Calculate total
    const total = params.isTrial ? 0 : subtotal - discount + tax;

    return {
      subtotal,
      discount,
      tax,
      total
    };
  }

  private async processWithProvider(intent: PaymentIntent): Promise<PaymentTransaction> {
    // Implementation would integrate with payment provider
    const transaction: PaymentTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      intentId: intent.id,
      type: 'charge',
      status: 'completed',
      amount: intent.amount,
      currency: intent.currency,
      fee: intent.amount * 0.029 + 0.30, // Example fee calculation
      net: intent.amount - (intent.amount * 0.029 + 0.30),
      metadata: {},
      createdAt: new Date()
    };

    await this.supabase
      .from('payment_transactions')
      .insert(transaction);

    return transaction;
  }

  private async processRefundWithProvider(params: {
    originalTransaction: PaymentTransaction;
    amount: number;
    reason?: string;
  }): Promise<{
    id: string;
    amount: number;
    fee: number;
  }> {
    // Implementation would integrate with payment provider
    return {
      id: Math.random().toString(36).substr(2, 9),
      amount: params.amount,
      fee: 0
    };
  }

  private async createReceipt(transaction: PaymentTransaction): Promise<PaymentReceipt> {
    // Get payment intent
    const { data: intent, error } = await this.supabase
      .from('payment_intents')
      .select('*')
      .eq('id', transaction.intentId)
      .single();

    if (error || !intent) {
      throw new Error('Payment intent not found');
    }

    // Create receipt items
    const items = [];

    // Add plan
    if (intent.metadata.planId) {
      const { data: plan } = await this.supabase
        .from('subscription_plans')
        .select('name, price')
        .eq('id', intent.metadata.planId)
        .single();

      if (plan) {
        items.push({
          description: `Subscription - ${plan.name}`,
          amount: plan.price.amount,
          quantity: 1,
          metadata: {
            type: 'plan',
            planId: intent.metadata.planId
          }
        });
      }
    }

    // Add setup fee
    if (intent.metadata.isSetupFee) {
      items.push({
        description: 'Setup Fee',
        amount: transaction.amount * 0.1, // Example setup fee
        quantity: 1,
        metadata: {
          type: 'setup_fee'
        }
      });
    }

    // Add add-ons
    if (intent.metadata.addOnIds) {
      const { data: addOns } = await this.supabase
        .from('plan_addons')
        .select('*')
        .in('id', intent.metadata.addOnIds);

      if (addOns) {
        addOns.forEach(addon => {
          items.push({
            description: `Add-on - ${addon.name}`,
            amount: addon.price,
            quantity: 1,
            metadata: {
              type: 'addon',
              addonId: addon.id
            }
          });
        });
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    const discount = transaction.amount * 0.1; // Example discount
    const tax = (subtotal - discount) * 0.1; // Example tax
    const total = transaction.amount;

    // Create receipt
    const receipt: PaymentReceipt = {
      id: Math.random().toString(36).substr(2, 9),
      transactionId: transaction.id,
      items,
      subtotal,
      discount,
      tax,
      total,
      currency: transaction.currency,
      metadata: {},
      createdAt: new Date()
    };

    await this.supabase
      .from('payment_receipts')
      .insert(receipt);

    return receipt;
  }

  private async updateIntentStatus(
    intentId: string,
    status: PaymentIntent['status']
  ): Promise<void> {
    await this.supabase
      .from('payment_intents')
      .update({
        status,
        updatedAt: new Date()
      })
      .eq('id', intentId);
  }

  private async handlePaymentError(
    intentId: string,
    error: Error
  ): Promise<void> {
    await this.supabase
      .from('payment_intents')
      .update({
        status: 'failed',
        error: {
          code: 'payment_failed',
          message: error.message,
          details: error
        },
        updatedAt: new Date()
      })
      .eq('id', intentId);
  }

  private async validatePaymentMethodWithProvider(params: {
    type: PaymentMethod['type'];
    provider: string;
    details: PaymentMethod['details'];
  }): Promise<void> {
    // Implementation would validate with payment provider
  }
}

export async function processPayment(request: PaymentRequest): Promise<Payment> {
  // In a real implementation, this would integrate with a payment processor like Stripe
  const payment: Payment = {
    id: `pay_${Math.random().toString(36).substr(2, 9)}`,
    userId: request.userId,
    amount: request.amount,
    currency: request.currency,
    status: 'completed',
    paymentMethod: request.paymentMethod,
    description: request.description,
    timestamp: Date.now(),
    metadata: {
      processingTime: 1000,
      gatewayResponse: 'success'
    }
  };

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return payment;
}

export async function refundPayment(request: RefundRequest): Promise<Payment> {
  // In a real implementation, this would integrate with a payment processor's refund API
  const refund: Payment = {
    id: `ref_${Math.random().toString(36).substr(2, 9)}`,
    userId: 'system',  // Would be fetched from original payment
    amount: request.amount,
    currency: 'USD',  // Would be fetched from original payment
    status: 'refunded',
    paymentMethod: {  // Would be fetched from original payment
      id: 'default',
      type: 'card',
      details: {},
      isDefault: true
    },
    description: `Refund for payment ${request.paymentId}: ${request.reason}`,
    timestamp: Date.now(),
    metadata: {
      originalPaymentId: request.paymentId,
      reason: request.reason,
      processingTime: 1000,
      gatewayResponse: 'success'
    }
  };

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return refund;
} 