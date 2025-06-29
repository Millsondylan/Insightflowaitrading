import * as React from "react";
import { useMemo } from "react";
import {
  matchTickers,
  StrategyOutput,
  Ticker,
} from "@/lib/strategy/matchTickers";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye } from "lucide-react";

type Props = {
  strategy: StrategyOutput;
  tickers: Ticker[];
};

/**
 * A component that displays a list of market tickers that match
 * the given strategy's rules.
 */
export default function MatchedTickers({ strategy, tickers }: Props) {
  /**
   * Determines the primary reason for a match based on keywords.
   * This is a simplified logic for display purposes.
   */
  const getPrimaryReason = (
    strategy: StrategyOutput,
    ticker: Ticker
  ): string => {
    const text = [
      strategy.title,
      ...strategy.rules,
      ...strategy.checklist,
    ]
      .join(" ")
      .toLowerCase();

    if (text.includes("breakout") && Math.abs(ticker.change) > 1)
      return "📈 Breakout";
    if (text.includes("volume") && ticker.volume > 1_000_000)
      return "📊 High Volume";
    if (
      (text.includes("bitcoin") || text.includes("btc")) &&
      ticker.symbol.toUpperCase().includes("BTC")
    )
      return "⭐ BTC Focus";
    if (text.includes("bullish") && ticker.change > 0) return "🐂 Bullish";
    if (text.includes("bearish") && ticker.change < 0) return "🐻 Bearish";

    return "🔍 General Match";
  };

  const matchedSymbols = useMemo(
    () => matchTickers(strategy, tickers),
    [strategy, tickers]
  );

  const matchedTickersWithReason = useMemo(() => {
    return tickers
      .filter((t) => matchedSymbols.includes(t.symbol))
      .map((t) => ({
        symbol: t.symbol,
        reason: getPrimaryReason(strategy, t),
      }));
  }, [matchedSymbols, strategy, tickers]);

  return (
    <div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md space-y-4">
      <div className="flex items-center gap-3">
        <sparkles  >
        <h3 className="text-lg font-semibold text-white">
          Strategy Matches:{" "}
          <span className="text-cyan-400">{strategy.title}</span>
        </h3>
      </div>

      {matchedTickersWithReason.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {matchedTickersWithReason.map((ticker) => (
            <div
              key={ticker.symbol}
              className="bg-white/10 hover:bg-cyan-600/50 transition-colors duration-200 px-4 py-2 rounded-full flex items-center justify-between gap-4"
            >
              <div>
                <span className="font-semibold text-white">{ticker.symbol}</span>
                <span className="ml-2 text-xs text-white/70">
                  {ticker.reason}
                </span>
              </div>
              <button size="sm" variant="ghost" style={{ fontSize: "0.75rem", color: "white" }}>
                <eye  >
                View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-white/50">
            No tickers currently match this strategy.
          </p>
        </div>
      )}
    </div>
  );
} 
export const lovable = { component: true };
