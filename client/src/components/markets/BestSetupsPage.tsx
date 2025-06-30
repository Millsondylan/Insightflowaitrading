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

interface SetupWithRank extends PublicSetup {
  rank: number;
  score: number;
  user: {
    email: string;
    displayName: string;
    avatarUrl?: string;
  } | null;
}

export function BestSetupsPage({ onSetupSelect }: BestSetupsPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [setups, setSetups] = useState<SetupWithRank[]>([]);
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
        .order('rank', { ascending: true }) as any;

      if (leaderboardError) throw leaderboardError;
      
      if (!leaderboardData || leaderboardData.length === 0) {
        setSetups([]);
        return;
      }

      // Get the detailed setup information
      const setupIds = leaderboardData.map((item: any) => item.setup_id);
      
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
          shared_at
        `)
        .in('id', setupIds) as any;
      
      if (setupsError) throw setupsError;
      
      if (!setupsData) {
        setSetups([]);
        return;
      }

      // Get user information separately
      const userIds = [...new Set(setupsData.map((setup: any) => setup.user_id))];
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, email, name')
        .in('id', userIds) as any;

      // Create a map of user data
      const usersMap = new Map();
      if (usersData) {
        usersData.forEach((user: any) => {
          usersMap.set(user.id, user);
        });
      }

      // Merge the data with rankings
      const mergedSetups = setupsData.map((setup: any) => {
        const leaderboardItem = leaderboardData.find((item: any) => item.setup_id === setup.id);
        const user = usersMap.get(setup.user_id);
        
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
          user: user ? {
            email: user.email,
            displayName: user.name || user.email.split('@')[0],
            avatarUrl: undefined // We'll need to add avatar_url to profiles table if needed
          } : null
        } as SetupWithRank;
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

  const sortSetups = (setupsToSort: SetupWithRank[], sortField: string, direction: 'asc' | 'desc') => {
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
        valueA = a[sortField as keyof SetupWithRank];
        valueB = b[sortField as keyof SetupWithRank];
      }
      
      // Handle date comparison
      if (sortField === 'sharedAt') {
        valueA = new Date(valueA as Date).getTime();
        valueB = new Date(valueB as Date).getTime();
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
      (supabase as any)
        .from('setup_views')
        .insert([{
          setup_id: setupId,
          user_id: user.id
        }]);
        
      // Update the view count
      (supabase as any).rpc('increment_setup_views', { setup_id: setupId });
      
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
        (supabase as any)
          .from('setup_likes')
          .delete()
          .eq('setup_id', setupId)
          .eq('user_id', user.id);
          
        // Decrement like count
        (supabase as any).rpc('decrement_setup_likes', { setup_id: setupId });
      } else {
        // Like
        (supabase as any)
          .from('setup_likes')
          .insert([{
            setup_id: setupId,
            user_id: user.id
          }]);
          
        // Increment like count
        (supabase as any).rpc('increment_setup_likes', { setup_id: setupId });
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500"/>
            Best Trading Setups
          </h1>
          <p className="text-muted-foreground">
            Top performing setups created by the community, ranked by performance and popularity
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs defaultValue="all" value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="15m">15m</TabsTrigger>
              <TabsTrigger value="1h">1H</TabsTrigger>
              <TabsTrigger value="4h">4H</TabsTrigger>
              <TabsTrigger value="D1">Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType}>
        <TabsList>
          <TabsTrigger value="all">All Types</TabsTrigger>
          <TabsTrigger value="long">Long</TabsTrigger>
          <TabsTrigger value="short">Short</TabsTrigger>
          <TabsTrigger value="breakout">Breakout</TabsTrigger>
          <TabsTrigger value="pullback">Pullback</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm border-b">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Symbol</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Timeframe</div>
          <div 
            className="col-span-2 flex items-center cursor-pointer" 
            onClick={() => handleSort('winRate')}
          >
            Win Rate 
            {sortBy === 'winRate' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>
            )}
          </div>
          <div 
            className="col-span-1 flex items-center cursor-pointer" 
            onClick={() => handleSort('likes')}
          >
            <Heart className="mr-1 h-4 w-4"/>
            {sortBy === 'likes' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>
            )}
          </div>
          <div className="col-span-1">RR</div>
          <div 
            className="col-span-2 flex items-center cursor-pointer" 
            onClick={() => handleSort('sharedAt')}
          >
            Date 
            {sortBy === 'sharedAt' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>
            )}
          </div>
        </div>
        
        {isLoading ? (
          Array(10).fill(0).map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-1"><Skeleton className="h-6 w-8"/></div>
              <div className="col-span-2"><Skeleton className="h-6 w-20"/></div>
              <div className="col-span-1"><Skeleton className="h-6 w-12"/></div>
              <div className="col-span-2"><Skeleton className="h-6 w-12"/></div>
              <div className="col-span-2"><Skeleton className="h-6 w-16"/></div>
              <div className="col-span-1"><Skeleton className="h-6 w-8"/></div>
              <div className="col-span-1"><Skeleton className="h-6 w-8"/></div>
              <div className="col-span-2"><Skeleton className="h-6 w-20"/></div>
            </div>
          ))
        ) : filteredSetups.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No setups found for the selected filters
          </div>
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
              <div 
                key={setup.id} 
                className="grid grid-cols-12 gap-4 p-4 items-center border-b hover:bg-accent/50 cursor-pointer"
                onClick={() => handleSetupClick(setup)}
              >
                <div className="col-span-1 flex items-center">
                  {index < 3 && (
                    <span className="mr-1">
                      {index === 0 && <Trophy className="h-5 w-5 text-yellow-500"/>}
                      {index === 1 && <Trophy className="h-5 w-5 text-gray-300"/>}
                      {index === 2 && <Trophy className="h-5 w-5 text-amber-600"/>}
                    </span>
                  )}
                  <span className={index < 3 ? 'hidden' : ''}>{index + 1}</span>
                </div>
                <div className="col-span-2 font-medium">{setup.symbol}</div>
                <div className="col-span-1">
                  <Badge variant={isLong ? 'default' : 'destructive'}>
                    {isLong ? (
                      <span className="flex items-center"><ArrowUpRight className="mr-1 h-3 w-3"/> LONG</span>
                    ) : (
                      <span className="flex items-center"><ArrowDownRight className="mr-1 h-3 w-3"/> SHORT</span>
                    )}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Badge variant="outline">{setup.timeframe}</Badge>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center">
                    <div className="w-full bg-primary/20 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${Math.round((winRate || 0) * 100)}%` }}
                     />
                    </div>
                    <span className="ml-2 text-xs font-medium">{Math.round((winRate || 0) * 100)}%</span>
                  </div>
                </div>
                <div className="col-span-1 flex items-center">
                  <Heart className={`mr-1 h-4 w-4 ${setup.likes > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                  {setup.likes}
                </div>
                <div className="col-span-1">{rr}</div>
                <div className="col-span-2 text-muted-foreground text-sm">
                  {new Date(setup.sharedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-yellow-500"/> Trending Setups
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
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
                  onClick={() => handleSetupClick(setup)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        {setup.symbol}
                        <Badge variant={isLong ? 'default' : 'destructive'} className="ml-2">
                          {isLong ? (
                            <span className="flex items-center"><ArrowUpRight className="mr-1 h-3 w-3"/> LONG</span>
                          ) : (
                            <span className="flex items-center"><ArrowDownRight className="mr-1 h-3 w-3"/> SHORT</span>
                          )}
                        </Badge>
                        <Badge variant="outline" className="ml-2">{setup.timeframe}</Badge>
                      </CardTitle>
                    </div>
                    <CardDescription className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={setup.user?.avatarUrl} alt={setup.user?.displayName}/>
                          <AvatarFallback>{setup.user?.displayName?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        {setup.user?.displayName}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Heart className={`mr-1 h-4 w-4 ${setup.likes > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                        {setup.likes}
                        <Eye className="ml-3 mr-1 h-4 w-4"/>
                        {setup.views}
                      </div>
                    </CardDescription>
                  </CardHeader>
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
                        <div className="font-semibold">{parseFloat(setup.entry.toString()).toFixed(5)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Stop Loss</div>
                        <div className="font-semibold text-red-500">{parseFloat(setup.sl.toString()).toFixed(5)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Take Profit</div>
                        <div className="font-semibold text-green-500">{parseFloat(setup.tp.toString()).toFixed(5)}</div>
                      </div>
                    </div>
                    {setup.stats?.backtestResults && (
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div>
                          <div className="text-muted-foreground">Win Rate</div>
                          <div className="font-semibold">
                            {Math.round((setup.stats.backtestResults.winRate || 0) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Profit Factor</div>
                          <div className="font-semibold">
                            {(setup.stats.backtestResults.profitFactor || 0).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg. R</div>
                          <div className="font-semibold">
                            {(setup.stats.backtestResults.averageR || 0).toFixed(1)}R
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    {setup.stats?.patternDescription || "No pattern description available"}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default BestSetupsPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

