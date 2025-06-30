import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionPlan } from './types';

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'premium';
  value: string | number | boolean;
  comparisonValue?: string | number | boolean;
  metadata: Record<string, any>;
}

export interface PlanLimit {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  metadata: Record<string, any>;
}

export interface PlanDiscount {
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

export interface PlanAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: PlanFeature[];
  limits: PlanLimit[];
  metadata: Record<string, any>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    interval: 'monthly' | 'yearly';
    setupFee?: number;
    trialDays?: number;
  };
  features: PlanFeature[];
  limits: PlanLimit[];
  addOns: PlanAddOn[];
  discounts: PlanDiscount[];
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

export class PlanManager {
  private supabase: SupabaseClient;
  private plans: Map<string, SubscriptionPlan>;
  private readonly CACHE_TTL = 3600000; // 1 hour
  private lastCacheUpdate: Date = new Date(0);

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.plans = new Map();
    this.initializePlans();
  }

  private async initializePlans(): Promise<void> {
    await this.refreshPlansCache();
    setInterval(() => this.refreshPlansCache(), this.CACHE_TTL);
  }

  private async refreshPlansCache(): Promise<void> {
    try {
      const { data: plans, error } = await this.supabase
        .from('subscription_plans')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      this.plans.clear();
      plans.forEach(plan => this.plans.set(plan.id, plan));
      this.lastCacheUpdate = new Date();
    } catch (error) {
      console.error('Error refreshing plans cache:', error);
    }
  }

  public async getAllPlans(): Promise<subscriptionPlan[]> {
    await this.ensureFreshCache();
    return Array.from(this.plans.values());
  }

  public async getPlan(planId: string): Promise<subscriptionPlan | null> {
    await this.ensureFreshCache();
    return this.plans.get(planId) || null;
  }

  public async getAvailablePlans(params: {
    region?: string;
    userType?: string;
    userCount?: number;
    date?: Date;
  }): Promise<subscriptionPlan[]> {
    await this.ensureFreshCache();
    const now = params.date || new Date();

    return Array.from(this.plans.values()).filter(plan => {
      const { availability, requirements } = plan.metadata;

      // Check region availability
      if (params.region && availability.regions.length > 0) {
        if (!availability.regions.includes(params.region)) return false;
      }

      // Check user type compatibility
      if (params.userType && availability.userTypes.length > 0) {
        if (!availability.userTypes.includes(params.userType)) return false;
      }

      // Check user count limits
      if (params.userCount) {
        if (requirements.minUsers && params.userCount < requirements.minUsers) return false;
        if (requirements.maxUsers && params.userCount > requirements.maxUsers) return false;
      }

      // Check date availability
      if (availability.startDate && now < availability.startDate) return false;
      if (availability.endDate && now > availability.endDate) return false;

      return true;
    });
  }

  public async getApplicableDiscounts(params: {
    planId: string;
    subscriptionMonths?: number;
    userType?: string;
    region?: string;
  }): Promise<planDiscount[]> {
    const plan = await this.getPlan(params.planId);
    if (!plan) return [];

    const now = new Date();
    return plan.discounts.filter(discount => {
      // Check date validity
      if (now < discount.startDate || now > discount.endDate) return false;

      // Check subscription length requirement
      if (discount.conditions.minSubscriptionMonths && params.subscriptionMonths) {
        if (params.subscriptionMonths < discount.conditions.minSubscriptionMonths) return false;
      }

      // Check user type eligibility
      if (discount.conditions.userTypes && discount.conditions.userTypes.length > 0) {
        if (!params.userType || !discount.conditions.userTypes.includes(params.userType)) return false;
      }

      // Check region eligibility
      if (discount.conditions.regions && discount.conditions.regions.length > 0) {
        if (!params.region || !discount.conditions.regions.includes(params.region)) return false;
      }

      return true;
    });
  }

  public async getAvailableAddOns(planId: string): Promise<planAddOn[]> {
    const plan = await this.getPlan(planId);
    return plan?.addOns || [];
  }

  public async comparePlans(planIds: string[]): Promise<{
    features: Record<string, Record<string, PlanFeature>>;
    limits: Record<string, Record<string, PlanLimit>>;
    pricing: Record<string, {
      monthly: number;
      yearly: number;
      savings: number;
    }>;
  }> {
    const plans = await Promise.all(planIds.map(id => this.getPlan(id)));
    const validPlans = plans.filter((plan): plan is SubscriptionPlan => !!plan);

    const comparison = {
      features: {} as Record<string, Record<string, PlanFeature>>,
      limits: {} as Record<string, Record<string, PlanLimit>>,
      pricing: {} as Record<string, {
        monthly: number;
        yearly: number;
        savings: number;
      }>
    };

    // Compare features
    validPlans.forEach(plan => {
      comparison.features[plan.id] = {};
      plan.features.forEach(feature => {
        comparison.features[plan.id][feature.id] = feature;
      });
    });

    // Compare limits
    validPlans.forEach(plan => {
      comparison.limits[plan.id] = {};
      plan.limits.forEach(limit => {
        comparison.limits[plan.id][limit.id] = limit;
      });
    });

    // Compare pricing
    validPlans.forEach(plan => {
      const monthlyPrice = plan.price.amount;
      const yearlyPrice = plan.price.interval === 'yearly' 
        ? plan.price.amount 
        : plan.price.amount * 12 * 0.8; // 20% discount for yearly

      comparison.pricing[plan.id] = {
        monthly: monthlyPrice,
        yearly: yearlyPrice,
        savings: monthlyPrice * 12 - yearlyPrice
      };
    });

    return comparison;
  }

  public async validatePlanRequirements(params: {
    planId: string;
    userType: string;
    region: string;
    documents?: Record<string, string>;
  }): Promise<{
    isValid: boolean;
    missingRequirements: string[];
  }> {
    const plan = await this.getPlan(params.planId);
    if (!plan) {
      return {
        isValid: false,
        missingRequirements: ['Invalid plan']
      };
    }

    const missingRequirements: string[] = [];
    const { requirements, availability } = plan.metadata;

    // Check user type
    if (availability.userTypes.length > 0 && !availability.userTypes.includes(params.userType)) {
      missingRequirements.push(`User type ${params.userType} not supported`);
    }

    // Check region
    if (availability.regions.length > 0 && !availability.regions.includes(params.region)) {
      missingRequirements.push(`Region ${params.region} not supported`);
    }

    // Check required documents
    if (requirements.documents && requirements.documents.length > 0) {
      const missingDocs = requirements.documents.filter(doc => !params.documents?.[doc]);
      if (missingDocs.length > 0) {
        missingRequirements.push(`Missing required documents: ${missingDocs.join(', ')}`);
      }
    }

    // Check verification requirement
    if (requirements.verificationNeeded && !params.documents?.verification) {
      missingRequirements.push('Verification required');
    }

    return {
      isValid: missingRequirements.length === 0,
      missingRequirements
    };
  }

  private async ensureFreshCache(): Promise<void> {
    const now = new Date();
    if (now.getTime() - this.lastCacheUpdate.getTime() > this.CACHE_TTL) {
      await this.refreshPlansCache();
    }
  }
}

