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