import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, Sparkles, Plus } from 'lucide-react';
import TradingViewChart from '@/components/charts/TradingViewChart';
import MarketSetupSuggestion from '@/components/markets/MarketSetupSuggestion';
import { useAuth } from '@/hooks/use-auth.tsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

export default function MarketDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (symbol) {
      fetchMarketData();
      checkWatchlistStatus();
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
          newSymbols = existing.symbols.filter(s => s !== symbol);
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

      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chart">Chart</TabsTrigger>
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
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                AI Market Analysis
              </CardTitle>
              <CardDescription>
                Real-time analysis powered by GPT-4 and market data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketSetupSuggestion
                symbol={marketData.symbol}
                timeframe="1H"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setups">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Long Setup</CardTitle>
                <Badge className="w-fit">Bullish</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
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
                <p className="text-sm text-muted-foreground mt-4">
                  Wait for a pullback to the support level before entering. Risk/Reward: 1:2.3
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Short Setup</CardTitle>
                <Badge variant="destructive" className="w-fit">Bearish</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
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
                <p className="text-sm text-muted-foreground mt-4">
                  Look for rejection at resistance level. Risk/Reward: 1:2.1
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 