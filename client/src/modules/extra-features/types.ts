// Extra Features module types
export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'premium' | 'beta' | 'experimental';
}

export interface FeatureToggle {
  userId: string;
  featureId: string;
  enabled: boolean;
  lastUpdated: string;
}

export interface FeatureUsage {
  userId: string;
  featureId: string;
  usageCount: number;
  lastUsed: string;
} 