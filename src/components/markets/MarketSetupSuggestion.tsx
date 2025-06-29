import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/supabase-client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideArrowUpRight, LucideArrowDownRight, LucideRefreshCw, LucideSave, LucideShare2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { MarketSetup } from '@/lib/db/types';
import TradingViewChart from '../charts/TradingViewChart';

interface MarketSetupSuggestionProps {
  symbol: string;
  timeframe: string;
  onSaveSetup?: (setup: MarketSetup) => void;
}

export function MarketSetupSuggestion({ symbol, timeframe, onSaveSetup }: MarketSetupSuggestionProps) {
  const [setup, setSetup] = useState<MarketSetup | null />(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (symbol && timeframe) {
      fetchMarketSetup();
    }
  }, [symbol, timeframe]);

  const fetchMarketSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch market data for chart
      const marketData = await fetchMarketData(symbol, timeframe);
      setChartData(marketData);

      // Call AI setup generator function
      const response = await fetch('/.netlify/functions/ai-generate-market-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          symbol,
          timeframe,
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate setup');
      }

      const data = await response.json();
      
      // Format setup data
      const setupData = data.result;
      setSetup({
        id: setupData.id,
        userId: setupData.user_id,
        symbol: setupData.symbol,
        timeframe: setupData.timeframe,
        entry: parseFloat(setupData.entry),
        sl: parseFloat(setupData.sl),
        tp: parseFloat(setupData.tp),
        tradeType: setupData.trade_type,
        confidenceScore: setupData.confidence_score,
        patternDescription: setupData.pattern_description,
        indicatorData: setupData.indicator_data || {},
        aiGenerated: setupData.ai_generated,
        strategyId: setupData.strategy_id,
        isPublic: setupData.is_public,
        createdAt: new Date(setupData.created_at),
        updatedAt: new Date(setupData.updated_at)
      });
    } catch (err: any) {
      console.error('Error generating market setup:', err);
      setError(err.message || 'Failed to generate market setup');
      toast({
        title: 'Error',
        description: err.message || 'Failed to generate market setup',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketData = async (symbol: string, timeframe: string) => {
    // This would normally fetch from your market data API
    // For demo purposes, we'll generate dummy data
    return generateDummyChartData(100);
  };

  const generateDummyChartData = (count: number) => {
    const data = [];
    let time = new Date();
    time.setHours(time.getHours() - count);
    let price = 100 + Math.random() * 1000;
    
    for (let i = 0; i < count; i++) {
      const volatility = 0.02;
      const changePercent = (Math.random() - 0.5) * volatility;
      price *= (1 + changePercent);
      
      const open = price;
      const close = price * (1 + (Math.random() - 0.5) * 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      const volume = Math.round(1000 + Math.random() * 10000);
      
      // Adjust time based on timeframe
      time = new Date(time.getTime() + getTimeframeMinutes(timeframe) * 60000);
      
      data.push({
        time: time.getTime() / 1000,
        open,
        high,
        low,
        close,
        volume
      });
    }
    
    return data;
  };

  const getTimeframeMinutes = (timeframe: string) => {
    switch (timeframe) {
      case '1m': return 1;
      case '5m': return 5;
      case '15m': return 15;
      case '30m': return 30;
      case '1h': return 60;
      case '4h': return 240;
      case 'D1': return 1440;
      case 'W1': return 10080;
      default: return 60;
    }
  };

  const handleSaveSetup = async () => {
    if (!setup) return;
    
    try {
      // Save the setup to user's favorites or personal collection
      const { error } = await supabase
        .from('market_setups')
        .update({ is_public: true })
        .eq('id', setup.id);
        
      if (error) throw error;
      
      toast({
        title: 'Setup saved',
        description: 'The setup has been saved and shared publicly',
      });
      
      if (onSaveSetup) {
        onSaveSetup(setup);
      }
    } catch (err: any) {
      console.error('Error saving setup:', err);
      toast({
        title: 'Error',
        description: 'Failed to save setup',
        variant: 'destructive'
      });
    }
  };

  const handleRefresh = () => {
    fetchMarketSetup();
  };

  if (isLoading) {
    return (
      <Card className="w-full" />
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48" / />
          <CardDescription>
            <Skeleton className="h-4 w-32" / />
        </MarketSetup>
        <CardContent>
          <Div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <Div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" / />
          </div />
        <CardFooter>
          <Skeleton className="h-10 w-full" / />
      </CardContent>
    );
  }

  if (error) {
    return (
      <Card className="w-full" />
        <CardHeader>
          <CardTitle>Error Loading Setup</Card>
          <CardDescription>There was a problem generating the market setup</CardDescription />
        <CardContent>
          <Div className="bg-destructive/10 p-4 rounded-md text-destructive">
            {error}
          </CardDescription>
          <Button variant="outline"
            className="mt-4"
            onClick={handleRefresh} />
            <LucideRefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button />
      </Button>
    );
  }

  // Chart overlays for entry, SL, TP
  const chartOverlays = setup ? [
    {
      type: 'price',
      price: setup.entry,
      color: '#3b82f6',
      lineStyle: 'solid',
      lineWidth: 2,
      label: 'Entry'
    },
    {
      type: 'price',
      price: setup.sl,
      color: '#ef4444',
      lineStyle: 'dashed',
      lineWidth: 1,
      label: 'SL'
    },
    {
      type: 'price',
      price: setup.tp,
      color: '#22c55e',
      lineStyle: 'dashed',
      lineWidth: 1,
      label: 'TP'
    }
  ] : [];

  return (
    <Card className="w-full" />
      <CardHeader>
        <Div className="flex items-center justify-between">
          <Div>
            <CardTitle className="flex items-center text-2xl" />
              {setup?.symbol || symbol}
              <Badge variant={setup?.tradeType === 'LONG' ? 'default' : 'destructive'}
                className="ml-2"
      >
                {setup?.tradeType === 'LONG' ? (
                  <Span className="flex items-center"><LucideArrowUpRight className="mr-1 h-3 w-3" /> LONG</Card>
                ) : (
                  <Span className="flex items-center"><LucideArrowDownRight className="mr-1 h-3 w-3" /> SHORT</Span>
                )}
              </Badge />
            <CardDescription>{timeframe} Timeframe</CardDescription>
          </Div>
          <Div className="flex items-center gap-2">
            <Div className="text-sm">
              <Div className="text-muted-foreground">Confidence</Div>
              <Div className="flex items-center">
                <Progress value={setup?.confidenceScore} className="h-2 w-20 mr-2" />
                <Span className="text-xs font-semibold">{setup?.confidenceScore}%</Div>
              </Div>
            </Div>
            <Button size="icon" variant="ghost" onClick={handleRefresh} />
              <LucideRefreshCw className="h-4 w-4" />
            </Button>
          </Div>
        </div />
      <CardContent>
        <Div className="h-[300px] mb-4">
          {chartData.length > 0 && (
            <TradingViewChart 
              data={chartData} 
              overlays={chartOverlays}
            />
          )}
        </CardContent>
        
        <Div className="grid grid-cols-3 gap-4 mb-4">
          <Div className="bg-muted/50 p-3 rounded-md">
            <Div className="text-xs text-muted-foreground">Entry</Div>
            <Div className="font-semibold">{setup?.entry.toFixed(5)}</Div>
          </Div>
          <Div className="bg-red-500/10 p-3 rounded-md">
            <Div className="text-xs text-muted-foreground">Stop Loss</Div>
            <Div className="font-semibold">{setup?.sl.toFixed(5)}</Div>
          </Div>
          <Div className="bg-green-500/10 p-3 rounded-md">
            <Div className="text-xs text-muted-foreground">Take Profit</Div>
            <Div className="font-semibold">{setup?.tp.toFixed(5)}</Div>
          </Div>
        </Div>
        
        {setup?.patternDescription && (
          <Div className="bg-muted/30 p-3 rounded-md mb-4">
            <Div className="text-sm font-medium mb-1">Pattern</Div>
            <Div className="text-sm">{setup.patternDescription}</Div>
          </Div>
        )}
        
        {setup?.indicatorData && Object.keys(setup.indicatorData).length > 0 && (
          <Div className="bg-muted/30 p-3 rounded-md">
            <Div className="text-sm font-medium mb-1">Indicators</Div>
            <Div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(setup.indicatorData).map(([key, value]) => (
                <Div key={key}>
                  <Span className="text-muted-foreground">{key}:</Div> {value}
                </Div>
              ))}
            </Div>
          </Div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between" />
        <Button variant="outline" onClick={handleRefresh} />
          <LucideRefreshCw className="mr-2 h-4 w-4" />
          Refresh Analysis
        </CardFooter>
        <Div className="space-x-2">
          <Button variant="outline" onClick={handleSaveSetup} />
            <LucideShare2 className="mr-2 h-4 w-4" />
            Share Setup
          </Div>
          <Button onClick={handleSaveSetup} />
            <LucideSave className="mr-2 h-4 w-4" /></Button></Button></Button></Button></Button></Button>
            Save Setup
          </Button>
        </div />
    </Card>
  );
}

export default MarketSetupSuggestion;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

