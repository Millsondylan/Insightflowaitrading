import { Ticker } from "@/components/markets/MarketsTable";

export type MarketType = 'crypto' | 'forex' | 'stock' | 'index' | 'commodity';

export interface DetailedTicker extends Ticker {
  type: MarketType;
  description: string;
  sector?: string;
  marketCap?: number; // in millions USD
  dayHigh?: number;
  dayLow?: number;
  yearHigh?: number;
  yearLow?: number;
  averageVolume?: number;
}

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
    { symbol: "BTCUSD", price: 70415.32, change: 2.45, volume: 28520000000 },
    { symbol: "ETHUSD", price: 3852.64, change: -0.82, volume: 9330000000 },
    { symbol: "XRPUSD", price: 0.4827, change: 0.26, volume: 1256000000 },
    { symbol: "SOLUSD", price: 162.84, change: 3.21, volume: 3145000000 },
    { symbol: "ADAUSD", price: 0.4519, change: -1.36, volume: 876500000 },
    { symbol: "DOGEUSD", price: 0.1642, change: 5.67, volume: 1892000000 },
    { symbol: "DOTUSD", price: 7.45, change: -0.58, volume: 769000000 },
    { symbol: "AVAXUSD", price: 35.27, change: 2.15, volume: 980000000 },
    { symbol: "LINKUSD", price: 15.32, change: 1.23, volume: 545000000 },
    { symbol: "MATICUSD", price: 0.65, change: -0.78, volume: 324000000 },
    
    // Forex
    { symbol: "EURUSD", price: 1.0824, change: 0.12, volume: 89450000 },
    { symbol: "GBPUSD", price: 1.2719, change: -0.23, volume: 65230000 },
    { symbol: "USDJPY", price: 153.67, change: 0.35, volume: 72180000 },
    { symbol: "AUDUSD", price: 0.6571, change: -0.41, volume: 45670000 },
    { symbol: "USDCAD", price: 1.3546, change: 0.19, volume: 38920000 },
    { symbol: "USDCHF", price: 0.9031, change: 0.05, volume: 29820000 },
    { symbol: "NZDUSD", price: 0.5932, change: -0.27, volume: 21450000 },
    { symbol: "EURJPY", price: 166.58, change: 0.47, volume: 32780000 },
    { symbol: "GBPJPY", price: 195.45, change: 0.12, volume: 24560000 },
    { symbol: "EURGBP", price: 0.8510, change: 0.35, volume: 18750000 },
    
    // Major Indices
    { symbol: "SPX", price: 5624.15, change: 0.65, volume: 2568000000 },
    { symbol: "NDX", price: 20152.82, change: 0.92, volume: 4875000000 },
    { symbol: "DJI", price: 42321.46, change: 0.45, volume: 312000000 },
    { symbol: "RUT", price: 2243.78, change: -0.25, volume: 156000000 },
    { symbol: "FTSE", price: 8183.92, change: 0.33, volume: 684000000 },
    { symbol: "DAX", price: 18458.75, change: 0.86, volume: 742000000 },
    { symbol: "CAC", price: 8163.71, change: 0.72, volume: 356000000 },
    { symbol: "N225", price: 39798.35, change: 1.14, volume: 982000000 },
    { symbol: "HSI", price: 19745.25, change: -0.56, volume: 1528000000 },
    { symbol: "SSEC", price: 3142.78, change: 0.27, volume: 18650000000 },
    
    // Popular Stocks
    { symbol: "AAPL", price: 185.64, change: 1.28, volume: 62450000 },
    { symbol: "MSFT", price: 428.81, change: 0.87, volume: 22760000 },
    { symbol: "GOOG", price: 172.75, change: 1.63, volume: 18540000 },
    { symbol: "AMZN", price: 186.35, change: 0.54, volume: 32180000 },
    { symbol: "META", price: 512.74, change: 2.17, volume: 15680000 },
    { symbol: "TSLA", price: 178.32, change: -1.85, volume: 78920000 },
    { symbol: "NVDA", price: 924.58, change: 3.28, volume: 42650000 },
    { symbol: "NFLX", price: 647.85, change: 0.62, volume: 4185000 },
    { symbol: "JPM", price: 196.42, change: -0.32, volume: 8950000 },
    { symbol: "V", price: 275.67, change: 0.38, volume: 5640000 },
    
    // Commodities
    { symbol: "GOLD", price: 2328.45, change: 0.78, volume: 186500000 },
    { symbol: "SILVER", price: 32.24, change: 1.12, volume: 72800000 },
    { symbol: "OIL", price: 82.35, change: -0.64, volume: 356800000 },
    { symbol: "NATGAS", price: 2.47, change: -1.52, volume: 128500000 },
    { symbol: "COPPER", price: 4.34, change: 0.87, volume: 94300000 },
    { symbol: "WHEAT", price: 623.75, change: -0.35, volume: 38700000 },
    { symbol: "CORN", price: 453.25, change: -0.82, volume: 26500000 },
    { symbol: "COTTON", price: 82.35, change: 0.23, volume: 18300000 },
  ];
}

