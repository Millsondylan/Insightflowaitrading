import { useState } from 'react';
import { supabase } from '@/lib/db/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Loader2, Scan, Save, Check, Edit, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { UserStrategy, StrategySetup } from '@/lib/db/types';
import TradingViewChart from '../charts/TradingViewChart';

interface SetupFromStrategyProps {
  onStrategyCreated?: (strategy: UserStrategy) => void;
}

export function SetupFromStrategy({ onStrategyCreated }: SetupFromStrategyProps) {
  const [title, setTitle] = useState<string>('');
  const [strategyText, setStrategyText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [strategy, setStrategy] = useState<UserStrategy | null />(null);
  const [matchingSetups, setMatchingSetups] = useState<StrategySetup[]>([]);
  const [marketsToScan, setMarketsToScan] = useState<string[]>([]);
  const { toast } = useToast();

  // Popular markets that can be toggled for scanning
  const availableMarkets = [
    { symbol: 'BTC/USDT', type: 'crypto' },
    { symbol: 'ETH/USDT', type: 'crypto' },
    { symbol: 'XRP/USDT', type: 'crypto' },
    { symbol: 'EUR/USD', type: 'forex' },
    { symbol: 'GBP/USD', type: 'forex' },
    { symbol: 'USD/JPY', type: 'forex' },
    { symbol: 'AAPL', type: 'stock' },
    { symbol: 'MSFT', type: 'stock' },
    { symbol: 'GOOGL', type: 'stock' },
    { symbol: 'GOLD', type: 'commodity' },
    { symbol: 'SILVER', type: 'commodity' },
    { symbol: 'OIL', type: 'commodity' },
  ];
  
  const handleMarketToggle = (market: string) => {
    if (marketsToScan.includes(market)) {
      setMarketsToScan(marketsToScan.filter(m => m !== market));
    } else {
      setMarketsToScan([...marketsToScan, market]);
    }
  };

  const handleSaveStrategy = async () => {
    try {
      if (!title.trim() || !strategyText.trim()) {
        toast({
          title: 'Missing information',
          description: 'Please provide both a title and strategy description',
          variant: 'destructive'
        });
        return;
      }
      
      setIsSaving(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save the strategy to database
      const { data, error } = await supabase
        .from('user_strategies')
        .insert([{
          user_id: user.id,
          title,
          description: title, // Using title as short description
          strategy_text: strategyText,
          is_public: false
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Convert the data to our typed format
      const newStrategy: UserStrategy = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        strategyText: data.strategy_text,
        aiParsed: data.ai_parsed,
        isPublic: data.is_public,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setStrategy(newStrategy);
      
      toast({
        title: 'Strategy saved',
        description: 'Your trading strategy has been saved successfully'
      });

      if (onStrategyCreated) {
        onStrategyCreated(newStrategy);
      }
      
    } catch (err: any) {
      console.error('Error saving strategy:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to save strategy',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanMarkets = async () => {
    try {
      if (!strategy && !strategyText) {
        toast({
          title: 'No strategy defined',
          description: 'Please save your strategy before scanning markets',
          variant: 'destructive'
        });
        return;
      }
      
      setIsScanning(true);

      // If strategy isn't saved yet, save it first
      let strategyId = strategy?.id;
      
      if (!strategyId) {
        await handleSaveStrategy();
        // Get the newly created strategy ID
        strategyId = strategy?.id;
        
        if (!strategyId) {
          throw new Error('Failed to create strategy');
        }
      }

      // Call the AI strategy scanner function
      const response = await fetch('/.netlify/functions/ai-scan-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          strategy_id: strategyId,
          markets: marketsToScan.length > 0 ? marketsToScan : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan markets');
      }

      const data = await response.json();
      
      // Transform the matching setups data
      const setups = data.matching_setups.map((setup: any) => ({
        id: setup.id || '',
        strategyId: setup.strategy_id,
        symbol: setup.symbol,
        entry: setup.entry,
        sl: setup.sl,
        tp: setup.tp,
        confidence: setup.confidence,
        timeframe: setup.timeframe,
        reasons: setup.reasons || [],
        createdAt: new Date()
      }));
      
      setMatchingSetups(setups);
      
      if (setups.length === 0) {
        toast({
          title: 'No matching setups found',
          description: 'Your strategy doesn\'t match any current market conditions. Try adjusting your rules or scanning more markets.'
        });
      } else {
        toast({
          title: 'Scan complete',
          description: `Found ${setups.length} matching setup(s) across ${data.total_markets_scanned} markets`
        });
      }
      
    } catch (err: any) {
      console.error('Error scanning markets:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to scan markets',
        variant: 'destructive'
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Generate dummy chart data for a setup
  const generateChartData = (symbol: string, entryPrice: number) => {
    const data = [];
    let time = new Date();
    time.setHours(time.getHours() - 100);
    
    // Use the entry price as the base
    let basePrice = entryPrice * 0.95 + (Math.random() * entryPrice * 0.1);
    
    for (let i = 0; i < 100; i++) {
      const volatility = 0.015;
      const changePercent = (Math.random() - 0.5) * volatility;
      basePrice *= (1 + changePercent);
      
      const open = basePrice;
      const close = basePrice * (1 + (Math.random() - 0.5) * 0.005);
      const high = Math.max(open, close) * (1 + Math.random() * 0.003);
      const low = Math.min(open, close) * (1 - Math.random() * 0.003);
      
      time = new Date(time.getTime() + 15 * 60000); // 15 minute intervals
      
      data.push({
        time: time.getTime() / 1000,
        open,
        high,
        low,
        close
      });
    }
    
    return data;
  };

  return (
    <Div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Setup Finder</UserStrategy>
          <CardDescription>Define your trading strategy and scan markets for current setups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" />
          <Div>
            <Label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Strategy Name
            </CardContent>
            <Input id="title"
              className="mt-1"
              placeholder="My Breakout Strategy" 
              value={title} 
              onChange={e = /> setTitle(e.target.value)}
              disabled={!!strategy || isSaving}
            />
          </Input>
          <Div>
            <Label htmlFor="strategyText" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Define Your Strategy Rules
            </Div>
            <Textarea id="strategyText"
              className="mt-1 min-h-32"
              placeholder="Example: When RSI(14) is below 30 and there's a bullish engulfing candle on the 1H timeframe, go long with a stop loss at the recent low and take profit at 2x the stop distance."
              value={strategyText}
              onChange={e = /> setStrategyText(e.target.value)}
              disabled={!!strategy || isSaving}
            />
          </Textarea>
          
          <Div>
            <H3 className="text-sm font-medium mb-2">Markets to Scan</Div>
            <Div className="flex flex-wrap gap-2 mb-4">
              <Tabs defaultValue="all" />
                <TabsList>
                  <TabsTrigger value="all" />All</Div>
                  <TabsTrigger value="crypto" />Crypto</TabsTrigger>
                  <TabsTrigger value="forex" />Forex</TabsTrigger>
                  <TabsTrigger value="stocks" />Stocks</TabsTrigger>
                  <TabsTrigger value="commodities" />Commodities</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-2" />
                  <Div className="flex flex-wrap gap-2">
                    {availableMarkets.map((market) => (
                      <Badge key={market.symbol}
                        variant={marketsToScan.includes(market.symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() = /> handleMarketToggle(market.symbol)}
                      >
                        {marketsToScan.includes(market.symbol) ? <Check className="mr-1 h-3 w-3" /> : null}
                        {market.symbol}
                      </TabsContent>
                    ))}
                  </Div>
                </TabsContent>
                <TabsContent value="crypto" className="mt-2" />
                  <Div className="flex flex-wrap gap-2">
                    {availableMarkets.filter(m => m.type === 'crypto').map((market) => (
                      <Badge key={market.symbol}
                        variant={marketsToScan.includes(market.symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() = /> handleMarketToggle(market.symbol)}
                      >
                        {marketsToScan.includes(market.symbol) ? <Check className="mr-1 h-3 w-3" /> : null}
                        {market.symbol}
                      </TabsContent>
                    ))}
                  </Div>
                </TabsContent>
                <TabsContent value="forex" className="mt-2" />
                  <Div className="flex flex-wrap gap-2">
                    {availableMarkets.filter(m => m.type === 'forex').map((market) => (
                      <Badge key={market.symbol}
                        variant={marketsToScan.includes(market.symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() = /> handleMarketToggle(market.symbol)}
                      >
                        {marketsToScan.includes(market.symbol) ? <Check className="mr-1 h-3 w-3" /> : null}
                        {market.symbol}
                      </TabsContent>
                    ))}
                  </Div>
                </TabsContent>
                {/* Similar TabsContent for other market types */}
              </Tabs>
            </Div>
          </Div>
        </CardContent>
        <CardFooter className="flex justify-between" />
          <Button variant="outline" 
            onClick={handleSaveStrategy}
            disabled={isSaving || isScanning || (!title && !strategyText) || !!strategy}
        >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Strategy
          </CardFooter>
          <Button onClick={handleScanMarkets}
            disabled={isScanning || (!strategy && !strategyText)}
        >
            {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scan className="mr-2 h-4 w-4" />}
            Scan Markets
          </Button>
        </CardFooter>
      </Card>

      {isScanning ? (
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden" />
              <CardHeader className="pb-2" />
                <Skeleton className="h-6 w-32" />
              </Div>
              <Skeleton className="h-[200px] w-full" />
              <CardContent className="pt-4" />
                <Div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </Skeleton>
              </CardContent>
            </Card>
          ))}
        </Div>
      ) : matchingSetups.length > 0 ? (
        <Div>
          <H2 className="text-2xl font-bold mb-4">Matching Setups ({matchingSetups.length})</Div>
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingSetups.map((setup) => {
              const chartData = generateChartData(setup.symbol, setup.entry);
              
              // Determine if it's a long or short setup
              const isLong = setup.tp > setup.entry;
              
              // Setup overlays for the chart
              const overlays = [
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
              ];
              
              return (
                <Card key={`${setup.symbol}-${setup.timeframe}`} className="overflow-hidden" />
                  <CardHeader className="pb-2" />
                    <Div className="flex justify-between items-center">
                      <CardTitle className="flex items-center" />
                        {setup.symbol}
                        <Badge variant={isLong ? 'default' : 'destructive'}
                          className="ml-2"
                      >
                          {isLong ? (
                            <Span className="flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" /> LONG</Div>
                          ) : (
                            <Span className="flex items-center"><ArrowDownRight className="mr-1 h-3 w-3" /> SHORT</Span>
                          )}
                        </Badge>
                      </CardTitle>
                      <Badge variant="outline" />{setup.timeframe}</Badge>
                    </Div>
                    <CardDescription className="flex items-center" />
                      Confidence: <Span className="text-amber-500 ml-1">{setup.confidence}%</CardDescription>
                    </CardDescription>
                  </CardHeader>
                  <Div className="h-[200px]">
                    <TradingViewChart
                      data={chartData}
                      overlays={overlays}
                      height={200}
                    />
                  </Div>
                  <CardContent className="pt-4" />
                    <Div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <Div>
                        <Div className="text-muted-foreground">Entry</CardContent>
                        <Div className="font-semibold">{setup.entry.toFixed(5)}</Div>
                      </Div>
                      <Div>
                        <Div className="text-muted-foreground">Stop Loss</Div>
                        <Div className="font-semibold text-red-500">{setup.sl.toFixed(5)}</Div>
                      </Div>
                      <Div>
                        <Div className="text-muted-foreground">Take Profit</Div>
                        <Div className="font-semibold text-green-500">{setup.tp.toFixed(5)}</Div>
                      </Div>
                    </Div>
                    {setup.reasons && setup.reasons.length > 0 && (
                      <Div className="text-xs text-muted-foreground">
                        <Div className="font-medium text-foreground">Reasons:</Div>
                        <Ul className="list-disc pl-4 mt-1 space-y-1">
                          {setup.reasons.slice(0, 2).map((reason, i) => (
                            <Li key={i}>{reason}</Ul>
                          ))}
                          {setup.reasons.length > 2 && (
                            <Li>+ {setup.reasons.length - 2} more</Li>
                          )}
                        </Ul>
                      </Div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0" />
                    <Button variant="outline" size="sm" className="w-full" />
                      <Edit className="mr-2 h-3 w-3" /></CardFooter>
                      Create Trade
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </Div>
        </Div>
      ) : null}
    </Div>
  );
}

export default SetupFromStrategy;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

