import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/db/supabase-client';
import TradingViewChart from '@/components/charts/TradingViewChart';
import { LucideRefreshCw, LucideArrowUpRight, LucideArrowDownRight, LucideShare2, LucideSave, LucideBrain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock types and functions
interface MarketSetup {
  id: string;
  userId: string;
  symbol: string;
  timeframe: string;
  entry: number;
  sl: number;
  tp: number;
  tradeType: 'LONG' | 'SHORT';
  confidenceScore: number;
  patternDescription?: string;
  reasoningDetails?: string;
  matchingStrategies?: string[];
  indicatorData?: Record<string, any>;
  riskRewardRatio?: number;
  aiGenerated: boolean;
  strategyId?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fetchMarketData = async (symbol: string, timeframe: string) => {
  // Mock implementation
  return [];
};

interface MarketSetupSuggestionProps {
  symbol: string;
  timeframe: string;
  onSaveSetup?: (setup: MarketSetup) => void;
}

export function MarketSetupSuggestion({ symbol, timeframe, onSaveSetup }: MarketSetupSuggestionProps) {
  const [setup, setSetup] = useState<MarketSetup | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("setup");
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
      const response = await fetch('/api/analyze-market-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          symbol,
          timeframe,
          user_id: user.id,
          scan_mode: "deep", // Request comprehensive analysis
          include_strategies: true // Match against best strategies
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
        reasoningDetails: setupData.reasoning_details,
        matchingStrategies: setupData.matching_strategies || [],
        indicatorData: setupData.indicator_data || {},
        riskRewardRatio: setupData.risk_reward_ratio,
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

  const handleSaveSetup = async () => {
    if (!setup) return;
    
    try {
      // Save the setup to user's favorites or personal collection
      const { error } = await supabase
        .from('market_setups')
        .update({ is_public: true } as any)
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48"/>
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-32"/>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full"/>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-3/4"/>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full"/>
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error Loading Setup</CardTitle>
          <CardDescription>There was a problem generating the market setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            {error}
          </div>
          <Button variant="outline"
            className="mt-4"
            onClick={handleRefresh}>
            <LucideRefreshCw className="mr-2 h-4 w-4"/>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Chart overlays for entry, SL, TP
  const chartOverlays = setup ? [
    {
      type: 'price' as const,
      price: setup.entry,
      color: '#3b82f6',
      lineStyle: 'solid' as const,
      lineWidth: 2,
      label: 'Entry'
    },
    {
      type: 'price' as const,
      price: setup.sl,
      color: '#ef4444',
      lineStyle: 'dashed' as const,
      lineWidth: 1,
      label: 'SL'
    },
    {
      type: 'price' as const,
      price: setup.tp,
      color: '#22c55e',
      lineStyle: 'dashed' as const,
      lineWidth: 1,
      label: 'TP'
    }
  ] : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-2xl">
              {setup?.symbol || symbol}
              <Badge variant={setup?.tradeType === 'LONG' ? 'default' : 'destructive'}
                className="ml-2">
                {setup?.tradeType === 'LONG' ? (
                  <span className="flex items-center">
                    <LucideArrowUpRight className="mr-1 h-3 w-3"/> LONG
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LucideArrowDownRight className="mr-1 h-3 w-3"/> SHORT
                  </span>
                )}
              </Badge>
            </CardTitle>
            <CardDescription>{timeframe} Timeframe</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">
              <div className="text-muted-foreground">Confidence</div>
              <div className="flex items-center">
                <progress 
                  value={setup?.confidenceScore} 
                  max="100" 
                  className={`h-2 w-20 mr-2 ${
                    setup?.confidenceScore && setup?.confidenceScore >= 70 
                      ? 'bg-green-500/50' 
                      : setup?.confidenceScore && setup?.confidenceScore >= 40 
                        ? 'bg-amber-500/50' 
                        : 'bg-red-500/50'
                  }`}
                />
                <span className={`text-xs font-semibold ${
                  setup?.confidenceScore && setup?.confidenceScore >= 70 
                    ? 'text-green-500' 
                    : setup?.confidenceScore && setup?.confidenceScore >= 40 
                      ? 'text-amber-500' 
                      : 'text-red-500'
                }`}>{setup?.confidenceScore}%</span>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={handleRefresh}>
              <LucideRefreshCw className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup Details</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="strategies">Matching Strategies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <div className="h-[300px] mb-4">
              {chartData.length > 0 && (
                <TradingViewChart 
                  data={chartData} 
                  overlays={chartOverlays}
               />
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Entry</div>
                <div className="font-semibold">{setup?.entry.toFixed(5)}</div>
              </div>
              <div className="bg-red-500/10 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Stop Loss</div>
                <div className="font-semibold">{setup?.sl.toFixed(5)}</div>
              </div>
              <div className="bg-green-500/10 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Take Profit</div>
                <div className="font-semibold">{setup?.tp.toFixed(5)}</div>
              </div>
            </div>
            
            <div className="flex justify-between mb-4 bg-muted/30 p-3 rounded-md">
              <div>
                <div className="text-xs text-muted-foreground">Risk/Reward</div>
                <div className="font-semibold">{setup?.riskRewardRatio ? `1:${setup.riskRewardRatio.toFixed(1)}` : 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Pattern</div>
                <div className="font-semibold">{setup?.patternDescription || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Timeframe</div>
                <div className="font-semibold">{setup?.timeframe || timeframe}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="bg-muted/30 p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <LucideBrain className="text-primary mr-2 h-5 w-5" />
                <h3 className="font-medium text-md">AI Analysis</h3>
              </div>
              <div className="text-sm mb-3">
                {setup?.reasoningDetails || 'No analysis available'}
              </div>
              
              {setup?.indicatorData && Object.keys(setup.indicatorData).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Key Indicators</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {Object.entries(setup.indicatorData).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-background/50 rounded">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Probability of Success</div>
                <div className="flex items-center">
                  <progress 
                    value={setup?.confidenceScore} 
                    max="100" 
                    className="h-2 w-full mb-1" 
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>Low</span>
                  <span>{setup?.confidenceScore}%</span>
                  <span>High</span>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Best For</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {setup?.tradeType === 'LONG' ? (
                    <>
                      <Badge variant="outline" className="text-xs">Bullish Markets</Badge>
                      <Badge variant="outline" className="text-xs">Swing Trading</Badge>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" className="text-xs">Bearish Markets</Badge>
                      <Badge variant="outline" className="text-xs">Momentum Trading</Badge>
                    </>
                  )}
                  <Badge variant="outline" className="text-xs">{setup?.timeframe || timeframe} Chart</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies">
            <div className="space-y-4">
              {setup?.matchingStrategies && setup.matchingStrategies.length > 0 ? (
                setup.matchingStrategies.map((strategy, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-md">
                    <div className="font-medium mb-1">Strategy {index + 1}</div>
                    <div className="text-sm">{strategy}</div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">No matching strategies found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleRefresh}>
          <LucideRefreshCw className="mr-2 h-4 w-4"/>
          Refresh Analysis
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSaveSetup}>
            <LucideShare2 className="mr-2 h-4 w-4"/>
            Share Setup
          </Button>
          <Button onClick={handleSaveSetup}>
            <LucideSave className="mr-2 h-4 w-4"/>
            Save Setup
          </Button>
        </div>
      </CardFooter>
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
