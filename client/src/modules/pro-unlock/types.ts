// Pro Unlock module types
export interface ProFeature {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'trading' | 'education' | 'community';
  requiredPlan: 'basic' | 'pro' | 'premium';
}

export interface UnlockCode {
  id: string;
  code: string;
  featureId: string;
  maxUses: number;
  currentUses: number;
  validUntil: string;
  createdBy: string;
}

export interface UserUnlock {
  userId: string;
  featureId: string;
  unlockedAt: string;
  expiresAt?: string;
} 