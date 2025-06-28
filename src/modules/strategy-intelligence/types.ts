// Strategy Intelligence Engine - Type Definitions

export interface Strategy {
  id: string;
  name: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  isPublished: boolean;
  rules: StrategyRule[];
  tags: string[];
  performance?: StrategyPerformance;
  metadata?: Record<string, any>;
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
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  profitableTrades: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  timeframe: string;
  period: {
    start: string;
    end: string;
  };
}

export interface VaultGridOptions {
  sortBy: 'name' | 'performance.winRate' | 'performance.profitFactor' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
  filter: {
    tags?: string[];
    author?: string;
    minWinRate?: number;
    minProfitFactor?: number;
    isPublished?: boolean;
  };
  view: 'grid' | 'list' | 'compact';
  pageSize: number;
  page: number;
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