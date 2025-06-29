import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Heart, Eye, Sparkles, Trophy, ChevronUp, ChevronDown } from 'lucide-react';
import { PublicSetup } from '@/lib/db/types';
import TradingViewChart from '../charts/TradingViewChart';

interface BestSetupsPageProps {
  onSetupSelect?: (setup: PublicSetup) => void;
}

export function BestSetupsPage({ onSetupSelect }: BestSetupsPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [setups, setSetups] = useState<PublicSetup[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchLeaderboardSetups();
  }, []);

  const fetchLeaderboardSetups = async () => {
    try {
      setIsLoading(true);

      // First get the leaderboard data which contains the rankings
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('setup_leaderboard')
        .select('setup_id, rank, score')
        .order('rank', { ascending: true });

      if (leaderboardError) throw leaderboardError;
      
      if (!leaderboardData || leaderboardData.length === 0) {
        setSetups([]);
        return;
      }

      // Get the detailed setup information
      const setupIds = leaderboardData.map(item => item.setup_id);
      
      const { data: setupsData, error: setupsError } = await supabase
        .from('public_setups')
        .select(`
          id, 
          user_id, 
          strategy_id, 
          symbol, 
          entry, 
          sl, 
          tp, 
          timeframe, 
          stats, 
          likes, 
          views, 
          shared_at,
          auth.users(email, display_name, avatar_url)
        `)
        .in('id', setupIds);
      
      if (setupsError) throw setupsError;
      
      if (!setupsData) {
        setSetups([]);
        return;
      }

      // Merge the data with rankings
      const mergedSetups = setupsData.map(setup => {
        const leaderboardItem = leaderboardData.find(item => item.setup_id === setup.id);
        return {
          id: setup.id,
          userId: setup.user_id,
          strategyId: setup.strategy_id,
          symbol: setup.symbol,
          entry: setup.entry,
          sl: setup.sl,
          tp: setup.tp,
          timeframe: setup.timeframe,
          stats: setup.stats || {},
          likes: setup.likes || 0,
          views: setup.views || 0,
          sharedAt: new Date(setup.shared_at),
          rank: leaderboardItem?.rank || 999,
          score: leaderboardItem?.score || 0,
          user: setup.users ? {
            email: setup.users.email,
            displayName: setup.users.display_name || setup.users.email.split('@')[0],
            avatarUrl: setup.users.avatar_url
          } : null
        } as PublicSetup & { rank: number, score: number, user: any };
      });

      // Sort the setups based on the current sort setting
      const sortedSetups = sortSetups(mergedSetups, sortBy, sortDirection);
      
      setSetups(sortedSetups);
      
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sortSetups = (setupsToSort: any[], sortField: string, direction: 'asc' | 'desc') => {
    return [...setupsToSort].sort((a, b) => {
      let valueA, valueB;
      
      // Special handling for nested properties
      if (sortField === 'winRate') {
        valueA = a.stats?.backtestResults?.winRate || 0;
        valueB = b.stats?.backtestResults?.winRate || 0;
      } else if (sortField === 'profitFactor') {
        valueA = a.stats?.backtestResults?.profitFactor || 0;
        valueB = b.stats?.backtestResults?.profitFactor || 0;
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      // Handle date comparison
      if (sortField === 'sharedAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      // Apply sort direction
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set default direction
      setSortBy(field);
      setSortDirection('asc');
    }
    
    const sortedSetups = sortSetups(setups, field, sortDirection === 'asc' ? 'desc' : 'asc');
    setSetups(sortedSetups);
  };

  const handleSetupClick = (setup: PublicSetup) => {
    if (onSetupSelect) {
      onSetupSelect(setup);
    }
    
    // Track view
    trackSetupView(setup.id);
  };

  const trackSetupView = async (setupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // Record the view
      await supabase
        .from('setup_views')
        .insert([{
          setup_id: setupId,
          user_id: user.id
        }]);
        
      // Update the view count
      await supabase.rpc('increment_setup_views', { setup_id: setupId });
      
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };
  
  const handleLikeSetup = async (setupId: string, isLiked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      if (isLiked) {
        // Unlike
        await supabase
          .from('setup_likes')
          .delete()
          .eq('setup_id', setupId)
          .eq('user_id', user.id);
          
        // Decrement like count
        await supabase.rpc('decrement_setup_likes', { setup_id: setupId });
      } else {
        // Like
        await supabase
          .from('setup_likes')
          .insert([{
            setup_id: setupId,
            user_id: user.id
          }]);
          
        // Increment like count
        await supabase.rpc('increment_setup_likes', { setup_id: setupId });
      }
      
      // Refresh data
      fetchLeaderboardSetups();
      
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  // Filter setups based on selected timeframe and type
  const filteredSetups = setups.filter(setup => {
    let typeMatch = true;
    
    if (selectedType !== 'all') {
      // Determine setup type based on various characteristics
      const isLong = setup.tp > setup.entry;
      const isPullback = setup.stats?.patternDescription?.toLowerCase().includes('pullback');
      const isBreakout = setup.stats?.patternDescription?.toLowerCase().includes('breakout');
      
      if (selectedType === 'long' && !isLong) typeMatch = false;
      if (selectedType === 'short' && isLong) typeMatch = false;
      if (selectedType === 'pullback' && !isPullback) typeMatch = false;
      if (selectedType === 'breakout' && !isBreakout) typeMatch = false;
    }
    
    return (selectedTimeframe === 'all' || setup.timeframe === selectedTimeframe) && typeMatch;
  });

  // Function to generate chart data for a setup
  const generateChartData = (setup: PublicSetup) => {
    const data = [];
    let time = new Date(setup.sharedAt);
    time.setHours(time.getHours() - 100);
    
    // Use the entry price as the base
    let basePrice = setup.entry * 0.95 + (Math.random() * setup.entry * 0.1);
    
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
      <Div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Div>
          <H1 className="text-3xl font-bold flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
            Best Trading Setups
          </PublicSetup>
          <P className="text-muted-foreground">
            Top performing setups created by the community, ranked by performance and popularity
          </P>
        </Div>
        
        <Div className="flex gap-2">
          <Tabs defaultValue="all" value={selectedTimeframe} onValueChange={setSelectedTimeframe} />
            <TabsList>
              <TabsTrigger value="all" />All</Div>
              <TabsTrigger value="15m" />15m</TabsTrigger>
              <TabsTrigger value="1h" />1H</TabsTrigger>
              <TabsTrigger value="4h" />4H</TabsTrigger>
              <TabsTrigger value="D1" />Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        </Div>
      </Div>
      
      <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType} />
        <TabsList>
          <TabsTrigger value="all" />All Types</Tabs>
          <TabsTrigger value="long" />Long</TabsTrigger>
          <TabsTrigger value="short" />Short</TabsTrigger>
          <TabsTrigger value="breakout" />Breakout</TabsTrigger>
          <TabsTrigger value="pullback" />Pullback</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Div className="bg-card rounded-lg border overflow-hidden">
        <Div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm border-b">
          <Div className="col-span-1">#</Div>
          <Div className="col-span-2">Symbol</Div>
          <Div className="col-span-1">Type</Div>
          <Div className="col-span-2">Timeframe</Div>
          <Div 
            className="col-span-2 flex items-center cursor-pointer" 
            onClick={() => handleSort('winRate')}
          >
            Win Rate 
            {sortBy === 'winRate' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Div>
          <Div 
            className="col-span-1 flex items-center cursor-pointer" 
            onClick={() => handleSort('likes')}
          >
            <Heart className="mr-1 h-4 w-4" />
            {sortBy === 'likes' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Div>
          <Div className="col-span-1">RR</Div>
          <Div 
            className="col-span-2 flex items-center cursor-pointer" 
            onClick={() => handleSort('sharedAt')}
          >
            Date 
            {sortBy === 'sharedAt' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Div>
        </Div>
        
        {isLoading ? (
          Array(10).fill(0).map((_, i) => (
            <Div key={i} className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <Div className="col-span-1"><Skeleton className="h-6 w-8" /></Div>
              <Div className="col-span-2"><Skeleton className="h-6 w-20" /></Div>
              <Div className="col-span-1"><Skeleton className="h-6 w-12" /></Div>
              <Div className="col-span-2"><Skeleton className="h-6 w-12" /></Div>
              <Div className="col-span-2"><Skeleton className="h-6 w-16" /></Div>
              <Div className="col-span-1"><Skeleton className="h-6 w-8" /></Div>
              <Div className="col-span-1"><Skeleton className="h-6 w-8" /></Div>
              <Div className="col-span-2"><Skeleton className="h-6 w-20" /></Div>
            </Div>
          ))
        ) : filteredSetups.length === 0 ? (
          <Div className="p-8 text-center text-muted-foreground">
            No setups found for the selected filters
          </Div>
        ) : (
          filteredSetups.map((setup, index) => {
            const isLong = setup.tp > setup.entry;
            const winRate = setup.stats?.backtestResults?.winRate || 0;
            const profitFactor = setup.stats?.backtestResults?.profitFactor || 0;
            
            // Calculate risk-reward ratio
            const risk = Math.abs(setup.entry - setup.sl);
            const reward = Math.abs(setup.tp - setup.entry);
            const rr = (reward / risk).toFixed(1);
            
            return (
              <Div 
                key={setup.id} 
                className="grid grid-cols-12 gap-4 p-4 items-center border-b hover:bg-accent/50 cursor-pointer"
                onClick={() => handleSetupClick(setup)}
              >
                <Div className="col-span-1 flex items-center">
                  {index < 3 && (
                    <Span className="mr-1">
                      {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                      {index === 1 && <Trophy className="h-5 w-5 text-gray-300" />}
                      {index === 2 && <Trophy className="h-5 w-5 text-amber-600" />}
                    </Div>
                  )}
                  <Span className={index < 3 ? 'hidden' : ''}>{index + 1}</Span>
                </Div>
                <Div className="col-span-2 font-medium">{setup.symbol}</Div>
                <Div className="col-span-1">
                  <Badge variant={isLong ? 'default' : 'destructive'} />
                    {isLong ? (
                      <Span className="flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" /> LONG</Div>
                    ) : (
                      <Span className="flex items-center"><ArrowDownRight className="mr-1 h-3 w-3" /> SHORT</Span>
                    )}
                  </Badge>
                </Div>
                <Div className="col-span-2">
                  <Badge variant="outline" />{setup.timeframe}</Div>
                </Div>
                <Div className="col-span-2">
                  <Div className="flex items-center">
                    <Div className="w-full bg-primary/20 rounded-full h-2.5">
                      <Div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${Math.round((winRate || 0) * 100)}%` }}
                      />
                    </Div>
                    <Span className="ml-2 text-xs font-medium">{Math.round((winRate || 0) * 100)}%</Span>
                  </Div>
                </Div>
                <Div className="col-span-1 flex items-center">
                  <Heart className={`mr-1 h-4 w-4 ${setup.likes /> 0 ? 'text-red-500 fill-red-500' : ''}`} />
                  {setup.likes}
                </Div>
                <Div className="col-span-1">{rr}</Div>
                <Div className="col-span-2 text-muted-foreground text-sm">
                  {new Date(setup.sharedAt).toLocaleDateString()}
                </Div>
              </Div>
            );
          })
        )}
      </Div>
      
      <Div className="mt-8">
        <H2 className="text-2xl font-bold mb-4 flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-yellow-500" /> Trending Setups
        </Div>
        
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
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
            ))
          ) : (
            filteredSetups.slice(0, 3).map((setup) => {
              const chartData = generateChartData(setup);
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
                <Card key={setup.id} 
                  className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() = /> handleSetupClick(setup)}
                >
                  <CardHeader className="pb-2" />
                    <Div className="flex justify-between items-center">
                      <CardTitle className="flex items-center" />
                        {setup.symbol}
                        <Badge variant={isLong ? 'default' : 'destructive'}
                          className="ml-2"
                    >
                          {isLong ? (
                            <Span className="flex items-center"><ArrowUpRight className="mr-1 h-3 w-3" /> LONG</Card>
                          ) : (
                            <Span className="flex items-center"><ArrowDownRight className="mr-1 h-3 w-3" /> SHORT</Span>
                          )}
                        </Badge>
                      </CardTitle>
                      <Badge variant="outline" />{setup.timeframe}</Badge>
                    </Div>
                    <CardDescription className="flex items-center justify-between" />
                      <Div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2" />
                          <AvatarImage src={setup.user?.avatarUrl} alt={setup.user?.displayName} />
                          <AvatarFallback>{setup.user?.displayName?.[0] || '?'}</CardDescription>
                        </Avatar>
                        {setup.user?.displayName}
                      </Div>
                      <Div className="flex items-center text-sm text-muted-foreground">
                        <Heart className={`mr-1 h-4 w-4 ${setup.likes /> 0 ? 'text-red-500 fill-red-500' : ''}`} />
                        {setup.likes}
                        <Eye className="ml-3 mr-1 h-4 w-4" />
                        {setup.views}
                      </Div>
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
                        <Div className="font-semibold">{parseFloat(setup.entry.toString()).toFixed(5)}</Div>
                      </Div>
                      <Div>
                        <Div className="text-muted-foreground">Stop Loss</Div>
                        <Div className="font-semibold text-red-500">{parseFloat(setup.sl.toString()).toFixed(5)}</Div>
                      </Div>
                      <Div>
                        <Div className="text-muted-foreground">Take Profit</Div>
                        <Div className="font-semibold text-green-500">{parseFloat(setup.tp.toString()).toFixed(5)}</Div>
                      </Div>
                    </Div>
                    {setup.stats?.backtestResults && (
                      <Div className="grid grid-cols-3 gap-1 text-xs">
                        <Div>
                          <Div className="text-muted-foreground">Win Rate</Div>
                          <Div className="font-semibold">
                            {Math.round((setup.stats.backtestResults.winRate || 0) * 100)}%
                          </Div>
                        </Div>
                        <Div>
                          <Div className="text-muted-foreground">Profit Factor</Div>
                          <Div className="font-semibold">
                            {(setup.stats.backtestResults.profitFactor || 0).toFixed(2)}
                          </Div>
                        </Div>
                        <Div>
                          <Div className="text-muted-foreground">Avg. R</Div>
                          <Div className="font-semibold">
                            {(setup.stats.backtestResults.averageR || 0).toFixed(1)}R
                          </Div>
                        </Div>
                      </Div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground" />
                    {setup.stats?.patternDescription || "No pattern description available"}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </Div>
      </Div>
    </Div>
  );
}

export default BestSetupsPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

