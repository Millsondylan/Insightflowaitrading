import * as React from "react";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {digest.map((item) => (
        <div
          key={item.symbol}
          className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow-lg space-y-4 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-400/10"
        >
          {/* Card Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
              <p className="text-lg font-semibold text-white/90">
                ${formatPrice(item.price)}
              </p>
            </div>
            <div
              className={`flex items-center text-lg font-semibold ${getPriceChangeColor(
                item.change
              )}`}
            >
              {item.change > 0 ? (
                <arrowup  >
              ) : (
                <arrowdown  >
              )}
              {formatPercent(item.change)}
            </div>
          </div>

          {/* AI Summary */}
          <p className="text-white/70 text-sm italic border-l-2 border-cyan-400/50 pl-4">
            "{item.summary}"
          </p>

          {/* Card Footer with Stats */}
          <div className="flex justify-between items-center pt-2">
            <div>
              <span className="text-xs text-white/50">24h Volume:</span>
              <p className="font-semibold text-white">
                {formatVolume(item.volume)}
              </p>
            </div>
            <div className="bg-cyan-600/80 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
              <trendingup  >
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
export const lovable = { component: true };
