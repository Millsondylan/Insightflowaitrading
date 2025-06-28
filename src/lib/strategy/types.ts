export interface Strategy {
  id: string;
  name: string;
  parameters: {
    entryThreshold: number;
    exitThreshold: number;
    stopLoss: number;
    takeProfit: number;
    positionSize: number;
    [key: string]: number;
  };
  rules: string[];
  timeframe: string;
  symbols: string[];
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
  parameterBounds: {
    entryThreshold: [number, number];
    exitThreshold: [number, number];
    stopLoss: [number, number];
    takeProfit: [number, number];
    positionSize: [number, number];
    [key: string]: [number, number];
  };
}

export interface OptimizationResult {
  optimizedStrategy: Strategy;
  metrics: PerformanceMetrics;
  convergenceHistory: number[];
  generationStats?: {
    bestFitness: number[];
    avgFitness: number[];
    worstFitness: number[];
  };
}

export interface PerformanceMetrics {
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  expectancy: number;
  trades: number;
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