// Strategy Intelligence Engine - Type Definitions

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  risk: RiskLevel;
  performance: StrategyPerformance;
  tags?: string[];
  isPublished?: boolean;

  // Additional strategy metadata
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: string;
  rules?: StrategyRule[];
  metadata?: Record<string, any>;
  marketConditions?: string[];
  timeframe?: string;
  assets?: string[];
}

export interface StrategyRule {
  id: string;
  type: 'entry' | 'exit' | 'filter' | 'position';
  condition: string;
  parameters: Record<string, any>;
  description: string;
  priority: number;
  isActive: boolean;
}

export interface StrategyPerformance {
  winRate: number;
  profitFactor: number;
  totalReturn: string;
  
  // Additional performance metrics
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  profitableTrades: number;
  averageTradeProfit: number;
  averageTradeDuration: number;
  expectancy: number;
  riskRewardRatio: number;
}

export interface VaultGridOptions {
  sortBy: 'name' | 'performance.winRate' | 'performance.profitFactor' | 'updatedAt' | keyof Strategy;
  sortDirection: 'asc' | 'desc';
  filter: {
    tags?: string[];
    author?: string;
    minWinRate?: number;
    minProfitFactor?: number;
    isPublished?: boolean;
  } | {
    risk?: RiskLevel[];
  };
  view: 'grid' | 'list' | 'compact';
  pageSize: number;
  page: number;
  searchTerm?: string;
}

export interface HeatmapData {
  strategyId: string;
  timeframe: string;
  data: HeatmapCell[][];
}

export interface HeatmapCell {
  x: number; // Day of week or hour
  y: number; // Hour or day of month
  value: number; // Performance metric
  trades: number; // Number of trades
}

export interface VersionData {
  version: string;
  timestamp: string;
  author: string;
  changes: {
    added: StrategyRule[];
    removed: StrategyRule[];
    modified: {
      before: StrategyRule;
      after: StrategyRule;
    }[];
  };
  performance?: StrategyPerformance;
}

export interface PublishOptions {
  isPublic: boolean;
  requiresProAccess: boolean;
  price?: number;
  allowForks: boolean;
  includeBacktestData: boolean;
  license: 'MIT' | 'GPL' | 'Proprietary' | 'CC';
} 