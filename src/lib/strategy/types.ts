export interface Strategy {
  id: string;
  name: string;
  parameters: Record<string, number>;
  rules: StrategyRule[];
  version: string;
}

export interface StrategyRule {
  id: string;
  condition: string;
  action: string;
  parameters: Record<string, any>;
}

export interface OptimizationParams {
  maxGenerations: number;
  populationSize: number;
  convergenceThreshold: number;
  maxIterations: number;
  initialPoints: number;
  parameterBounds: Record<string, [number, number]>;
}

export interface OptimizationResult {
  optimizedStrategy: Strategy;
  metrics: PerformanceMetrics;
}

export interface PerformanceMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  recoveryFactor: number;
}

export interface Trade {
  id: string;
  timestamp: number;
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  size: number;
  pnl?: number;
  status: 'open' | 'closed';
} 