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
  userId?: string;
}

// For form state management
export interface JournalFormData {
  title: string;
  pair: string;
  timeframe: string;
  entryPrice: number | '';
  exitPrice: number | '';
  reason: string;
  sentiment: "Bullish" | "Bearish";
  tags: string;
  chartFile?: File | null;
}

// For validation errors
export interface JournalFormErrors {
  title?: string;
  pair?: string;
  timeframe?: string;
  entryPrice?: string;
  exitPrice?: string;
  reason?: string;
} 