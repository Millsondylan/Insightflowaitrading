import { supabase } from '@/lib/supabase';

/**
 * Fetch market data based on market type
 */
export async function fetchMarketData(marketType: string) {
  // Example mock data for development
  const forexPairs = [
    { symbol: 'EURUSD', name: 'Euro / US Dollar', price: '1.08742', priceChange: 0.21, isFavorite: true },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: '1.27153', priceChange: -0.15, isFavorite: true },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: '149.65', priceChange: -0.32, isFavorite: false },
    { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', price: '1.36475', priceChange: 0.18, isFavorite: false },
    { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', price: '0.67581', priceChange: 0.42, isFavorite: false },
    { symbol: 'EURGBP', name: 'Euro / British Pound', price: '0.85524', priceChange: 0.24, isFavorite: false },
  ];
  
  const cryptoPairs = [
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: '38742.50', priceChange: 2.74, isFavorite: true },
    { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', price: '2194.25', priceChange: 3.15, isFavorite: true },
    { symbol: 'LTCUSD', name: 'Litecoin / US Dollar', price: '71.82', priceChange: 1.68, isFavorite: false },
    { symbol: 'XRPUSD', name: 'Ripple / US Dollar', price: '0.62184', priceChange: -0.56, isFavorite: false },
    { symbol: 'SOLUSD', name: 'Solana / US Dollar', price: '142.35', priceChange: 5.24, isFavorite: false },
    { symbol: 'ADAUSD', name: 'Cardano / US Dollar', price: '0.38941', priceChange: 1.12, isFavorite: false },
  ];
  
  const indices = [
    { symbol: 'US500', name: 'S&P 500', price: '5021.75', priceChange: 0.85, isFavorite: false },
    { symbol: 'US30', name: 'Dow Jones Industrial Average', price: '38562.50', priceChange: 0.63, isFavorite: false },
    { symbol: 'US100', name: 'Nasdaq 100', price: '17852.25', priceChange: 1.24, isFavorite: false },
    { symbol: 'GER40', name: 'DAX', price: '16785.50', priceChange: 0.45, isFavorite: false },
    { symbol: 'UK100', name: 'FTSE 100', price: '7652.25', priceChange: -0.12, isFavorite: false },
    { symbol: 'JPN225', name: 'Nikkei 225', price: '36245.75', priceChange: -0.35, isFavorite: false },
  ];
  
  const commodities = [
    { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: '2032.45', priceChange: 0.28, isFavorite: false },
    { symbol: 'XAGUSD', name: 'Silver / US Dollar', price: '23.175', priceChange: 0.52, isFavorite: false },
    { symbol: 'WTIUSD', name: 'WTI Crude Oil / US Dollar', price: '76.92', priceChange: -1.25, isFavorite: false },
    { symbol: 'BCOUSD', name: 'Brent Crude Oil / US Dollar', price: '82.35', priceChange: -0.87, isFavorite: false },
    { symbol: 'NGCUSD', name: 'Natural Gas / US Dollar', price: '1.852', priceChange: -2.34, isFavorite: false },
    { symbol: 'XCUUSD', name: 'Copper / US Dollar', price: '3.8675', priceChange: 0.15, isFavorite: false },
  ];
  
  const marketData = {
    forex: forexPairs,
    crypto: cryptoPairs,
    indices: indices,
    commodities: commodities,
  };
  
  // In a real implementation, you would fetch this data from an API
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return marketData[marketType] || marketData.forex;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data');
  }
}

/**
 * Toggle a market as favorite
 */
export async function toggleFavorite(userId: string, symbol: string, isFavorite: boolean) {
  // In a real implementation, this would update the user's favorites in Supabase
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true, symbol, isFavorite };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Failed to update favorite status');
  }
}

/**
 * Get detailed data for a specific market
 */
