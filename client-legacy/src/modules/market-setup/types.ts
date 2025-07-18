// Market Setup Module - Type Definitions

export type MarketType = 'Stocks' | 'Crypto' | 'Forex' | 'Commodities';
export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | 'Daily' | 'Weekly';
export type MarketCondition = 'Bullish' | 'Bearish' | 'Neutral' | 'High Volatility' | 'Low Volatility';

export interface MarketTicker {
  symbol: string;
  name: string;
  type: MarketType;
  price: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface MarketScannerFilter {
  marketType?: MarketType;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  timeFrame?: TimeFrame;
  condition?: MarketCondition;
}

export interface BroadcastEvent {
  id: string;
  title: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  timestamp: Date;
  relatedAssets?: string[];
  source?: string;
}

export interface DailyPlan {
  id: string;
  date: Date;
  marketOutlook: MarketCondition;
  potentialTrades: MarketTicker[];
  keyEvents: BroadcastEvent[];
  riskManagement: {
    totalRisk: number;
    maxDrawdown: number;
  };
}

export interface InsightFeedItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  tags: string[];
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  confidence: number;
  relatedAssets?: string[];
}

// Market Setup module types
export interface MarketSetup {
  id: string;
  name: string;
  description: string;
  conditions: SetupCondition[];
  timeframe: string;
  symbols: string[];
  confidence: number;
  createdAt: string;
}

export interface SetupCondition {
  id: string;
  type: 'technical' | 'fundamental' | 'sentiment';
  indicator: string;
  operator: 'above' | 'below' | 'equals' | 'crosses';
  value: number | string;
  timeframe?: string;
}

export interface SetupAlert {
  id: string;
  setupId: string;
  triggered: boolean;
  triggeredAt?: string;
  symbol: string;
  price: number;
} 