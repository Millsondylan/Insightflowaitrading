// Strategy Intelligence Types

export interface Strategy {
  id: string;
  name: string;
  description: string;
  author: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  version: string;
  isPublished: boolean;
  rules: StrategyRule[];
  tags: string[];
  risk: string;
  performance: StrategyPerformance;
}

export interface StrategyRule {
  id: string;
  type: 'entry' | 'exit' | 'filter';
  condition: string;
  action: string;
  parameters: Record<string, any>;
}

export interface StrategyPerformance {
  winRate: number;
  profitFactor: number;
  totalReturn: string;
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  profitableTrades: number;
  averageTradeProfit?: number;
  averageTradeDuration?: number;
  expectancy?: number;
  riskRewardRatio?: number;
  averageWin?: number;
  averageLoss?: number;
  timeframe?: string;
  period?: {
    start: string;
    end: string;
  };
}

export interface VaultGridOptions {
  sortBy: 'name' | 'updatedAt' | 'performance.winRate' | 'performance.profitFactor';
  sortDirection: 'asc' | 'desc';
  filter: {
    tags?: string[];
    minWinRate?: number;
    isPublished?: boolean;
  };
  view: 'grid' | 'list' | 'compact';
  pageSize: number;
  page: number;
}

// Strategy Intelligence module types
export interface StrategyAnalysis {
  id: string;
  strategyId: string;
  performance: PerformanceMetrics;
  riskMetrics: RiskMetrics;
  recommendations: Recommendation[];
  lastUpdated: string;
}

export interface PerformanceMetrics {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
}

export interface RiskMetrics {
  volatility: number;
  var95: number; // Value at Risk 95%
  expectedShortfall: number;
  beta: number;
  correlation: number;
}

export interface Recommendation {
  id: string;
  type: 'optimize' | 'modify' | 'abandon' | 'scale';
  confidence: number;
  reasoning: string;
  suggestedChanges?: string[];
}
