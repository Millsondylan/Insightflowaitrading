import * as React from "react";
import { useState, useEffect } from "react";
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
      <div >
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}
          >
            <ChevronLeft  />
            Back to Markets
          </Button>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Loader2 style={{ marginBottom: "16px" }} />
          <p style={{ color: "#9CA3AF" }}>Loading market data for {symbol}...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div >
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}
          >
            <ChevronLeft  />
            Back to Markets
          </Button>
        )}
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
          <p >Error</p>
          <p style={{ color: "white" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div >
      {/* Back button */}
      {onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}
        >
          <ChevronLeft  />
          Back to Markets
        </Button>
      )}
      
      {/* Header with symbol, price, and change */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>{symbol}</h1>
            <Badge variant="outline" className={getVolatilityBadgeClass(marketData.volatility)}>
              {marketData.volatility.charAt(0).toUpperCase() + marketData.volatility.slice(1)} Volatility
            </Badge>
          </div>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>${formatPrice(marketData.price)}</span>
            <span className={`flex items-center ${getPriceChangeColorClass(marketData.changePercent)}`}>
              {marketData.changePercent > 0 ? (
                <span style={{fontSize: '16px'}}>⬆️</span>
              ) : marketData.changePercent < 0 ? (
                <span style={{fontSize: '16px'}}>⬇️</span>
              ) : null}
              {formatPercent(marketData.changePercent)}
            </span>
          </div>
        </div>
        
        {/* Matching Strategies */}
        {marketData.matchingSetups > 0 && (
          <div style={{ border: "1px solid #374151", paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>📈</span>
            <div>
              <div >
                {marketData.matchingSetups} {marketData.matchingSetups === 1 ? 'setup matches' : 'setups match'} {symbol} conditions
              </div>
              <div style={{ color: "#9CA3AF" }}>
                View setups →
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* OHLC Summary */}
      <div >
        <div style={{ padding: "16px", border: "1px solid #374151" }}>
          <div style={{ color: "#9CA3AF" }}>Open</div>
          <div >${formatPrice(marketData.ohlc.open)}</div>
        </div>
        <div style={{ padding: "16px", border: "1px solid #374151" }}>
          <div style={{ color: "#9CA3AF" }}>High</div>
          <div >${formatPrice(marketData.ohlc.high)}</div>
        </div>
        <div style={{ padding: "16px", border: "1px solid #374151" }}>
          <div style={{ color: "#9CA3AF" }}>Low</div>
          <div >${formatPrice(marketData.ohlc.low)}</div>
        </div>
        <div style={{ padding: "16px", border: "1px solid #374151" }}>
          <div style={{ color: "#9CA3AF" }}>Volume (24h)</div>
          <div >{formatLargeNumber(marketData.ohlc.volume)}</div>
        </div>
      </div>
      
      {/* Chart Placeholder */}
      <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div  />
        <div >
          <Activity style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "16px" }} />
          <h3 style={{ color: "white" }}>Chart will appear here</h3>
          <p style={{ color: "#9CA3AF", marginLeft: "auto", marginRight: "auto" }}>
            Real-time price chart with technical indicators will be integrated soon.
          </p>
        </div>
      </div>
      
      {/* Market Stats */}
      <div >
        <div style={{ padding: "16px", border: "1px solid #374151", display: "flex", alignItems: "center" }}>
          <span style={{fontSize: '16px'}}>⏰</span>
          <div>
            <div style={{ color: "#9CA3AF" }}>Last Update</div>
            <div >{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        <div style={{ padding: "16px", border: "1px solid #374151", display: "flex", alignItems: "center" }}>
          <Activity style={{ color: "#9CA3AF" }} />
          <div>
            <div style={{ color: "#9CA3AF" }}>24h Range</div>
            <div >${formatPrice(marketData.ohlc.low)} - ${formatPrice(marketData.ohlc.high)}</div>
          </div>
        </div>
        <div style={{ padding: "16px", border: "1px solid #374151", display: "flex", alignItems: "center" }}>
          <span style={{fontSize: '16px'}}>📈</span>
          <div>
            <div style={{ color: "#9CA3AF" }}>Price Change</div>
            <div className={`font-medium ${getPriceChangeColorClass(marketData.changePercent)}`}>
              {formatPercent(marketData.changePercent)} (${formatPrice(Math.abs(marketData.change))})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 