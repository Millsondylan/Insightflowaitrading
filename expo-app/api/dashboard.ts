import { supabase } from '@/lib/supabase';

/**
 * Fetch dashboard data for the user
 */
export async function fetchDashboardData(userId: string) {
  // Example mock data for development
  const mockData = {
    pnlSummary: {
      totalPnL: 2540.75,
      dailyPnL: 178.25,
      winRate: 65.3,
      totalTrades: 42,
      profitFactor: 1.82,
    },
    latestSetup: {
      id: '1',
      symbol: 'EURUSD',
      direction: 'long',
      entry: 1.08750,
      stopLoss: 1.08500,
      takeProfit: 1.09250,
      timeframe: 'H4',
      confidence: 82,
      created_at: new Date().toISOString(),
      description: 'Bullish breakout from key resistance level with strong momentum.',
    },
    watchlist: [
      { symbol: 'EURUSD', name: 'Euro / US Dollar', price: '1.08742', priceChange: 0.21, isFavorite: true },
      { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: '1.27153', priceChange: -0.15, isFavorite: true },
      { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', price: '38742.50', priceChange: 2.74, isFavorite: true },
    ],
    alerts: [
      { id: '1', title: 'EURUSD Price Alert', message: 'EURUSD reached 1.0870', timestamp: new Date().toISOString(), read: false },
      { id: '2', title: 'Strategy Signal', message: 'London Breakout strategy triggered a buy signal for GBPUSD', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
    ],
    strategies: [
      { id: '1', name: 'London Breakout', winRate: 68.5, pnl: 12.4, totalTrades: 24 },
      { id: '2', name: 'Support/Resistance Bounce', winRate: 61.2, pnl: 8.7, totalTrades: 18 },
    ],
    nextLesson: {
      id: '1',
      title: 'Advanced Price Action Patterns',
      description: 'Learn to identify and trade complex price action patterns',
      duration: 45,
      progress: 0,
    },
  };

  // In a real implementation, you would fetch this data from Supabase
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
} 