/**
 * Gets detailed information about a specific ticker
 * @param symbol The ticker symbol to retrieve
 */
export async function getDetailedTickerInfo(symbol: string): Promise<DetailedTicker | null> {
  // In a real application, this would make a specific API call for detailed data
  const detailedData: Record<string, DetailedTicker> = {
    "BTCUSD": {
      symbol: "BTCUSD",
      price: 70415.32,
      change: 2.45,
      volume: 28520000000,
      type: 'crypto',
      description: "Bitcoin/US Dollar",
      marketCap: 1375208,
      dayHigh: 71245.82,
      dayLow: 69823.15,
      yearHigh: 73737.73,
      yearLow: 24950.35,
      averageVolume: 25430000000
    },
    "AAPL": {
      symbol: "AAPL",
      price: 185.64,
      change: 1.28,
      volume: 62450000,
      type: 'stock',
      description: "Apple Inc.",
      sector: "Technology",
      marketCap: 2870542,
      dayHigh: 187.45,
      dayLow: 184.23,
      yearHigh: 198.23,
      yearLow: 164.57,
      averageVolume: 58240000
    },
    "SPX": {
      symbol: "SPX",
      price: 5624.15,
      change: 0.65,
      volume: 2568000000,
      type: 'index',
      description: "S&P 500 Index",
      dayHigh: 5632.42,
      dayLow: 5602.18,
      yearHigh: 5669.67,
      yearLow: 4103.78,
      averageVolume: 2350000000
    },
    "EURUSD": {
      symbol: "EURUSD",
      price: 1.0824,
      change: 0.12,
      volume: 89450000,
      type: 'forex',
      description: "Euro/US Dollar",
      dayHigh: 1.0845,
      dayLow: 1.0798,
      yearHigh: 1.1275,
      yearLow: 1.0448,
      averageVolume: 85670000
    },
    "GOLD": {
      symbol: "GOLD",
      price: 2328.45,
      change: 0.78,
      volume: 186500000,
      type: 'commodity',
      description: "Gold Futures",
      dayHigh: 2335.80,
      dayLow: 2318.25,
      yearHigh: 2431.40,
      yearLow: 1810.80,
      averageVolume: 172450000
    }
    // Additional detailed info would be added for other symbols
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return detailedData[symbol] || null;
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
 * Filters tickers by market type
 * @param marketType The type of market to filter by (crypto, forex, stock, index, commodity)
 */
export async function fetchTickersByType(marketType: MarketType): Promise<Ticker[]> {
  const tickers = await fetchTickers();
  
  // Map symbols to market types
  const typeMap: Record<string, MarketType> = {
    // Crypto
    "BTCUSD": 'crypto', "ETHUSD": 'crypto', "XRPUSD": 'crypto', 
    "SOLUSD": 'crypto', "ADAUSD": 'crypto', "DOGEUSD": 'crypto',
    "DOTUSD": 'crypto', "AVAXUSD": 'crypto', "LINKUSD": 'crypto', "MATICUSD": 'crypto',
    
    // Forex
    "EURUSD": 'forex', "GBPUSD": 'forex', "USDJPY": 'forex', 
    "AUDUSD": 'forex', "USDCAD": 'forex', "USDCHF": 'forex',
    "NZDUSD": 'forex', "EURJPY": 'forex', "GBPJPY": 'forex', "EURGBP": 'forex',
    
    // Indices
    "SPX": 'index', "NDX": 'index', "DJI": 'index', "RUT": 'index',
    "FTSE": 'index', "DAX": 'index', "CAC": 'index', 
    "N225": 'index', "HSI": 'index', "SSEC": 'index',
    
    // Stocks
    "AAPL": 'stock', "MSFT": 'stock', "GOOG": 'stock', "AMZN": 'stock',
    "META": 'stock', "TSLA": 'stock', "NVDA": 'stock', 
    "NFLX": 'stock', "JPM": 'stock', "V": 'stock',
    
    // Commodities
    "GOLD": 'commodity', "SILVER": 'commodity', "OIL": 'commodity', "NATGAS": 'commodity',
    "COPPER": 'commodity', "WHEAT": 'commodity', "CORN": 'commodity', "COTTON": 'commodity'
  };
  
  return tickers.filter(ticker => typeMap[ticker.symbol] === marketType);
}

/**
 * Gets the top performing tickers by percentage change
 * @param limit Number of tickers to return
 * @param ascending If true, returns worst performers (negative change first). If false, returns best performers
 */
export async function getTopPerformers(limit = 10, ascending = false): Promise<Ticker[]> {
  const tickers = await fetchTickers();
  
  return [...tickers]
    .sort((a, b) => ascending ? a.change - b.change : b.change - a.change)
    .slice(0, limit);
}

/**
 * Gets tickers with the highest trading volume
 * @param limit Number of tickers to return
 */
export async function getHighestVolumeTickers(limit = 10): Promise<Ticker[]> {
  const tickers = await fetchTickers();
  
  return [...tickers]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
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
    "AUDUSD", "USDCAD", "AAPL", "MSFT", "GOOG", 
    "AMZN", "META", "TSLA", "NVDA", "NFLX"
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