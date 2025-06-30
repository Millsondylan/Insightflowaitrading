import React, { useState, useEffect } from 'react';

interface SubscriptionManagerProps {
  userId: string;
  onSubscribe?: () => void;
  onCancel?: () => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'quarterly' | 'annual';
  features: string[];
  popular?: boolean;
  discountPercentage?: number;
}

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  paymentMethod?: {
    type: 'credit_card' | 'paypal' | 'crypto';
    lastFour?: string;
    expiryDate?: string;
  };
}

export const SubscriptionManager: React.FC<Subscriptionmanagerprops > = ({
  userId,
  onSubscribe,
  onCancel
}) => {
  const [plans, setPlans] = useState<Subscriptionplan  />([]);
  const [userSubscription, setUserSubscription] = useState<usersubscription  >(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  
  useEffect(() => {
    fetchSubscriptionData();
  }, [userId]);
  
  const fetchSubscriptionData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API calls
      // const plansResponse = await fetch('/api/subscription/plans');
      // const plansData = await plansResponse.json();
      // const userSubResponse = await fetch(`/api/subscription/user/${userId}`);
      // const userSubData = await userSubResponse.json();
      
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPlans: SubscriptionPlan[] = [
        {
          id: 'plan-monthly',
          name: 'Pro Monthly',
          description: 'Full access to all premium features',
          price: 29.99,
          currency: 'USD',
          interval: 'monthly',
          features: [
            'Advanced strategy builder',
            'Real-time market alerts',
            'Portfolio analytics',
            'Trading journal AI analysis',
            'Community trading rooms',
            'Priority support'
          ]
        },
        {
          id: 'plan-quarterly',
          name: 'Pro Quarterly',
          description: 'Save 15% with quarterly billing',
          price: 76.47,
          currency: 'USD',
          interval: 'quarterly',
          discountPercentage: 15,
          features: [
            'Advanced strategy builder',
            'Real-time market alerts',
            'Portfolio analytics',
            'Trading journal AI analysis',
            'Community trading rooms',
            'Priority support'
          ]
        },
        {
          id: 'plan-annual',
          name: 'Pro Annual',
          description: 'Save 25% with annual billing',
          price: 269.91,
          currency: 'USD',
          interval: 'annual',
          popular: true,
          discountPercentage: 25,
          features: [
            'Advanced strategy builder',
            'Real-time market alerts',
            'Portfolio analytics',
            'Trading journal AI analysis',
            'Community trading rooms',
            'Priority support',
            'Annual strategy review session'
          ]
        }
      ];
      
      // Generate a mock subscription or null
      const hasSub = Math.random() > 0.5;
      const mockSubscription: UserSubscription | null = hasSub ? {
        id: 'sub-123',
        userId,
        planId: 'plan-annual',
        status: 'active',
        startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 335 * 86400000).toISOString(),
        renewalDate: new Date(Date.now() + 335 * 86400000).toISOString(),
        paymentMethod: {
          type: 'credit_card',
          lastFour: '4242',
          expiryDate: '04/25'
        }
      } : null;
      
      setPlans(mockPlans);
      setUserSubscription(mockSubscription);
      
      if (!mockSubscription) {
        setSelectedPlanId('plan-annual'); // Default to annual plan
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError('Failed to load subscription information. Please try again.');
      setLoading(false);
    }
  };
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };
  
  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      setError('Please select a subscription plan.');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // TODO: Replace with actual payment processing
      // const response = await fetch('/api/subscription/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, planId: selectedPlanId })
      // });
      // const data = await response.json();
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      const selectedPlan = plans.find(p => p.id === selectedPlanId);
      if (!selectedPlan) {
        throw new Error('Selected plan not found.');
      }
      
      const mockNewSubscription: UserSubscription = {
        id: `sub-${Date.now()}`,
        userId,
        planId: selectedPlanId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (
          selectedPlan.interval === 'monthly' ? 30 :
          selectedPlan.interval === 'quarterly' ? 90 : 365
        ) * 86400000).toISOString(),
        renewalDate: new Date(Date.now() + (
          selectedPlan.interval === 'monthly' ? 30 :
          selectedPlan.interval === 'quarterly' ? 90 : 365
        ) * 86400000).toISOString(),
        paymentMethod: {
          type: 'credit_card',
          lastFour: '4242',
          expiryDate: '04/25'
        }
      };
      
      setUserSubscription(mockNewSubscription);
      setProcessing(false);
      
      if (onSubscribe) {
        onSubscribe();
      }
    } catch (err) {
      console.error('Error processing subscription:', err);
      setError('Failed to process subscription. Please try again.');
      setProcessing(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/subscription/${userSubscription?.id}/cancel`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userSubscription) {
        setUserSubscription({
          ...userSubscription,
          status: 'canceled'
        });
      }
      
      setShowCancelModal(false);
      setProcessing(false);
      
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
      setProcessing(false);
    }
  };
  
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };
  
  const getActivePlan = () => {
    if (!userSubscription) return null;
    return plans.find(plan => plan.id === userSubscription.planId);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="text-xl font-semibold mb-2">Loading subscription data...</div>
        <div className="text-text-muted">Please wait</div>
      </div>
    );
  }
  
  const activePlan = getActivePlan();
  
  return (
    <div className="subscription-manager p-4 bg-background-secondary rounded-lg">
      <h2 className="text-2xl font-bold mb-6">InsightFlow Pro</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-status-error/20 text-status-error rounded-lg">
          {error}
        </div>
      )}
      
      {/* Current Subscription */}
      {userSubscription && (
        <div className="mb-8 p-4 bg-background-tertiary rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Your Subscription</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-text-muted">Plan</div>
              <div className="font-medium">{activePlan?.name}</div>
            </div>
            
            <div>
              <div className="text-sm text-text-muted">Status</div>
              <div className={`font-medium ${
                userSubscription.status === 'active' ? 'text-status-success' :
                userSubscription.status === 'canceled' ? 'text-status-error' :
                userSubscription.status === 'trial' ? 'text-status-warning' : ''
              }`}>
                {userSubscription.status.charAt(0).toUpperCase() + userSubscription.status.slice(1)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-text-muted">Start Date</div>
              <div>{formatDate(userSubscription.startDate)}</div>
            </div>
            
            {userSubscription.status === 'active' && userSubscription.renewalDate && (
              <div>
                <div className="text-sm text-text-muted">Next Renewal</div>
                <div>{formatDate(userSubscription.renewalDate)}</div>
              </div>
            )}
            
            {userSubscription.status === 'canceled' && (
              <div>
                <div className="text-sm text-text-muted">Access Until</div>
                <div>{formatDate(userSubscription.endDate)}</div>
              </div>
            )}
            
            {userSubscription.paymentMethod && (
              <div>
                <div className="text-sm text-text-muted">Payment Method</div>
                <div>
                  {userSubscription.paymentMethod.type === 'credit_card' && 'Credit Card'}
                  {userSubscription.paymentMethod.type === 'paypal' && 'PayPal'}
                  {userSubscription.paymentMethod.type === 'crypto' && 'Cryptocurrency'}
                  {userSubscription.paymentMethod.lastFour && ` ending in ${userSubscription.paymentMethod.lastFour}`}
                </div>
              </div>
            )}
          </div>
          
          {userSubscription.status === 'active' && (
            <button
              className="px-4 py-2 bg-status-error/20 text-status-error rounded-md hover:bg-status-error/30"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Subscription
            </button>
          )}
          
          {userSubscription.status === 'canceled' && (
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/80"
                onClick={() => setSelectedPlanId(userSubscription.planId)}
              >
                Renew Subscription
              </button>
              <button
                className="px-4 py-2 border border-border-primary rounded-md hover:bg-background-interactive"
                onClick={() => setSelectedPlanId('')}
              >
                Change Plan
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Plan Selection */}
      {(!userSubscription || userSubscription.status === 'canceled' || selectedPlanId) && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {!userSubscription ? 'Choose a Plan' : 'Change Your Plan'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPlanId === plan.id
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-border-primary bg-background-tertiary hover:border-brand-primary/50'
                } ${plan.popular ? 'relative' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-brand-secondary text-white text-xs px-2 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h4 className="text-lg font-semibold mb-1">{plan.name}</h4>
                <p className="text-sm text-text-muted mb-3">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold">{formatPrice(plan.price, plan.currency)}</span>
                  <span className="text-text-muted">
                    /{plan.interval === 'monthly' ? 'month' : plan.interval === 'quarterly' ? 'quarter' : 'year'}
                  </span>
                  
                  {plan.discountPercentage && (
                    <div className="text-status-success text-sm mt-1">
                      Save {plan.discountPercentage}%
                    </div>
                  )}
                </div>
                
                <ul className="mb-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-status-success mr-2">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-2 rounded-md ${
                    selectedPlanId === plan.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-background-interactive hover:bg-brand-primary/20'
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {selectedPlanId === plan.id ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>
          
          {selectedPlanId && (
            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-3 bg-brand-primary text-white rounded-md hover:bg-brand-primary/80 disabled:opacity-50"
                onClick={handleSubscribe}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-primary rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Cancel Subscription</h3>
            
            <p className="mb-4">
              Are you sure you want to cancel your subscription? You'll continue to have access until {userSubscription ? formatDate(userSubscription.endDate) : 'the end of your billing period'}.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-border-primary rounded-md hover:bg-background-interactive"
                onClick={() => setShowCancelModal(false)}
                disabled={processing}
              >
                Keep Subscription
              </button>
              <button
                className="px-4 py-2 bg-status-error text-white rounded-md hover:bg-status-error/80 disabled:opacity-50"
                onClick={handleCancelSubscription}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['subscriptions', 'subscriptionPlans', 'users'],
  aiBlocks: ['paymentProcessor', 'subscriptionManager'],
  functions: ['subscribe', 'cancelSubscription', 'updateSubscription', 'getSubscriptionDetails']
}; 