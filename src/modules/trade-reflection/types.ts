// Trade Reflection module types
export interface TradeReflection {
  id: string;
  tradeId: string;
  userId: string;
  content: string;
  emotions: string[];
  lessons: string[];
  rating: number; // 1-5
  createdAt: string;
  updatedAt: string;
}

export interface ReflectionPrompt {
  id: string;
  question: string;
  category: 'entry' | 'exit' | 'emotion' | 'strategy' | 'risk';
  trigger: 'win' | 'loss' | 'always' | 'weekly';
}

export interface ReflectionInsight {
  userId: string;
  pattern: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  lastSeen: string;
} 