const MONTH = 30 * 24 * 60 * 60 * 1000;  // 30 days in milliseconds
const YEAR = 365 * 24 * 60 * 60 * 1000;  // 365 days in milliseconds

export const plans: SubscriptionPlan[] = [
  {
    id: 'basic_monthly',
    name: 'Basic Plan',
    description: 'Essential trading tools for beginners',
    price: {
      amount: 29.99,
      currency: 'USD',
      interval: 'monthly',
      setupFee: 0,
      trialDays: 0
    },
    features: [
      'Basic strategy builder',
      'Market data access',
      'Basic backtesting',
      'Community access'
    ],
    limits: {
      strategies: 3,
      backtests: 100,
      alerts: 10,
      apiCalls: 1000
    },
    addOns: [],
    discounts: [],
    metadata: {
      displayOrder: 1,
      isPopular: false,
      recommendedFor: [],
      customization: {
        color: '#007bff',
        icon: 'basic_monthly',
        highlights: []
      },
      availability: {
        regions: [],
        userTypes: [],
        startDate: undefined,
        endDate: undefined
      },
      requirements: {
        minUsers: undefined,
        maxUsers: undefined,
        verificationNeeded: false,
        documents: []
      }
    },
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active'
  },
  {
    id: 'pro_monthly',
    name: 'Pro Plan',
    description: 'Advanced features for serious traders',
    price: {
      amount: 99.99,
      currency: 'USD',
      interval: 'monthly',
      setupFee: 0,
      trialDays: 0
    },
    features: [
      'Advanced strategy builder',
      'Real-time market data',
      'Advanced backtesting',
      'AI trading assistant',
      'Priority support',
      'API access'
    ],
    limits: {
      strategies: 10,
      backtests: 500,
      alerts: 50,
      apiCalls: 5000
    },
    addOns: [],
    discounts: [],
    metadata: {
      displayOrder: 2,
      isPopular: false,
      recommendedFor: [],
      customization: {
        color: '#ff5733',
        icon: 'pro_monthly',
        highlights: []
      },
      availability: {
        regions: [],
        userTypes: [],
        startDate: undefined,
        endDate: undefined
      },
      requirements: {
        minUsers: undefined,
        maxUsers: undefined,
        verificationNeeded: false,
        documents: []
      }
    },
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active'
  },
  {
    id: 'enterprise_monthly',
    name: 'Enterprise Plan',
    description: 'Full suite of professional trading tools',
    price: {
      amount: 299.99,
      currency: 'USD',
      interval: 'monthly',
      setupFee: 0,
      trialDays: 0
    },
    features: [
      'Custom strategy development',
      'Institutional data access',
      'Unlimited backtesting',
      'Advanced AI features',
      'Dedicated support',
      'Custom API integration'
    ],
    limits: {
      strategies: 100,
      backtests: -1,  // unlimited
      alerts: 200,
      apiCalls: 50000
    },
    addOns: [],
    discounts: [],
    metadata: {
      displayOrder: 3,
      isPopular: false,
      recommendedFor: [],
      customization: {
        color: '#33ff33',
        icon: 'enterprise_monthly',
        highlights: []
      },
      availability: {
        regions: [],
        userTypes: [],
        startDate: undefined,
        endDate: undefined
      },
      requirements: {
        minUsers: undefined,
        maxUsers: undefined,
        verificationNeeded: false,
        documents: []
      }
    },
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active'
  },
  {
    id: 'basic_yearly',
    name: 'Basic Plan (Yearly)',
    description: 'Essential trading tools for beginners with yearly discount',
    price: {
      amount: 299.99,
      currency: 'USD',
      interval: 'yearly',
      setupFee: 0,
      trialDays: 0
    },
    features: [
      'Basic strategy builder',
      'Market data access',
      'Basic backtesting',
      'Community access'
    ],
    limits: {
      strategies: 3,
      backtests: 100,
      alerts: 10,
      apiCalls: 1000
    },
    addOns: [],
    discounts: [],
    metadata: {
      displayOrder: 4,
      isPopular: false,
      recommendedFor: [],
      customization: {
        color: '#007bff',
        icon: 'basic_yearly',
        highlights: []
      },
      availability: {
        regions: [],
        userTypes: [],
        startDate: undefined,
        endDate: undefined
      },
      requirements: {
        minUsers: undefined,
        maxUsers: undefined,
        verificationNeeded: false,
        documents: []
      }
    },
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active'
  },
  {
    id: 'pro_yearly',
    name: 'Pro Plan (Yearly)',
    description: 'Advanced features for serious traders with yearly discount',
    price: {
      amount: 999.99,
      currency: 'USD',
      interval: 'yearly',
      setupFee: 0,
      trialDays: 0
    },
    features: [
      'Advanced strategy builder',
      'Real-time market data',
      'Advanced backtesting',
      'AI trading assistant',
      'Priority support',
      'API access'
    ],
    limits: {
      strategies: 10,
      backtests: 500,
      alerts: 50,
      apiCalls: 5000
    },
    addOns: [],
    discounts: [],
    metadata: {
      displayOrder: 5,
      isPopular: false,
      recommendedFor: [],
      customization: {
        color: '#ff5733',
        icon: 'pro_yearly',
        highlights: []
      },
      availability: {
        regions: [],
        userTypes: [],
        startDate: undefined,
        endDate: undefined
      },
      requirements: {
        minUsers: undefined,
        maxUsers: undefined,
        verificationNeeded: false,
        documents: []
      }
    },
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active'
  },
  {
    id: 'enterprise_yearly',
    name: 'Enterprise Plan (Yearly)',
    description: 'Full suite of professional trading tools with yearly discount',
    price: {
      amount: 2999.99,
      currency: 'USD',
      interval: 'yearly',
      setupFee: 0,
      trialDays: 0
    },
    features: [
      'Custom strategy development',
      'Institutional data access',
      'Unlimited backtesting',
      'Advanced AI features',
      'Dedicated support',
      'Custom API integration'
    ],
    limits: {
      strategies: 100,
      backtests: -1,  // unlimited
      alerts: 200,
      apiCalls: 50000
    },
    addOns: [],
    discounts: [],
    metadata: {
      displayOrder: 6,
      isPopular: false,
      recommendedFor: [],
      customization: {
        color: '#33ff33',
        icon: 'enterprise_yearly',
        highlights: []
      },
      availability: {
        regions: [],
        userTypes: [],
        startDate: undefined,
        endDate: undefined
      },
      requirements: {
        minUsers: undefined,
        maxUsers: undefined,
        verificationNeeded: false,
        documents: []
      }
    },
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active'
  }
]; 