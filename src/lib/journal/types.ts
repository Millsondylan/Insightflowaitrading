export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryTime: string;
  exitTime: string;
  stopLoss?: number;
  takeProfit?: number;
  strategy?: string;
  tags?: string[];
}

export interface TradeMetrics {
  executionScore: number;
  riskManagementScore: number;
  strategyAdherenceScore: number;
  profitLoss: number;
  riskRewardRatio: number;
}

export interface TradePsychology {
  emotionalState: string;
  behavioralPatterns: string;
  decisionMaking: string;
  biases: string[];
  stressLevel: number;
}

export interface TradeReflection {
  id: string;
  tradeId: string;
  journalEntryId: string;
  analysis: {
    summary: string;
    metrics: TradeMetrics;
    psychology: TradePsychology;
    improvements: string[];
    actionItems: string[];
  };
  timestamp: string;
  version: number;
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