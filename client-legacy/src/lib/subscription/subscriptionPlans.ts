export type PlanType = 'monthly' | 'quarterly' | 'yearly';

export interface SubscriptionPlan {
  id: PlanType;
  name: string;
  priceUSD: number;
  duration: number; // in days
  description: string;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    priceUSD: 10,
    duration: 30,
    description: 'Perfect for trying out premium features',
    features: [
      'AI Trading Analysis',
      'Custom Strategy Builder',
      'Journal Reflection AI',
      'Basic Support'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    priceUSD: 25,
    duration: 90,
    description: 'Our most popular plan',
    features: [
      'Everything in Monthly',
      'Advanced Backtesting',
      'Performance Analytics',
      'Priority Support'
    ],
    popular: true
  },
  {
    id: 'yearly',
    name: 'Yearly',
    priceUSD: 50,
    duration: 365,
    description: 'Best value for committed traders',
    features: [
      'Everything in Quarterly',
      'Early Access to New Features',
      'Custom Trade Templates',
      '24/7 Premium Support'
    ]
  }
];

export const getPlanById = (planId: PlanType): SubscriptionPlan => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }
  return plan;
}; 