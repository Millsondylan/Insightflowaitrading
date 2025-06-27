import { SUPPORTED_CHAINS } from '../wallet/chains';

export interface CryptoPrice {
  symbol: string;
  price: number;
  lastUpdated: Date;
}

// Cache crypto prices to avoid making too many API calls
const priceCache: {
  [symbol: string]: CryptoPrice;
} = {};

/**
 * Get the current price of a cryptocurrency in USD
 * @param symbol The cryptocurrency symbol (e.g., 'BTC', 'ETH', 'USDT')
 * @returns Promise that resolves to the current price in USD
 */
export const getCryptoPrice = async (symbol: string): Promise<number> => {
  // Check if we have a recent price in cache (less than 5 minutes old)
  const cachedPrice = priceCache[symbol];
  const now = new Date();
  if (cachedPrice && (now.getTime() - cachedPrice.lastUpdated.getTime() < 5 * 60 * 1000)) {
    return cachedPrice.price;
  }

  try {
    // In a real app, we'd call CoinGecko or a similar API
    // For this demo, we'll simulate an API call with current approximate prices
    const mockPrices: Record<string, number> = {
      'BTC': 60000,
      'ETH': 3000,
      'USDT': 1,
    };

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    const price = mockPrices[symbol] || 0;
    
    // Update cache
    priceCache[symbol] = {
      symbol,
      price,
      lastUpdated: now
    };

    return price;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    // If API call fails, return the cached price or fallback price
    return cachedPrice?.price || getDefaultPrice(symbol);
  }
};

/**
 * Convert USD amount to crypto amount
 * @param usdAmount Amount in USD
 * @param symbol Cryptocurrency symbol
 * @returns Promise that resolves to the amount in the specified cryptocurrency
 */
export const convertUSDToCrypto = async (usdAmount: number, symbol: string): Promise<number> => {
  const price = await getCryptoPrice(symbol);
  if (price <= 0) throw new Error(`Invalid price for ${symbol}`);

  // Calculate the amount in crypto (USD / price)
  const cryptoAmount = usdAmount / price;

  // Format based on typical decimal places for the cryptocurrency
  const chain = Object.values(SUPPORTED_CHAINS).find(c => c.ticker === symbol);
  const decimals = chain?.decimals || 8; // Default to 8 decimals if chain not found
  
  // Return the formatted crypto amount
  return parseFloat(cryptoAmount.toFixed(decimals));
};

/**
 * Get a default price for a cryptocurrency if API call fails
 */
function getDefaultPrice(symbol: string): number {
  switch (symbol) {
    case 'BTC': return 60000;
    case 'ETH': return 3000;
    case 'USDT': return 1;
    default: return 0;
  }
} 