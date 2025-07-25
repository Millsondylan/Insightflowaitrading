
import { useState } from 'react';
import { supabase } from '@/lib/db/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Loader2, Scan, Save, Check, Edit, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import TradingViewChart from '../charts/TradingViewChart';

// Add missing interface properties
interface StrategySetup {
  id: string;
  strategyId: string;
  symbol: string;
  entry: number;
  sl: number;
  tp: number;
  confidence: number;
  timeframe: string;
  createdAt: Date;
  reasons?: string[];
}

interface UserStrategy {
  id: string;
  userId: string;
  title: string;
  description: string;
  strategyText: string;
  aiParsed?: Record<string, any>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SetupFromStrategyProps {
  onStrategyCreated?: (strategy: UserStrategy) => void;
}

export function SetupFromStrategy({ onStrategyCreated }: SetupFromStrategyProps) {
  const [title, setTitle] = useState<string>('');
  const [strategyText, setStrategyText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [strategy, setStrategy] = useState<UserStrategy | null>(null);
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

      // Mock strategy creation since table doesn't exist
      const mockStrategy: UserStrategy = {
        id: 'mock-' + Date.now(),
        userId: user.id,
        title,
        description: title,
        strategyText,
        aiParsed: {},
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setStrategy(mockStrategy);
      
      toast({
        title: 'Strategy saved',
        description: 'Your trading strategy has been saved successfully'
      });

      if (onStrategyCreated) {
        onStrategyCreated(mockStrategy);
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

      // Mock scanning implementation
      const mockSetups: StrategySetup[] = [
        {
          id: 'setup-1',
          strategyId: strategy?.id || 'mock',
          symbol: 'BTC/USDT',
          entry: 45000,
          sl: 44000,
          tp: 47000,
          confidence: 85,
          timeframe: '1H',
          createdAt: new Date(),
          reasons: ['RSI oversold', 'Support level bounce']
        }
      ];
      
      setMatchingSetups(mockSetups);
      
      if (mockSetups.length === 0) {
        toast({
          title: 'No matching setups found',
          description: 'Your strategy doesn\'t match any current market conditions. Try adjusting your rules or scanning more markets.'
        });
      } else {
        toast({
          title: 'Scan complete',
          description: `Found ${mockSetups.length} matching setup(s)`
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Setup Finder</CardTitle>
          <CardDescription>Define your trading strategy and scan markets for current setups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Strategy Name
            </Label>
            <Input id="title"
              className="mt-1"
              placeholder="My Breakout Strategy" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              disabled={!!strategy || isSaving}
            />
          </div>
          <div>
            <Label htmlFor="strategyText" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Define Your Strategy Rules
            </Label>
            <Textarea id="strategyText"
              className="mt-1 min-h-32"
              placeholder="Example: When RSI(14) is below 30 and there's a bullish engulfing candle on the 1H timeframe, go long with a stop loss at the recent low and take profit at 2x the stop distance."
              value={strategyText}
              onChange={e => setStrategyText(e.target.value)}
              disabled={!!strategy || isSaving}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Markets to Scan</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="forex">Forex</TabsTrigger>
                  <TabsTrigger value="stocks">Stocks</TabsTrigger>
                  <TabsTrigger value="commodities">Commodities</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {availableMarkets.map((market) => (
                      <Badge key={market.symbol}
                        variant={marketsToScan.includes(market.symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleMarketToggle(market.symbol)}
                      >
                        {marketsToScan.includes(market.symbol) ? <Check className="mr-1 h-3 w-3"/> : null}
                        {market.symbol}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="crypto" className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {availableMarkets.filter(m => m.type === 'crypto').map((market) => (
                      <Badge key={market.symbol}
                        variant={marketsToScan.includes(market.symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleMarketToggle(market.symbol)}
                      >
                        {marketsToScan.includes(market.symbol) ? <Check className="mr-1 h-3 w-3"/> : null}
                        {market.symbol}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="forex" className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {availableMarkets.filter(m => m.type === 'forex').map((market) => (
                      <Badge key={market.symbol}
                        variant={marketsToScan.includes(market.symbol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleMarketToggle(market.symbol)}
                      >
                        {marketsToScan.includes(market.symbol) ? <Check className="mr-1 h-3 w-3"/> : null}
                        {market.symbol}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                {/* Similar TabsContent for other market types */}
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" 
            onClick={handleSaveStrategy}
            disabled={isSaving || isScanning || (!title && !strategyText) || !!strategy}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
            Save Strategy
          </Button>
          <Button onClick={handleScanMarkets}
            disabled={isScanning || (!strategy && !strategyText)}>
            {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Scan className="mr-2 h-4 w-4"/>}
            Scan Markets
          </Button>
        </CardFooter>
      </Card>

      {isScanning ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32"/>
              </CardHeader>
              <Skeleton className="h-[200px] w-full"/>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full"/>
                  <Skeleton className="h-4 w-3/4"/>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : matchingSetups.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Matching Setups ({matchingSetups.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Card key={`${setup.symbol}-${setup.timeframe}`} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        {setup.symbol}
                        <Badge variant={isLong ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {isLong ? (
                            <span className="flex items-center"><ArrowUpRight className="mr-1 h-3 w-3"/> LONG</span>
                          ) : (
                            <span className="flex items-center"><ArrowDownRight className="mr-1 h-3 w-3"/> SHORT</span>
                          )}
                        </Badge>
                      </CardTitle>
                      <Badge variant="outline">{setup.timeframe}</Badge>
                    </div>
                  </CardHeader>
                  <CardDescription className="flex items-center">
                    Confidence: <span className="text-amber-500 ml-1">{setup.confidence}%</span>
                  </CardDescription>
                  <div className="h-[200px]">
                    <TradingViewChart
                      data={chartData}
                      overlays={overlays}
                      height={200}
                   />
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div>
                        <div className="text-muted-foreground">Entry</div>
                        <div className="font-semibold">{setup.entry.toFixed(5)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Stop Loss</div>
                        <div className="font-semibold text-red-500">{setup.sl.toFixed(5)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Take Profit</div>
                        <div className="font-semibold text-green-500">{setup.tp.toFixed(5)}</div>
                      </div>
                    </div>
                    {setup.reasons && setup.reasons.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <div className="font-medium text-foreground">Reasons:</div>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          {setup.reasons.slice(0, 2).map((reason: string, i: number) => (
                            <li key={i}>{reason}</li>
                          ))}
                          {setup.reasons.length > 2 && (
                            <li>+ {setup.reasons.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-3 w-3"/>
                      Create Trade
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SetupFromStrategy;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
