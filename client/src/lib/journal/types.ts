
export interface JournalEntry {
  id: string;
  title: string;
  pair: string;
  timeframe: string;
  entryPrice: number;
  exitPrice: number;
  chartUrl?: string;
  reason: string;
  sentiment: "Bullish" | "Bearish";
  tags: string[];
  createdAt: string;
  userId: string;
  timestamp: number;
  content: string;
  mood: string;
}

export interface JournalStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  averageHoldTime: number;
  bestTrade: number;
  worstTrade: number;
}

export interface JournalFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  sentiment?: "Bullish" | "Bearish";
  pair?: string;
  tags?: string[];
  profitOnly?: boolean;
  lossOnly?: boolean;
}
