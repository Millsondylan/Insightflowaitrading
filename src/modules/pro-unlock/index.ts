// Pro Unlock & Monetization Module
// Provides subscription management and access control

import { SubscriptionManager } from './subscription-manager';
import { ProUnlocker } from './pro-unlocker';
import { AccessCheckers } from './access-checkers';

export {
  SubscriptionManager,
  ProUnlocker,
  AccessCheckers
};

// Types
export * from './types';

// Pro Unlock Module
export * from './subscription-manager';

// Module configuration
export const proUnlockModule = {
  name: 'Pro Unlock',
  description: 'Premium features, subscription management, and monetization',
  features: [
    'Subscription plans',
    'Payment processing',
    'Premium feature access',
    'Referral system',
    'Account management'
  ]
}; 