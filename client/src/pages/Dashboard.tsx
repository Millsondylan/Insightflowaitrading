import React, { useState, useEffect, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Target, 
  Bell,
  BookOpen,
  Activity,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Eye,
  Settings2
} from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import DocumentHead from '@/components/core/DocumentHead';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardWidget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: React.ReactNode;
}

interface UserPreferences {
  experience: 'beginner' | 'intermediate' | 'expert';
  favorite_markets: string[];
  favorite_timeframes: string[];
  trading_style: string[];
  ai_goals: string[];
  risk_profile: string;
}

interface PortfolioData {
  balance: number;
  pnl: number;
  pnl_percentage: number;
  open_positions: number;
}

interface TradeData {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  entry_price: number;
  current_price: number;
  pnl: number;
  timestamp: string;
}

interface AIRecommendation {
  symbol: string;
  action: 'buy' | 'sell' | 'watch';
  confidence: number;
  reason: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard State
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    balance: 10000,
    pnl: 0,
    pnl_percentage: 0,
    open_positions: 0
  });
  const [recentTrades, setRecentTrades] = useState<TradeData[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [marketAlerts, setMarketAlerts] = useState<any[]>([]);
  const [suggestedLessons, setSuggestedLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Grid Layout State
  const [layouts, setLayouts] = useState({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  // Load user data and preferences
  useEffect(() => {
    const loadDashboardData = async () => {
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
        }

        // Load portfolio data from demo_trades
        const { data: trades, error: tradesError } = await supabase
          .from('demo_trades')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!tradesError && trades) {
          // Calculate portfolio stats
          const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
          const openPositions = trades.filter(t => t.status === 'open').length;
          
          setPortfolioData({
            balance: 10000 + totalPnL,
            pnl: totalPnL,
            pnl_percentage: (totalPnL / 10000) * 100,
            open_positions: openPositions
          });

          setRecentTrades(trades.slice(0, 5).map(trade => ({
            id: trade.id,
            symbol: trade.symbol,
            side: trade.side as 'buy' | 'sell',
            size: trade.size,
            entry_price: trade.entry_price,
            current_price: trade.exit_price || trade.entry_price,
            pnl: trade.pnl || 0,
            timestamp: trade.created_at
          })));
        }

        // Generate AI recommendation based on user preferences
        if (preferences?.favorite_markets?.length) {
          const randomMarket = preferences.favorite_markets[0];
          setAiRecommendation({
            symbol: randomMarket,
            action: 'buy',
            confidence: 85,
            reason: `Strong momentum detected in ${randomMarket} with favorable market conditions`,
            entry_price: 1.2540,
            target_price: 1.2680,
            stop_loss: 1.2450
          });
        }

        // Mock suggested lessons based on experience level
        if (preferences?.experience) {
          const lessonsByLevel = {
            beginner: [
              { title: 'Understanding Support & Resistance', progress: 0, duration: '15 min' },
              { title: 'Risk Management Basics', progress: 60, duration: '20 min' },
              { title: 'Reading Price Action', progress: 100, duration: '25 min' }
            ],
            intermediate: [
              { title: 'Advanced Chart Patterns', progress: 40, duration: '30 min' },
              { title: 'Multiple Timeframe Analysis', progress: 0, duration: '35 min' },
              { title: 'Position Sizing Strategies', progress: 80, duration: '25 min' }
            ],
            expert: [
              { title: 'Algorithmic Trading Strategies', progress: 20, duration: '45 min' },
              { title: 'Market Microstructure', progress: 0, duration: '40 min' },
              { title: 'Advanced Risk Models', progress: 90, duration: '50 min' }
            ]
          };
          setSuggestedLessons(lessonsByLevel[preferences.experience]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Welcome message based on user preferences
  const welcomeMessage = useMemo(() => {
    if (!userPreferences) return 'Welcome to your dashboard';
    
    const timeOfDay = new Date().getHours();
    let greeting = 'Welcome back';
    
    if (timeOfDay < 12) greeting = 'Good morning';
    else if (timeOfDay < 18) greeting = 'Good afternoon';  
    else greeting = 'Good evening';
    
    const experienceMessage = {
      beginner: 'Ready to learn something new today?',
      intermediate: 'Your trading dashboard is ready.',
      expert: 'Market insights and analysis await.'
    };
    
    return `${greeting}! ${experienceMessage[userPreferences.experience]}`;
  }, [userPreferences]);

  // Dashboard Widgets
  const widgets: DashboardWidget[] = [
    // Portfolio Overview Widget
    {
      i: 'portfolio',
      x: 0,
      y: 0,
      w: 4,
      h: 3,
      component: (
        <Card className="h-full bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="w-5 h-5 text-green-400" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${portfolioData.balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">P&L Today</p>
                <div className="flex items-center gap-1">
                  {portfolioData.pnl >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-lg font-bold ${portfolioData.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${Math.abs(portfolioData.pnl).toFixed(2)}
                  </span>
                  <span className={`text-sm ${portfolioData.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ({portfolioData.pnl_percentage >= 0 ? '+' : ''}{portfolioData.pnl_percentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Open Positions</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {portfolioData.open_positions}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },

    // AI Recommendation Widget  
    {
      i: 'ai-recommendation',
      x: 4,
      y: 0,
      w: 4,
      h: 3,
      component: (
        <Card className="h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Trade Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiRecommendation ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                      {aiRecommendation.symbol}
                    </Badge>
                    <Badge className={`${aiRecommendation.action === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {aiRecommendation.action.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Confidence</p>
                    <p className="text-lg font-bold text-purple-400">{aiRecommendation.confidence}%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{aiRecommendation.reason}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Entry</p>
                    <p className="text-white font-medium">{aiRecommendation.entry_price}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Target</p>
                    <p className="text-green-300 font-medium">{aiRecommendation.target_price}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Stop</p>
                    <p className="text-red-300 font-medium">{aiRecommendation.stop_loss}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  onClick={() => navigate('/markets/' + aiRecommendation.symbol)}
                >
                  View Setup <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">Loading AI recommendations...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )
    },

    // Recent Trades Widget
    {
      i: 'recent-trades',
      x: 8,
      y: 0,
      w: 4,
      h: 3,
      component: (
        <Card className="h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-blue-400" />
              Recent Trades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentTrades.length > 0 ? (
              recentTrades.map(trade => (
                <div key={trade.id} className="flex items-center justify-between py-1 border-b border-gray-700/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-blue-500/50 text-blue-300 text-xs">
                      {trade.symbol}
                    </Badge>
                    <span className={`text-xs px-1 py-0.5 rounded ${trade.side === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {trade.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">No trades yet</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => navigate('/markets')}
                >
                  Start Trading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )
    },

    // Suggested Academy Lessons
    {
      i: 'academy-lessons',
      x: 0,
      y: 3,
      w: 6,
      h: 3,
      component: (
        <Card className="h-full bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5 text-orange-400" />
              Recommended Lessons
              <Badge variant="secondary" className="ml-auto">
                {userPreferences?.experience?.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedLessons.map((lesson, index) => (
              <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white group-hover:text-orange-300 transition-colors">
                      {lesson.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {lesson.duration}
                    </Badge>
                  </div>
                  <div className="mt-1 bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-orange-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-300 transition-colors" />
              </div>
            ))}
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => navigate('/academy')}
            >
              Browse All Lessons
            </Button>
          </CardContent>
        </Card>
      )
    },

    // Market Alerts & News
    {
      i: 'market-alerts',
      x: 6,
      y: 3,
      w: 6,
      h: 3,
      component: (
        <Card className="h-full bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5 text-red-400" />
              Market Alerts
              <Badge variant="secondary" className="ml-auto bg-red-500/20 text-red-300">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userPreferences?.favorite_markets?.map((market, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white">{market}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Monitoring</p>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">Set up alerts in Markets</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => navigate('/markets')}
                >
                  Explore Markets
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )
    }
  ];

  // Default layouts for different breakpoints
  const defaultLayouts = {
    lg: widgets.map(w => ({ i: w.i, x: w.x, y: w.y, w: w.w, h: w.h })),
    md: widgets.map(w => ({ i: w.i, x: w.x % 8, y: w.y, w: w.w > 4 ? 4 : w.w, h: w.h })),
    sm: widgets.map(w => ({ i: w.i, x: 0, y: w.y * 2, w: 6, h: w.h })),
    xs: widgets.map(w => ({ i: w.i, x: 0, y: w.y * 3, w: 4, h: w.h })),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead 
        title="Dashboard - InsightFlow AI" 
        description="Your personalized trading dashboard with AI insights and market data"
      />
      
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{welcomeMessage}</h1>
            <p className="text-gray-400 mt-1">
              {userPreferences?.favorite_markets?.length && (
                <>Watching {userPreferences.favorite_markets.join(', ')} • </>
              )}
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/settings')}
            className="text-gray-300 border-gray-600 hover:border-gray-500"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Draggable Widget Grid */}
      <div className="max-w-7xl mx-auto">
        <ResponsiveGridLayout
          className="layout"
          layouts={Object.keys(layouts).length ? layouts : defaultLayouts}
          onLayoutChange={(layout, layouts) => setLayouts(layouts)}
          onBreakpointChange={(newBreakpoint) => setCurrentBreakpoint(newBreakpoint)}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={120}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          isDraggable={true}
          isResizable={true}
          compactType="vertical"
          preventCollision={false}
        >
          {widgets.map((widget) => (
            <div key={widget.i} className="widget">
              {widget.component}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {/* Quick Actions Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-2">
          <Button 
            size="sm" 
            className="rounded-full bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate('/markets')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Markets
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="rounded-full border-gray-600 text-gray-300"
            onClick={() => navigate('/strategy-builder')}
          >
            <Target className="w-4 h-4 mr-2" />
            Build Strategy
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="rounded-full border-gray-600 text-gray-300"
            onClick={() => navigate('/journal')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Journal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 