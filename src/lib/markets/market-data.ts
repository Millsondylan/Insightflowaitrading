// Market data fetching utilities
export interface MarketDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export async function fetchMarketData(symbol: string, timeframe: string): Promise<MarketDataPoint[]> {
  try {
    // For now, return mock data since we don't have a real market data API
    // In a real implementation, this would fetch from a market data provider
    const mockData: MarketDataPoint[] = [];
    const basePrice = 50000 + Math.random() * 10000; // Random base price
    let currentPrice = basePrice;
    
    // Generate 100 data points
    for (let i = 0; i < 100; i++) {
      const volatility = 0.02; // 2% volatility
      const changePercent = (Math.random() - 0.5) * volatility;
      currentPrice *= (1 + changePercent);
      
      const open = currentPrice;
      const close = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      
      // Generate timestamp based on timeframe
      const now = Date.now();
      const intervalMs = getIntervalMs(timeframe);
      const time = now - (100 - i) * intervalMs;
      
      mockData.push({
        time: time / 1000, // Convert to seconds for TradingView
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    
    return mockData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data');
  }
}

function getIntervalMs(timeframe: string): number {
  switch (timeframe.toLowerCase()) {
    case '1m':
      return 60 * 1000;
    case '5m':
      return 5 * 60 * 1000;
    case '15m':
      return 15 * 60 * 1000;
    case '30m':
      return 30 * 60 * 1000;
    case '1h':
      return 60 * 60 * 1000;
    case '4h':
      return 4 * 60 * 60 * 1000;
    case '1d':
    case 'd1':
      return 24 * 60 * 60 * 1000;
    case '1w':
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000; // Default to 15m
  }
}

export async function fetchLatestPrice(symbol: string): Promise<number> {
  try {
    // Mock implementation - in real app this would fetch from API
    const basePrice = 50000;
    const randomVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return basePrice * (1 + randomVariation);
  } catch (error) {
    console.error('Error fetching latest price:', error);
    throw new Error('Failed to fetch latest price');
  }
}

export async function fetchMarketInfo(symbol: string): Promise<{
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
}> {
  try {
    // Mock implementation
    const price = await fetchLatestPrice(symbol);
    const change24h = (Math.random() - 0.5) * 0.2; // ±10% change
    const volume24h = Math.floor(Math.random() * 1000000000) + 100000000;
    
    return {
      name: symbol,
      price,
      change24h,
      volume24h
    };
  } catch (error) {
    console.error('Error fetching market info:', error);
    throw new Error('Failed to fetch market info');
  }
} 