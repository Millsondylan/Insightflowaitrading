import { Ticker } from "@/components/markets/MarketsTable";

/**
 * Fetches market tickers data
 * Currently returns mock data but will later be replaced with actual API calls
 * to Binance, CoinMarketCap, or Alpha Vantage
 */
export async function fetchTickers(): Promise<Ticker[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock ticker data
  return [
    // Crypto
    { symbol: "BTCUSD", price: 30250.5, change: 1.45, volume: 120300000 },
    { symbol: "ETHUSD", price: 1860.75, change: -0.82, volume: 93300000 },
    { symbol: "XRPUSD", price: 0.4827, change: 0.26, volume: 12560000 },
    { symbol: "SOLUSD", price: 27.84, change: 3.21, volume: 31450000 },
    { symbol: "ADAUSD", price: 0.3819, change: -1.36, volume: 8765000 },
    { symbol: "DOGEUSD", price: 0.1242, change: 5.67, volume: 18920000 },
    { symbol: "DOTUSD", price: 4.25, change: -0.58, volume: 7690000 },
    
    // Forex
    { symbol: "EURUSD", price: 1.0824, change: 0.12, volume: 89450000 },
    { symbol: "GBPUSD", price: 1.2719, change: -0.23, volume: 65230000 },
    { symbol: "USDJPY", price: 153.67, change: 0.35, volume: 72180000 },
    { symbol: "AUDUSD", price: 0.6571, change: -0.41, volume: 45670000 },
    { symbol: "USDCAD", price: 1.3546, change: 0.19, volume: 38920000 },
  ];
}

/**
 * Fetches ticker data for a single symbol
 * @param symbol The market symbol to fetch (e.g. "BTCUSD")
 */
export async function fetchTickerBySymbol(symbol: string): Promise<Ticker | null> {
  const tickers = await fetchTickers();
  return tickers.find(ticker => ticker.symbol === symbol) || null;
}

/**
 * In a real application, this would subscribe to real-time updates via WebSocket
 * For now, it just simulates random price movements
 */
export function subscribeToTickerUpdates(
  callback: (updatedTicker: Ticker) => void,
  interval = 5000
): { unsubscribe: () => void } {
  const tickers = [
    "BTCUSD", "ETHUSD", "XRPUSD", "SOLUSD", "ADAUSD",
    "DOGEUSD", "DOTUSD", "EURUSD", "GBPUSD", "USDJPY",
    "AUDUSD", "USDCAD"
  ];
  
  // Generate small random price movements
  const timerId = setInterval(async () => {
    const allTickers = await fetchTickers();
    
    // Pick a random ticker to update
    const randomIndex = Math.floor(Math.random() * tickers.length);
    const symbol = tickers[randomIndex];
    
    const ticker = allTickers.find(t => t.symbol === symbol);
    if (!ticker) return;
    
    // Generate a random price change (-1% to +1%)
    const changePercent = (Math.random() * 2 - 1) * 0.01;
    const newPrice = ticker.price * (1 + changePercent);
    
    // Calculate the new daily change
    const newChange = ticker.change + (changePercent * 100);
    
    // Update the volume slightly
    const volumeChange = (Math.random() * 0.01 + 0.995);
    const newVolume = ticker.volume * volumeChange;
    
    // Send the updated ticker to the callback
    const updatedTicker: Ticker = {
      ...ticker,
      price: parseFloat(newPrice.toFixed(newPrice > 100 ? 2 : newPrice > 1 ? 4 : 6)),
      change: parseFloat(newChange.toFixed(2)),
      volume: Math.round(newVolume),
    };
    
    callback(updatedTicker);
  }, interval);
  
  // Return an unsubscribe function
  return {
    unsubscribe: () => clearInterval(timerId)
  };
} 