export async function getMarketDetail(symbol: string) {
  // Example mock data for development
  const marketDetails = {
    EURUSD: {
      symbol: 'EURUSD',
      name: 'Euro / US Dollar',
      price: '1.08742',
      priceChange: 0.21,
      open: '1.08512',
      high: '1.08821',
      low: '1.08431',
      volume: 145782,
      bid: '1.08732',
      ask: '1.08752',
      spread: '2.0',
      dailyRange: '0.00390',
      weeklyChange: '-0.45%',
      monthlyChange: '0.86%',
      volatility: 'Medium',
      marketHours: '24/5',
      relatedPairs: ['GBPUSD', 'EURGBP', 'EURCAD'],
    },
    BTCUSD: {
      symbol: 'BTCUSD',
      name: 'Bitcoin / US Dollar',
      price: '38742.50',
      priceChange: 2.74,
      open: '37705.25',
      high: '39125.75',
      low: '37625.00',
      volume: 28541,
      bid: '38732.50',
      ask: '38752.50',
      spread: '20.0',
      dailyRange: '1500.75',
      weeklyChange: '6.24%',
      monthlyChange: '12.85%',
      volatility: 'High',
      marketHours: '24/7',
      relatedPairs: ['ETHUSD', 'LTCUSD', 'XRPUSD'],
    },
  };
  
  // In a real implementation, you would fetch this data from an API
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock data for the requested symbol or a generic template
    return marketDetails[symbol] || {
      symbol,
      name: symbol,
      price: '0.00000',
      priceChange: 0,
      open: '0.00000',
      high: '0.00000',
      low: '0.00000',
      volume: 0,
      bid: '0.00000',
      ask: '0.00000',
      spread: '0.0',
      dailyRange: '0.00000',
      weeklyChange: '0.00%',
      monthlyChange: '0.00%',
      volatility: 'Unknown',
      marketHours: 'Unknown',
      relatedPairs: [],
    };
  } catch (error) {
    console.error('Error fetching market detail:', error);
    throw new Error('Failed to fetch market detail');
  }
}

/**
 * Generate an AI-powered market setup for the given symbol and timeframe
 */
export async function generateMarketSetup(symbol: string, timeframe: string, userId: string) {
  // In a real implementation, this would call an AI endpoint
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a random setup
    const direction = Math.random() > 0.5 ? 'long' : 'short';
    const entry = parseFloat((Math.random() * 100).toFixed(4));
    const stopLoss = direction === 'long' 
      ? parseFloat((entry * 0.99).toFixed(4)) 
      : parseFloat((entry * 1.01).toFixed(4));
    const takeProfit = direction === 'long'
      ? parseFloat((entry * 1.03).toFixed(4))
      : parseFloat((entry * 0.97).toFixed(4));
    
    return {
      id: `setup-${Date.now()}`,
      symbol,
      timeframe,
      direction,
      entry,
      stopLoss,
      takeProfit,
      riskReward: parseFloat((Math.abs(takeProfit - entry) / Math.abs(stopLoss - entry)).toFixed(2)),
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      analysis: `The ${symbol} pair shows a potential ${direction} opportunity on the ${timeframe} timeframe. 
        There's a clear ${direction === 'long' ? 'support' : 'resistance'} level forming at ${
        direction === 'long' ? stopLoss : takeProfit
      }, with price likely to move towards ${
        direction === 'long' ? takeProfit : stopLoss
      } based on recent price action and market sentiment.
        
      Key levels to watch:
      - Entry: ${entry}
      - Stop Loss: ${stopLoss}
      - Take Profit: ${takeProfit}
        
      This setup has a risk-to-reward ratio of ${parseFloat(
        (Math.abs(takeProfit - entry) / Math.abs(stopLoss - entry)).toFixed(2)
      )}, making it a favorable trade opportunity.`,
      created_at: new Date().toISOString(),
      indicators: {
        rsi: Math.floor(Math.random() * 100),
        macd: {
          signal: Math.random() - 0.5,
          histogram: Math.random() - 0.5,
          main: Math.random() - 0.5,
        },
        ema: {
          short: entry + Math.random(),
          long: entry - Math.random(),
        },
      },
    };
  } catch (error) {
    console.error('Error generating market setup:', error);
    throw new Error('Failed to generate market setup');
  }
} 