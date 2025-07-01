// Risk Management Type Definitions

export interface RiskProfile {
  userId: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  maxDrawdown: number;
  positionSizeLimit: number;
  dailyLossLimit: number;
}

export interface RiskAlert {
  id: string;
  userId: string;
  type: 'drawdown' | 'position_size' | 'daily_loss' | 'concentration';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggeredAt: string;
  resolvedAt?: string;
}

export interface RiskMetric {
  userId: string;
  date: string;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
}

export interface PositionSizingConfig {
  method: 'fixed' | 'volatility' | 'kelly' | 'atr';
  baseRiskPercent: number;
  volatilityLookback: number;
  maxPositionSize: number;
  minPositionSize: number;
  volatilityAdjustment: boolean;
  correlationAdjustment: boolean;
}

export interface PreTradeCheck {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  stopLoss?: number;
  passed: boolean;
  warnings: string[];
  errors: string[];
  timestamp: Date;
}

export interface RiskMetrics {
  currentDrawdown: number;
  portfolioRisk: number;
  correlationRisk: number;
  volatilityIndex: number;
  marginUtilization: number;
  openPositionsCount: number;
}

export interface LivePaperAccount {
  id: string;
  accountId: string;
  balance: number;
  equity: number;
  margin: number;
  marginLevel: number;
  provider: 'ib' | 'mt5' | 'demo';
  connected: boolean;
  lastSync: Date;
}

export interface VolatilityData {
  symbol: string;
  period: string;
  atr: number;
  historicalVolatility: number;
  impliedVolatility?: number;
  lastUpdated: Date;
}

// Event types for risk management
export type RiskEvent = 
  | { type: 'RISK_LIMIT_EXCEEDED'; payload: { metric: string; value: number; limit: number } }
  | { type: 'POSITION_SIZE_ADJUSTED'; payload: { originalSize: number; adjustedSize: number; reason: string } }
  | { type: 'PRE_TRADE_FAILED'; payload: PreTradeCheck }
  | { type: 'ACCOUNT_SYNC_FAILED'; payload: { accountId: string; error: string } }; 