export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  settings: UserSettings;
  subscription: SubscriptionStatus;
  lastActive: Date;
  preferences: Record<string, any>;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  timezone: string;
  language: string;
}

export interface SubscriptionStatus {
  tier: 'free' | 'pro' | 'enterprise';
  validUntil: Date;
  features: string[];
  paymentStatus: 'active' | 'inactive' | 'pending';
}

export interface Trade {
  id: string;
  userId: string;
  pair: string;
  openTime: Date;
  closeTime: Date;
  openPrice: number;
  closePrice: number;
  size: number;
  profit: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage: number;
  marginUsed: number;
  accountSize: number;
  strategyId?: string;
  notes?: string;
  tags: string[];
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description: string;
  rules: string[];
  performance: {
    profitFactor: number;
    winRate: number;
    averageRR: number;
    trades: number;
    pnl: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  tags: string[];
}

// New types for AI Trade Setup features
export interface MarketSetup {
  id: string;
  userId: string;
  symbol: string;
  timeframe: string;
  entry: number;
  sl: number;
  tp: number;
  tradeType: 'LONG' | 'SHORT';
  confidenceScore: number;
  patternDescription?: string;
  indicatorData?: Record<string, any>;
  aiGenerated: boolean;
  strategyId?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStrategy {
  id: string;
  userId: string;
  title: string;
  description: string;
  strategyText: string;
  aiParsed?: Record<string, any>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategySetup {
  id: string;
  strategyId: string;
  symbol: string;
  entry: number;
  sl: number;
  tp: number;
  confidence: number;
  timeframe: string;
  createdAt: Date;
}

export interface PublicSetup {
  id: string;
  userId: string;
  strategyId?: string;
  symbol: string;
  entry: number;
  sl: number;
  tp: number;
  timeframe: string;
  stats: {
    confidenceScore?: number;
    patternDescription?: string;
    winRate?: number;
    profitFactor?: number;
    backtestResults?: any;
  };
  likes: number;
  views: number;
  sharedAt: Date;
}

export interface SetupLike {
  id: string;
  setupId: string;
  userId: string;
  createdAt: Date;
}

export interface SetupView {
  id: string;
  setupId: string;
  userId: string;
  createdAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  darkModeEnabled: boolean;
  preferredLanguage: string;
  notificationEnabled: boolean;
  gestureEnabled: boolean;
  tradingStyle: 'scalp' | 'swing' | 'day' | 'position';
  riskRatio: number;
  favoriteIndicators: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Existing types
export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: Date;
  quizScore: number;
  practiceTime: number;
  skills: Array<{
    name: string;
    level: number;
  }>;
  practiceResults: {
    successRate: number;
    attempts: number;
  };
  reviewResults: {
    retentionRate: number;
    timeBetweenReviews: number;
    retentionImprovement: number;
    count: number;
  };
  challenges: {
    total: number;
    completed: number;
    averageDifficulty: number;
  };
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  tx_hash: string;
  cryptocurrency: string;
  amount: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  required_confirmations: number;
  verification_timestamp: string;
  confirmation_timestamp: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan: string;
  status: 'active' | 'inactive' | 'canceled' | 'expired';
  starts_at: string;
  expires_at: string;
  payment_method: 'crypto' | 'card' | 'paypal' | 'trial';
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
} 