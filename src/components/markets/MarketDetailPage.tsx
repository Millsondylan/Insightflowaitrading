import * as React from "react";
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ChevronLeft, TrendingUp, Activity, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchTickerBySymbol } from "@/lib/markets/fetchTickers";

type OHLCData = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
};

type VolatilityLevel = "low" | "medium" | "high" | "extreme";

type Props = {
  symbol: string;
  onBack?: () => void;
};

export default function MarketDetailPage({ symbol, onBack }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<{
    price: number;
    change: number;
    changePercent: number;
    ohlc: OHLCData;
    volatility: VolatilityLevel;
    matchingSetups: number;
  }>({
    price: 0,
    change: 0,
    changePercent: 0,
    ohlc: { open: 0, high: 0, low: 0, close: 0, volume: 0, timestamp: "" },
    volatility: "medium",
    matchingSetups: 0,
  });
  
  // Fetch ticker data when symbol changes
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const ticker = await fetchTickerBySymbol(symbol);
        
        if (!ticker) {
          setError(`Could not find data for ${symbol}`);
          setLoading(false);
          return;
        }
        
        // Create a simple hash function for consistent mock data
        const hashCode = (s: string) => {
          let h = 0;
          for (let i = 0; i < s.length; i++) {
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
          }
          return h;
        };

        const hash = hashCode(symbol);
        
        // Determine volatility level based on hash
        let volatility: VolatilityLevel = "medium";
        const volatilityValue = Math.abs(hash % 100);
        if (volatilityValue < 30) volatility = "low";
        else if (volatilityValue < 70) volatility = "medium";
        else if (volatilityValue < 90) volatility = "high";
        else volatility = "extreme";
        
        // Calculate OHLC data based on current price
        const ohlcHigh = ticker.price * (1 + Math.abs(hash % 5) / 100);
        const ohlcLow = ticker.price * (1 - Math.abs((hash >> 4) % 5) / 100);
        
        // Matching setups (0-4) based on hash
        const matchingSetups = Math.abs(hash % 5);
        
        setMarketData({
          price: ticker.price,
          change: ticker.change,
          changePercent: ticker.change, // Change is already in percent
          ohlc: {
            open: ticker.price - (ticker.price * ticker.change / 200), // Approximate open price
            high: ohlcHigh,
            low: ohlcLow,
            close: ticker.price,
            volume: ticker.volume,
            timestamp: new Date().toISOString(),
          },
          volatility,
          matchingSetups,
        });
        
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch data for ${symbol}:`, err);
        setError(`Failed to load data for ${symbol}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketData();
  }, [symbol]);

  // Format price with the appropriate number of decimal places
  const formatPrice = (price: number) => {
    if (price > 1000) {
      return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else if (price > 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
  };
  
  // Format change as a percentage
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Format large numbers (e.g., volume)
  const formatLargeNumber = (number: number) => {
    if (number >= 1_000_000_000) {
      return `${(number / 1_000_000_000).toFixed(2)}B`;
    } else if (number >= 1_000_000) {
      return `${(number / 1_000_000).toFixed(2)}M`;
    } else if (number >= 1_000) {
      return `${(number / 1_000).toFixed(2)}K`;
    } else {
      return number.toString();
    }
  };

  // Get color class for change/price movement
  const getPriceChangeColorClass = (change: number) => {
    return change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-gray-400";
  };
  
  // Get volatility badge color
  const getVolatilityBadgeClass = (volatility: VolatilityLevel) => {
    switch (volatility) {
      case "low": return "bg-blue-900/30 text-blue-400 border-blue-400/30";
      case "medium": return "bg-green-900/30 text-green-400 border-green-400/30";
      case "high": return "bg-yellow-900/30 text-yellow-400 border-yellow-400/30";
      case "extreme": return "bg-red-900/30 text-red-400 border-red-400/30";
      default: return "bg-gray-900/30 text-gray-400 border-gray-400/30";
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="theme-markets space-y-6">
        {onBack && (
          <Button variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
         >
            <ChevronLeft className="h-4 w-4" />
            Back to Markets
          </Button>
        )}
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 text-cyan-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading market data for {symbol}...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="theme-markets space-y-6">
        {onBack && (
          <Button variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          />
            <ChevronLeft className="h-4 w-4" />
            Back to Markets
          </Button>
        )}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 mb-2">Error</p>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-markets space-y-6">
      {/* Back button */}
      {onBack && (
        <Button variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Markets
        </Button>
      )}
      
      {/* Header with symbol, price, and change */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{symbol}</h1>
            <badge variant="outline" className={getVolatilityBadgeClass(marketData.volatility)}>
              {marketData.volatility.charAt(0).toUpperCase() + marketData.volatility.slice(1)} Volatility
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <span>${formatPrice(marketData.price)}</span>
            <span className={`flex items-center ${getPriceChangeColorClass(marketData.changePercent)}`}>
              {marketData.changePercent > 0 ? (
                <arrowUp className="h-5 w-5" />
              ) : marketData.changePercent < 0 ? (
                <arrowDown className="h-5 w-5" />
              ) : null}
              {formatPercent(marketData.changePercent)}
            </span>
          </div>
        </div>
        
        {/* Matching Strategies */}
        {marketData.matchingSetups > 0 && (
          <div className="bg-green-900/20 border border-green-400/30 rounded-lg px-4 py-3 flex items-center gap-3">
            <trendingUp className="h-5 w-5 text-green-400" />
            <div>
              <div className="font-semibold text-green-400">
                {marketData.matchingSetups} {marketData.matchingSetups === 1 ? 'setup matches' : 'setups match'} {symbol} conditions
              </div>
              <div className="text-sm text-gray-400">
                View setups →
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* OHLC Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Open</div>
          <div className="text-lg font-medium">${formatPrice(marketData.ohlc.open)}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">High</div>
          <div className="text-lg font-medium text-green-400">${formatPrice(marketData.ohlc.high)}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Low</div>
          <div className="text-lg font-medium text-red-400">${formatPrice(marketData.ohlc.low)}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Volume (24h)</div>
          <div className="text-lg font-medium">{formatLargeNumber(marketData.ohlc.volume)}</div>
        </div>
      </div>
      
      {/* Chart Placeholder */}
      <div className="bg-black/20 border border-white/10 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 market-glow opacity-10" />
        <div className="text-center">
          <activity className="h-10 w-10 mx-auto mb-4 text-cyan-500/50" />
          <h3 className="text-xl font-medium text-white mb-2">Chart will appear here</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Real-time price chart with technical indicators will be integrated soon.
          </p>
        </div>
      </div>
      
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/30 rounded-lg p-4 border border-white/10 flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-400">Last Update</div>
            <div className="font-medium">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-white/10 flex items-center gap-3">
          <activity className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-400">24h Range</div>
            <div className="font-medium">${formatPrice(marketData.ohlc.low)} - ${formatPrice(marketData.ohlc.high)}</div>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-white/10 flex items-center gap-3">
          <trendingUp className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-400">Price Change</div>
            <div className={`font-medium ${getPriceChangeColorClass(marketData.changePercent)}`}>
              {formatPercent(marketData.changePercent)} (${formatPrice(Math.abs(marketData.change))})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 