export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entry: {
    price: number;
    timestamp: number;
  };
  exit?: {
    price: number;
    timestamp: number;
  };
  size: number;
  pnl?: number;
  status: 'open' | 'closed';
}

export interface JournalEntry {
  id: string;
  tradeId?: string;
  timestamp: number;
  content: string;
  mood: number;  // -1 to 1 scale
  tags: string[];
  attachments?: string[];
}

export interface EmotionalState {
  timestamp: number;
  primaryEmotion: string;
  emotions: Record<string, number>;
  intensity: number;
  triggers: string[];
}

export interface BehavioralPattern {
  type: string;
  frequency: number;
  impact: number;
  suggestions: string[];
}

export interface PsychologicalAnalysis {
  emotionalProfile: Record<string, number>;
  behavioralPatterns: BehavioralPattern[];
  cognitiveBiases: string[];
  recommendations: string[];
}

export interface TradeReflection {
  tradeId: string;
  journalEntryId: string;
  analysis: {
    emotionalState: EmotionalState;
    decisionQuality: number;
    lessonsLearned: string[];
    improvementAreas: string[];
  };
  timestamp: number;
} 