import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star,
  Bell,
  Eye,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Target,
  ChevronRight,
  DollarSign,
  Filter,
  RefreshCw
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  category: 'crypto' | 'forex' | 'stocks' | 'commodities';
  isWatched: boolean;
}

interface AITradeSetup {
  symbol: string;
  action: 'buy' | 'sell' | 'watch';
  confidence: number;
  reason: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  timeframe: string;
  setup_type: string;
  risk_reward: number;
}

interface UserPreferences {
  favorite_markets: string[];
  favorite_timeframes: string[];
  experience: 'beginner' | 'intermediate' | 'expert';
}

const MarketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [aiSetups, setAiSetups] = useState<AITradeSetup[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load user preferences and market data
  useEffect(() => {
    const loadMarketsData = async () => {
      if (!user) return;

      try {
        // Load user preferences
        const { data: preferences, error: prefError } = await (supabase as any)
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!prefError && preferences) {
          setUserPreferences(preferences);
          setWatchlist(preferences.favorite_markets || []);
        }

        // Generate mock market data (in real app, this would come from APIs)
        const mockMarkets: MarketData[] = [
          // Crypto
          { symbol: 'BTC/USD', name: 'Bitcoin', price: 43250.50, change: 1240.30, changePercent: 2.95, volume: 28500000, category: 'crypto', isWatched: false },
          { symbol: 'ETH/USD', name: 'Ethereum', price: 2680.75, change: -45.20, changePercent: -1.66, volume: 15200000, category: 'crypto', isWatched: false },
          { symbol: 'SOL/USD', name: 'Solana', price: 98.45, change: 3.22, changePercent: 3.38, volume: 850000, category: 'crypto', isWatched: false },
          
          // Forex
          { symbol: 'EUR/USD', name: 'Euro Dollar', price: 1.0875, change: 0.0012, changePercent: 0.11, volume: 245000000, category: 'forex', isWatched: false },
          { symbol: 'GBP/USD', name: 'British Pound', price: 1.2650, change: -0.0035, changePercent: -0.28, volume: 185000000, category: 'forex', isWatched: false },
          { symbol: 'USD/JPY', name: 'US Dollar Yen', price: 151.25, change: 0.45, changePercent: 0.30, volume: 165000000, category: 'forex', isWatched: false },
          
          // Stocks
          { symbol: 'AAPL', name: 'Apple Inc.', price: 192.75, change: 2.40, changePercent: 1.26, volume: 45000000, marketCap: 3020000000000, category: 'stocks', isWatched: false },
          { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.30, change: -5.60, changePercent: -2.21, volume: 85000000, marketCap: 790000000000, category: 'stocks', isWatched: false },
          { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 485.20, change: 12.80, changePercent: 2.71, volume: 65000000, marketCap: 1200000000000, category: 'stocks', isWatched: false },
          
          // Commodities
          { symbol: 'GOLD', name: 'Gold Spot', price: 2035.40, change: 8.30, changePercent: 0.41, volume: 125000, category: 'commodities', isWatched: false },
          { symbol: 'SILVER', name: 'Silver Spot', price: 24.85, change: -0.15, changePercent: -0.60, volume: 85000, category: 'commodities', isWatched: false },
          { symbol: 'OIL', name: 'Crude Oil WTI', price: 72.45, change: 1.25, changePercent: 1.76, volume: 185000, category: 'commodities', isWatched: false }
        ];

        // Mark user's favorite markets as watched
        const marketsWithWatchlist = mockMarkets.map(market => ({
          ...market,
          isWatched: (preferences?.favorite_markets || []).includes(market.symbol)
        }));

        setMarketData(marketsWithWatchlist);

        // Generate AI trade setups based on user preferences
        const generateAISetups = () => {
          const userMarkets = preferences?.favorite_markets || ['BTC/USD', 'EUR/USD', 'AAPL'];
          const setupTypes = ['Breakout', 'Pullback', 'Reversal', 'Momentum', 'Support/Resistance'];
          
          return userMarkets.slice(0, 4).map((symbol, index) => {
            const market = marketsWithWatchlist.find(m => m.symbol === symbol);
            const setupType = setupTypes[index % setupTypes.length];
            const isUpTrend = Math.random() > 0.4;
            const confidenceLevel = 70 + Math.floor(Math.random() * 25);
            
            return {
              symbol,
              action: isUpTrend ? 'buy' : 'sell' as 'buy' | 'sell',
              confidence: confidenceLevel,
              reason: `${setupType} pattern detected with strong ${isUpTrend ? 'bullish' : 'bearish'} momentum. RSI showing ${isUpTrend ? 'oversold' : 'overbought'} conditions.`,
              entry_price: market ? market.price * (isUpTrend ? 0.998 : 1.002) : 0,
              target_price: market ? market.price * (isUpTrend ? 1.02 : 0.98) : 0,
              stop_loss: market ? market.price * (isUpTrend ? 0.99 : 1.01) : 0,
              timeframe: ['15m', '1h', '4h', '1d'][Math.floor(Math.random() * 4)],
              setup_type: setupType,
              risk_reward: parseFloat((1.5 + Math.random() * 2).toFixed(1))
            };
          });
        };

        setAiSetups(generateAISetups());
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading markets data:', error);
        setIsLoading(false);
      }
    };

    loadMarketsData();
  }, [user]);

  // Filter markets based on search and category
  const filteredMarkets = useMemo(() => {
    return marketData.filter(market => {
      const matchesSearch = market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           market.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || market.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [marketData, searchQuery, selectedCategory]);

  // Handle watchlist toggle
  const toggleWatchlist = async (symbol: string) => {
    try {
      const newWatchlist = watchlist.includes(symbol)
        ? watchlist.filter(s => s !== symbol)
        : [...watchlist, symbol];
      
      setWatchlist(newWatchlist);
      
      // Update market data
      setMarketData(prev => prev.map(market => 
        market.symbol === symbol 
          ? { ...market, isWatched: !market.isWatched }
          : market
      ));

      // Update user preferences
      const { error } = await (supabase as any)
        .from('user_preferences')
        .update({ favorite_markets: newWatchlist })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: watchlist.includes(symbol) ? "Removed from watchlist" : "Added to watchlist",
        description: `${symbol} has been ${watchlist.includes(symbol) ? 'removed from' : 'added to'} your watchlist.`,
      });
    } catch (error) {
      console.error('Error updating watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle market click
  const handleMarketClick = (symbol: string) => {
    navigate(`/markets/${symbol}`);
  };

  // Refresh market data
  const refreshMarkets = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    
    toast({
      title: "Markets Updated",
      description: "Latest market data has been loaded.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead 
        title="Markets - InsightFlow AI" 
        description="Explore live markets with AI-powered trade setups and insights"
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Markets</h1>
            <p className="text-gray-400">Live prices with AI-powered insights</p>
          </div>
          <Button 
            onClick={refreshMarkets}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="text-gray-300 border-gray-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'crypto', 'forex', 'stocks', 'commodities'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`capitalize ${
                  selectedCategory === category 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">
        {/* Market List - Left Side */}
        <div className="lg:col-span-3">
          <Card className="bg-black/20 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Live Markets
                <Badge variant="secondary" className="ml-auto">
                  {filteredMarkets.length} symbols
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                  <div>Symbol</div>
                  <div>Price</div>
                  <div>Change</div>
                  <div>Volume</div>
                  <div>Category</div>
                  <div>Actions</div>
                </div>
                
                {/* Market Rows */}
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredMarkets.map((market) => (
                    <div 
                      key={market.symbol}
                      className="grid grid-cols-6 gap-4 p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => handleMarketClick(market.symbol)}
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-white group-hover:text-blue-300 transition-colors">
                            {market.symbol}
                          </p>
                          <p className="text-xs text-gray-400">{market.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-mono text-white">
                          {market.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {market.change >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <div className={`${market.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className="font-mono text-sm">
                            {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}
                          </div>
                          <div className="text-xs">
                            ({market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-300 font-mono">
                          {(market.volume / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {market.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(market.symbol);
                          }}
                          className={`h-6 w-6 p-0 ${market.isWatched ? 'text-yellow-400' : 'text-gray-400'}`}
                        >
                          <Star className={`w-4 h-4 ${market.isWatched ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/markets/${market.symbol}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Setups Sidebar - Right Side */}
        <div className="space-y-6">
          {/* AI Trade Setups */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Trade Setups
                <Badge variant="secondary" className="ml-auto bg-purple-500/20 text-purple-300">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSetups.map((setup, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                        {setup.symbol}
                      </Badge>
                      <Badge className={`text-xs ${
                        setup.action === 'buy' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {setup.action.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Confidence</p>
                      <p className="text-sm font-bold text-purple-400">{setup.confidence}%</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-300 mb-3">{setup.reason}</p>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-gray-400">Entry</p>
                      <p className="text-white font-medium">{setup.entry_price.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Target</p>
                      <p className="text-green-300 font-medium">{setup.target_price.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Stop</p>
                      <p className="text-red-300 font-medium">{setup.stop_loss.toFixed(4)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{setup.timeframe} • {setup.setup_type}</span>
                    <span>R:R {setup.risk_reward}:1</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-purple-500 hover:bg-purple-600 text-xs"
                    onClick={() => navigate(`/markets/${setup.symbol}`)}
                  >
                    View Setup <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                onClick={() => navigate('/strategy-builder')}
              >
                Create Custom Setup
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-black/20 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Gainers</span>
                <span className="text-green-400 font-medium">
                  {filteredMarkets.filter(m => m.change > 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Losers</span>
                <span className="text-red-400 font-medium">
                  {filteredMarkets.filter(m => m.change < 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Watchlist</span>
                <span className="text-blue-400 font-medium">{watchlist.length}</span>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300"
                  onClick={() => navigate('/alerts')}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Manage Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketsPage; 