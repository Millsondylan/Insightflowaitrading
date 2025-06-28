export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Generates a random walk for price simulation
const generateRandomWalk = (
  initialPrice: number,
  steps: number,
  volatility: number
) => {
  const prices = [initialPrice];
  for (let i = 1; i < steps; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    const newPrice = prices[i - 1] * (1 + change);
    prices.push(newPrice);
  }
  return prices;
};

// Generates a sample OHLCV dataset
const generateCandles = (
  initialPrice: number,
  count: number,
  volatility: number,
  timeframeSeconds: number
): OHLCV[] => {
  const candles: OHLCV[] = [];
  const now = Math.floor(Date.now() / 1000);
  let currentPrice = initialPrice;
  
  for (let i = 0; i < count; i++) {
    const open = currentPrice;
    const high = open * (1 + Math.random() * volatility);
    const low = open * (1 - Math.random() * volatility);
    const close = low + Math.random() * (high - low);
    const volume = Math.random() * 1000 + 100;
    
    candles.push({
      time: now - (count - i) * timeframeSeconds,
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
  }
  
  return candles;
};

// Sample datasets for different tickers and timeframes
export const sampleData: Record<string, Record<string, OHLCV[]>> = {
  BTC: {
    '1H': generateCandles(65000, 1000, 0.01, 3600),
  },
  ETH: {
    '1H': generateCandles(3500, 1000, 0.015, 3600),
  },
  ARB: {
    '1H': generateCandles(1, 1000, 0.03, 3600),
  },
};

export const getSampleData = (ticker: string, timeframe: string): OHLCV[] => {
  return sampleData[ticker]?.[timeframe] || [];
}; 