import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import AdaptiveDashboard from '@/components/dashboard/AdaptiveDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BarChart3, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

// Import dashboard widgets
import RiskAnalysisWidget from '@/components/dashboard/widgets/RiskAnalysisWidget';
import SuggestedSetupWidget from '@/components/dashboard/widgets/SuggestedSetupWidget';

interface UserPreferences {
  experience_level: string;
  favorite_markets: string[];
  preferred_timeframes: string[];
  ai_goals: string[];
  risk_profile: string;
  onboarding_completed: boolean;
}

interface PortfolioStats {
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  daily_pnl: number[];
  daily_labels: string[];
}

interface MarketAlert {
  id: string;
  market: string;
  message: string;
  type: 'breakout' | 'support' | 'resistance' | 'pattern' | 'news';
  timestamp: string;
  is_read: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioStats | null>(null);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [suggestedLesson, setSuggestedLesson] = useState<any>(null);
  const [tradeIdea, setTradeIdea] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  // Check onboarding status and load data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Load user preferences
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (prefsError && prefsError.code !== 'PGRST116') {
          throw prefsError;
        }
        
        if (!prefsData || !prefsData.onboarding_completed) {
          setNeedsOnboarding(true);
          return;
        }
        
        setPreferences(prefsData);
        
        // Fetch portfolio stats (mock data for now)
        // In production, this would be a real API call to your backend
        const mockPortfolio: PortfolioStats = {
          total_trades: 47,
          win_rate: 68,
          total_pnl: 2874.52,
          daily_pnl: [120, 250, -80, 320, 180, -40, 210],
          daily_labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        };
        
        setPortfolio(mockPortfolio);
        
        // Fetch market alerts
        const { data: alertsData } = await supabase
          .from('market_alerts')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(5);
          
        setAlerts(alertsData || []);
        
        // Generate AI trade idea based on user preferences
        if (prefsData?.favorite_markets?.length > 0) {
          const favMarket = prefsData.favorite_markets[0];
          const mockIdea = `Based on your ${prefsData.experience_level} level and ${prefsData.risk_profile} risk profile, consider a ${favMarket} ${Math.random() > 0.5 ? 'long' : 'short'} position with a 2:1 risk-reward ratio.`;
          setTradeIdea(mockIdea);
        }
        
        // Fetch suggested lesson
        const { data: lessonsData } = await supabase
          .from('academy_lessons')
          .select('*')
          .limit(1);
          
        if (lessonsData?.[0]) {
          setSuggestedLesson(lessonsData[0]);
        }
        
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast({
          title: 'Dashboard Error',
          description: 'Failed to load your dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user, toast]);
  
  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    window.location.reload(); // Reload to fetch all data with new preferences
  };
  
  if (needsOnboarding) {
    return <OnboardingModal forceOpen={true} onComplete={handleOnboardingComplete} />;
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email?.split('@')[0] || 'Trader'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {preferences?.favorite_markets?.map(market => (
            <Badge key={market} variant="outline">{market}</Badge>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[180px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Portfolio Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Trades</p>
                        <p className="text-2xl font-bold">{portfolio.total_trades}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-2xl font-bold">{portfolio.win_rate}%</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Total P&L</p>
                        <p className={`text-2xl font-bold ${portfolio.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {portfolio.total_pnl >= 0 ? '+' : ''}${portfolio.total_pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-[120px]">
                      <LineChart
                        data={portfolio.daily_pnl}
                        labels={portfolio.daily_labels}
                        fillColor={portfolio.total_pnl >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                        lineColor={portfolio.total_pnl >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">No portfolio data available</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Connect Trading Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* AI Trade Idea */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  AI Trade Idea
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tradeIdea ? (
                  <div className="space-y-4">
                    <p className="text-sm">{tradeIdea}</p>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        View Analysis
                      </Button>
                      <Button variant="outline" size="sm">
                        Save Idea
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">No trade ideas available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Learning Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  Learning Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestedLesson ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Recommended for you:</p>
                    <div className="border border-border rounded-md p-3">
                      <h4 className="font-semibold mb-1">{suggestedLesson.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{suggestedLesson.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {preferences?.experience_level || 'Beginner'}
                        </Badge>
                        <Button size="sm" variant="ghost">Start Lesson</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">No lessons available</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Academy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Market Alerts */}
          <div className="mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  Real-Time Market Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length > 0 ? (
                  <div className="space-y-2">
                    {alerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`flex items-center justify-between p-3 rounded-md border ${alert.is_read ? 'border-border bg-background/50' : 'border-amber-500/30 bg-amber-500/5'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{alert.market}</Badge>
                          <p className="text-sm">{alert.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No market alerts at the moment</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Configure Alerts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Personalized Widgets */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Personalized Insights</h2>
            <Tabs defaultValue="widgets">
              <TabsList>
                <TabsTrigger value="widgets">Dashboard Widgets</TabsTrigger>
                <TabsTrigger value="customize">Customize</TabsTrigger>
              </TabsList>
              <TabsContent value="widgets" className="mt-6">
                {/* Adaptive Dashboard Widget System */}
                <AdaptiveDashboard />
              </TabsContent>
              <TabsContent value="customize" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Dashboard Customization</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop widgets to customize your dashboard layout
                  </p>
                  <Button>Open Layout Editor</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
} 