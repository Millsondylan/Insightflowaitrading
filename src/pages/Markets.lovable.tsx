import * as React from "react";
import { useState, useEffect } from "react";
import MarketsTable, { Ticker } from "@/components/markets/MarketsTable";
import MarketDetailPage from "@/components/markets/MarketDetailPage";
import MatchedTickers from "@/components/markets/MatchedTickers";
import { fetchTickers, subscribeToTickerUpdates } from "@/lib/markets/fetchTickers";

const sampleStrategy = {
  title: "Bullish Volume Breakout",
  rules: ["The asset must be bullish", "It needs to show high volume", "It should be in a breakout"],
  checklist: ["Confirm breakout on multiple timeframes", "Check for volume confirmation"],
  warning: "This strategy performs best in a trending market."
};

export default function Markets() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Load tickers on mount
  useEffect(() => {
    const loadTickers = async () => {
      try {
        setLoading(true);
        const data = await fetchTickers();
        setTickers(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tickers:", err);
        setError("Failed to load market data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadTickers();
  }, []);
  
  // Subscribe to ticker updates
  useEffect(() => {
    if (loading || tickers.length === 0) return;
    
    const { unsubscribe } = subscribeToTickerUpdates((updatedTicker) => {
      setTickers(currentTickers => 
        currentTickers.map(ticker => 
          ticker.symbol === updatedTicker.symbol ? updatedTicker : ticker
        )
      );
    }, 3000); // Update every 3 seconds
    
    return () => {
      unsubscribe();
    };
  }, [loading, tickers.length]);
  
  // Handle selecting a market
  const handleSelectMarket = (symbol: string) => {
    setSelectedSymbol(symbol);
  };
  
  // Handle going back to the markets list
  const handleBack = () => {
    setSelectedSymbol(null);
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 text-cyan-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 mb-2">Error</p>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="theme-markets">
        {selectedSymbol ? (
          <MarketDetailPage symbol={selectedSymbol} onBack={handleBack} />
        ) : (
          <div className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Markets</h1>
              <p className="text-white/70">
                Track your favorite assets and discover new trading opportunities.
              </p>
            </div>
            
            <MatchedTickers strategy={sampleStrategy} tickers={tickers} />
            
            <MarketsTable tickers={tickers} onSelect={handleSelectMarket} />
          </div>
        )}
      </div>
    </div>
  );
}
