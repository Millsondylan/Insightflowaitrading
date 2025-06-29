import * as React from "react";

export type DigestItem = {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  matchedStrategies: number;
  summary: string;
};

type Props = {
  digest: DigestItem[];
};

/**
 * A component that renders a scrollable feed of market digest items.
 * Each item represents a ticker that has matched one or more strategies,
 * complete with an AI-generated summary.
 */
export default function MarketDigest({ digest }: Props) {
  // Helper to format price with appropriate decimal places
  const formatPrice = (price: number) => {
    if (price > 1000) {
      return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
    } else if (price > 1) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      });
    }
  };

  // Helper to format the percentage change
  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // Helper to format large volume numbers
  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000_000) {
      return `${(volume / 1_000_000_000).toFixed(1)}B`;
    } else if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(1)}M`;
    } else if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  // Helper to get color based on price change
  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div >
      {digest.map((item) => (
        <div
          key={item.symbol}
          style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151" }}
        >
          {/* Card Header */}
          <div style={{ display: "flex" }}>
            <div>
              <h3 style={{ fontWeight: "700", color: "white" }}>{item.symbol}</h3>
              <p >
                ${formatPrice(item.price)}
              </p>
            </div>
            <div
              className={`flex items-center text-lg font-semibold ${getPriceChangeColor(
                item.change
              )}`}
            >
              {item.change > 0 ? (
                <span style={{fontSize: '16px'}}>⬆️</span>
              ) : (
                <span style={{fontSize: '16px'}}>⬇️</span>
              )}
              {formatPercent(item.change)}
            </div>
          </div>

          {/* AI Summary */}
          <p >
            "{item.summary}"
          </p>

          {/* Card Footer with Stats */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <span >24h Volume:</span>
              <p style={{ color: "white" }}>
                {formatVolume(item.volume)}
              </p>
            </div>
            <div style={{ color: "white", display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>📈</span>
              <span>
                {item.matchedStrategies}{" "}
                {item.matchedStrategies === 1 ? "Strategy" : "Strategies"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 