import * as React from "react";
import { useMemo } from "react";
import {
  matchTickers,
  StrategyOutput,
  Ticker,
} from "@/lib/strategy/matchTickers";

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
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Sparkles  />
        <h3 style={{ color: "white" }}>
          Strategy Matches:{" "}
          <span >{strategy.title}</span>
        </h3>
      </div>

      {matchedTickersWithReason.length > 0 ? (
        <div style={{ display: "flex" }}>
          {matchedTickersWithReason.map((ticker) => (
            <div
              key={ticker.symbol}
              style={{ paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center" }}
            >
              <div>
                <span style={{ color: "white" }}>{ticker.symbol}</span>
                <span >
                  {ticker.reason}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                style={{ color: "white" }}
              >
                <span style={{fontSize: '16px'}}>👁️</span>
                View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div >
          <p >
            No tickers currently match this strategy.
          </p>
        </div>
      )}
    </div>
  );
} 