import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, Sparkles, Plus, Brain, RefreshCw, Timer } from 'lucide-react';
import TradingViewChart from '@/components/charts/TradingViewChart';
import MarketSetupSuggestion from '@/components/markets/MarketSetupSuggestion';
import { useAuth } from '@/hooks/use-auth.tsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
}

// Available timeframes for market analysis
const AVAILABLE_TIMEFRAMES = [
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h', default: true },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
];

export default function MarketDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    AVAILABLE_TIMEFRAMES.find(tf => tf.default)?.value || '1h'
  );
  const [isAnalysisRefreshing, setIsAnalysisRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  useEffect(() => {
    if (symbol) {
      fetchMarketData();
      checkWatchlistStatus();
      // Set last refresh time on initial load
      setLastRefreshTime(new Date());
    }
  }, [symbol, user]);

  const fetchMarketData = async () => {
    try {
      // Mock data for now
      setMarketData({
        symbol: symbol || 'BTCUSD',
        name: 'Bitcoin / US Dollar',
        price: 45234.56,
        change: 1234.56,
        changePercent: 2.8,
        volume: 234567890,
        high: 46789.12,
        low: 44123.45,
        open: 44000.00
      });
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    if (!user || !symbol) return;

    try {
      const { data, error } = await supabase
        .from('user_watchlists')
        .select('symbols')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsInWatchlist(data.symbols?.includes(symbol) || false);
      }
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const toggleWatchlist = async () => {
    if (!user || !symbol) return;

    try {
      const { data: existing } = await supabase
        .from('user_watchlists')
        .select('symbols')
        .eq('user_id', user.id)
        .single();

      let newSymbols: string[] = [];
      
      if (existing && existing.symbols) {
        if (isInWatchlist) {
          newSymbols = existing.symbols.filter((s: string) => s !== symbol);
        } else {
          newSymbols = [...existing.symbols, symbol];
        }
      } else {
        newSymbols = [symbol];
      }

      const { error } = await supabase
        .from('user_watchlists')
        .upsert({
          user_id: user.id,
          symbols: newSymbols,
          name: 'Default'
        });

      if (error) throw error;

      setIsInWatchlist(!isInWatchlist);
      toast({
        title: isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
        description: `${symbol} has been ${isInWatchlist ? 'removed from' : 'added to'} your watchlist`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setAlert = () => {
    navigate(`/alerts/new?symbol=${symbol}`);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleRefreshAnalysis = () => {
    setIsAnalysisRefreshing(true);
    // Simulate a delay for AI analysis refresh
    setTimeout(() => {
      setIsAnalysisRefreshing(false);
      setLastRefreshTime(new Date());
      toast({
        title: "Analysis Refreshed",
        description: "AI market analysis has been updated with latest data"
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading market data...</div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Market not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/markets')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{marketData.symbol}</h1>
            <p className="text-muted-foreground">{marketData.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isInWatchlist ? "secondary" : "outline"}
            onClick={toggleWatchlist}
          >
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Button>
          <Button onClick={setAlert}>
            <Plus className="mr-2 h-4 w-4" />
            Set Alert
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">${marketData.price.toLocaleString()}</p>
              <div className={`flex items-center gap-1 ${marketData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {marketData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{marketData.changePercent.toFixed(2)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h High</p>
              <p className="text-lg font-medium">${marketData.high.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Low</p>
              <p className="text-lg font-medium">${marketData.low.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-lg font-medium">${(marketData.volume / 1000000).toFixed(2)}M</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="setups">Trade Setups</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px]">
                <TradingViewChart
                  symbol={marketData.symbol}
                  interval="D"
                  theme="dark"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Market Analysis
                  </CardTitle>
                  <CardDescription>
                    Deep analysis of current market conditions and potential trade opportunities
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  {lastRefreshTime && (
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Timer className="h-3 w-3 mr-1" />
                      Last updated: {lastRefreshTime.toLocaleTimeString()}
                    </div>
                  )}
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={handleRefreshAnalysis}
                    disabled={isAnalysisRefreshing}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isAnalysisRefreshing ? 'animate-spin' : ''}`} />
                    {isAnalysisRefreshing ? 'Analyzing...' : 'Refresh'}
                  </Button>
                  <div className="flex border rounded-md overflow-hidden">
                    {AVAILABLE_TIMEFRAMES.map((tf) => (
                      <Button
                        key={tf.value}
                        size="sm"
                        variant={selectedTimeframe === tf.value ? "default" : "ghost"}
                        className="rounded-none h-8 px-3"
                        onClick={() => handleTimeframeChange(tf.value)}
                      >
                        {tf.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>AI Scanner Active</AlertTitle>
                <AlertDescription>
                  The AI is analyzing {marketData.symbol} on the {selectedTimeframe} timeframe, looking for the best setups based on top-performing strategies.
                </AlertDescription>
              </Alert>
              
              <MarketSetupSuggestion
                symbol={marketData.symbol}
                timeframe={selectedTimeframe}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setups">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Market Setups
                </CardTitle>
                <CardDescription>
                  Trading setups automatically detected by our AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {AVAILABLE_TIMEFRAMES.map((tf) => (
                    <Button
                      key={tf.value}
                      size="sm"
                      variant={selectedTimeframe === tf.value ? "default" : "outline"}
                      className="rounded-md"
                      onClick={() => handleTimeframeChange(tf.value)}
                    >
                      {tf.label}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-8">
                  {/* Long Setup Card */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Long Setup
                          <Badge className="ml-2">Bullish</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">Market Structure Break with Volume</p>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Confidence Score</div>
                        <div className="flex items-center">
                          <progress value="82" max="100" className="h-2 w-20 mr-2" />
                          <span className="text-xs font-semibold text-green-500">82%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Entry</p>
                        <p className="font-medium">${(marketData.price * 0.98).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Target</p>
                        <p className="font-medium">${(marketData.price * 1.05).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stop Loss</p>
                        <p className="font-medium">${(marketData.price * 0.95).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-background/50 p-3 rounded text-sm">
                      <p className="font-medium mb-1">Why This Setup Works:</p>
                      <p>The price has formed a strong support level after breaking above the key resistance. Momentum indicators are showing bullish divergence while volume confirms the trend. RSI at 58 with room to move higher. Risk/Reward ratio is excellent at 1:3.5.</p>
                    </div>
                  </div>
                  
                  {/* Short Setup Card */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          Short Setup
                          <Badge variant="destructive" className="ml-2">Bearish</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">Double Top Reversal Pattern</p>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Confidence Score</div>
                        <div className="flex items-center">
                          <progress value="65" max="100" className="h-2 w-20 mr-2" />
                          <span className="text-xs font-semibold text-amber-500">65%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Entry</p>
                        <p className="font-medium">${(marketData.price * 1.02).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Target</p>
                        <p className="font-medium">${(marketData.price * 0.95).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stop Loss</p>
                        <p className="font-medium">${(marketData.price * 1.05).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-background/50 p-3 rounded text-sm">
                      <p className="font-medium mb-1">Why This Setup Works:</p>
                      <p>Double top formation suggests a strong price rejection at resistance. MACD showing bearish crossover with decreasing buying volume. The neckline break confirms the pattern. Risk/Reward ratio of 1:2.3 makes this a decent opportunity if rejection holds.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 