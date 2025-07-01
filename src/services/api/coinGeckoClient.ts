interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

/**
 * Fetches market data from CoinGecko API (simulated for demo)
 * @param vs_currency The currency to get prices in (default: 'usd')
 * @param per_page Number of results per page (default: 10)
 * @param page Page number (default: 1)
 * @returns Promise that resolves to an array of coin data
 */
export const getMarketData = async (
  vs_currency = 'usd',
  per_page = 10,
  page = 1
): Promise<CoinData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data for demo purposes
  const mockData: CoinData[] = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.50,
      change24h: 2.1,
      marketCap: 850000000000,
      volume24h: 15000000000,
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650.75,
      change24h: 1.8,
      marketCap: 320000000000,
      volume24h: 8500000000,
    },
    {
      id: 'tether',
      symbol: 'USDT',
      name: 'Tether',
      price: 1.00,
      change24h: 0.01,
      marketCap: 95000000000,
      volume24h: 25000000000,
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'BNB',
      price: 315.20,
      change24h: -0.5,
      marketCap: 47000000000,
      volume24h: 850000000,
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 98.45,
      change24h: 3.2,
      marketCap: 43000000000,
      volume24h: 1200000000,
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'XRP',
      price: 0.61,
      change24h: 1.1,
      marketCap: 33000000000,
      volume24h: 950000000,
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.48,
      change24h: -1.2,
      marketCap: 17000000000,
      volume24h: 420000000,
    },
    {
      id: 'dogecoin',
      symbol: 'DOGE',
      name: 'Dogecoin',
      price: 0.087,
      change24h: 0.8,
      marketCap: 12500000000,
      volume24h: 680000000,
    },
    {
      id: 'polygon',
      symbol: 'MATIC',
      name: 'Polygon',
      price: 0.92,
      change24h: 2.5,
      marketCap: 9200000000,
      volume24h: 350000000,
    },
    {
      id: 'chainlink',
      symbol: 'LINK',
      name: 'Chainlink',
      price: 14.65,
      change24h: 1.9,
      marketCap: 8600000000,
      volume24h: 280000000,
    },
  ];

  return mockData.slice((page - 1) * per_page, page * per_page);
};

/**
 * Gets a specific coin's data by symbol
 * @param symbol The coin symbol (e.g., 'BTC', 'ETH')
 * @returns Promise that resolves to coin data or null if not found
 */
export const getCoinBySymbol = async (symbol: string): Promise<CoinData | null> => {
  const marketData = await getMarketData('usd', 100, 1);
  return marketData.find(coin => coin.symbol.toLowerCase() === symbol.toLowerCase()) || null;
}; 