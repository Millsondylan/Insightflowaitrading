// Advanced Analytics Type Definitions

export interface MonteCarloConfig {
  iterations: number;
  timeframe: number; // days
  confidenceInterval: number; // percentage
  includeVolatilityRegimes: boolean;
  correlationAdjustment: boolean;
}

export interface MonteCarloResult {
  id: string;
  config: MonteCarloConfig;
  scenarios: ScenarioResult[];
  statistics: MonteCarloStats;
  performanceMetrics: PerformanceMetrics;
  riskMetrics: RiskMetrics;
  createdAt: Date;
}

export interface ScenarioResult {
  scenarioId: number;
  finalValue: number;
  maxDrawdown: number;
  volatility: number;
  sharpeRatio: number;
  path: number[]; // Price path
}

export interface MonteCarloStats {
  meanReturn: number;
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
  valueAtRisk: number; // VaR at specified confidence level
  expectedShortfall: number; // Conditional VaR
  probabilityOfLoss: number;
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  calmarRatio: number;
}

export interface RiskMetrics {
  var95: number;
  var99: number;
  cvar95: number;
  cvar99: number;
  maxDrawdown: number;
  drawdownDuration: number;
  tailRatio: number;
}

// Alternative data types
export interface SentimentData {
  symbol: string;
  sentiment: number; // -1 to 1
  confidence: number;
  sources: SentimentSource[];
  timestamp: Date;
}

export interface SentimentSource {
  name: string;
  type: 'news' | 'social' | 'analyst' | 'options';
  sentiment: number;
  volume: number;
  relevance: number;
}

export interface NewsData {
  id: string;
  headline: string;
  summary: string;
  source: string;
  sentiment: number;
  relevance: number;
  symbols: string[];
  publishedAt: Date;
  url?: string;
}

export interface OnChainData {
  symbol: string;
  metrics: {
    activeAddresses: number;
    transactionVolume: number;
    networkValue: number;
    hashRate?: number;
    stakingRatio?: number;
  };
  defiMetrics?: {
    totalValueLocked: number;
    liquidityPool: number;
    borrowingRate: number;
    lendingRate: number;
  };
  timestamp: Date;
}

export interface OptionsFlowData {
  symbol: string;
  totalVolume: number;
  putCallRatio: number;
  unusualActivity: UnusualOptionActivity[];
  impliedVolatility: number;
  skew: number;
  timestamp: Date;
}

export interface UnusualOptionActivity {
  strike: number;
  expiry: Date;
  type: 'call' | 'put';
  volume: number;
  openInterest: number;
  premium: number;
  unusualityScore: number;
}

// Correlation analysis types
export interface CorrelationMatrix {
  symbols: string[];
  correlations: number[][]; // 2D correlation matrix
  timeframe: string;
  updatedAt: Date;
}

export interface CorrelationData {
  symbol1: string;
  symbol2: string;
  correlation: number;
  pValue: number;
  confidence: number;
  timeframe: string;
  dataPoints: number;
}

export interface RollingCorrelation {
  symbol1: string;
  symbol2: string;
  window: number;
  correlations: {
    date: Date;
    correlation: number;
  }[];
}

// Event types for analytics
export type AnalyticsEvent =
  | { type: 'MONTE_CARLO_COMPLETE'; payload: { resultId: string; duration: number } }
  | { type: 'SENTIMENT_ALERT'; payload: { symbol: string; sentiment: number; change: number } }
  | { type: 'CORRELATION_SPIKE'; payload: { symbols: string[]; correlation: number } }
  | { type: 'UNUSUAL_OPTIONS_ACTIVITY'; payload: UnusualOptionActivity & { symbol: string } };

// Data provider configurations
export interface DataProviderConfig {
  name: string;
  type: 'news' | 'social' | 'onchain' | 'options' | 'sentiment';
  apiKey?: string;
  endpoint: string;
  rateLimit: number;
  enabled: boolean;
}

export interface AltDataOverlay {
  symbol: string;
  sentiment: SentimentData;
  news: NewsData[];
  onchain?: OnChainData;
  options?: OptionsFlowData;
  correlations: CorrelationData[];
  lastUpdated: Date;
} 