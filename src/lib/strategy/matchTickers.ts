export type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
  warning?: string;
};

export type Ticker = {
  symbol: string;
  price: number;
  change: number; // percentage change (24h or similar)
  volume: number; // 24h volume in base currency
};

/**
 * Matches a strategy's textual rules against a list of market tickers.
 * The matching is keyword-based only and does NOT call any external services.
 *
 * Logic (mock implementation):
 *  • "breakout"   → change > 1% (absolute)
 *  • "volume"     → volume > 1,000,000
 *  • "bitcoin"/"btc" → symbol contains "BTC"
 *  • "bullish"    → change > 0
 *  • "bearish"    → change < 0
 *  • If no recognised keywords are found, all tickers are returned (no filtering)
 */
export function matchTickers(
  strategy: StrategyOutput,
  tickers: Ticker[]
): string[] {
  // Combine all relevant text and lowercase it for simple keyword detection
  const text = (
    [strategy.title, ...strategy.rules, ...strategy.checklist, strategy.warning]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
  );

  // Start with the full list and incrementally filter based on detected keywords
  let results = [...tickers];

  // Price action keywords
  if (text.includes("breakout")) {
    results = results.filter((t) => Math.abs(t.change) > 1);
  }

  // Volume keyword
  if (text.includes("volume")) {
    results = results.filter((t) => t.volume > 1_000_000);
  }

  // Bitcoin specific keyword
  if (text.includes("bitcoin") || text.includes("btc")) {
    results = results.filter((t) => t.symbol.toUpperCase().includes("BTC"));
  }

  // Simple sentiment keywords
  if (text.includes("bullish")) {
    results = results.filter((t) => t.change > 0);
  }

  if (text.includes("bearish")) {
    results = results.filter((t) => t.change < 0);
  }

  // Additional keyword examples can be added here as needed

  return results.map((t) => t.symbol);
} 