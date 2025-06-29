import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, TrendingUp, TrendingDown, Minus, Bell, Star, Info, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

interface CorrelationData {
  id: string;
  symbol_pair: string[];
  correlation_value: number;
  timeframe: string;
  start_date: string;
  end_date: string;
  data_points: number;
  correlation_trend?: number[];
  significance_level?: number;
  color_palette?: {
    positive: string;
    negative: string;
    neutral: string;
  };
}

interface FavoritePair {
  id: string;
  symbol_pair: string[];
  notify_on_inverse_correlation: boolean;
  correlation_threshold: number;
  custom_notes?: string;
}

const timeframes = ['5m', '15m', '1h', '4h', '1d', '1w'];
const correlationThresholds = [0.5, 0.7, 0.8, 0.9];

export default function MarketCorrelations() {
  const { user } = useAuth();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [favoritePairs, setFavoritePairs] = useState<FavoritePair[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [filterMode, setFilterMode] = useState<'all' | 'positive' | 'negative'>('all');
  const [showSignificantOnly, setShowSignificantOnly] = useState(false);
  const [selectedPair, setSelectedPair] = useState<CorrelationData | null />(null);

  useEffect(() => {
    fetchCorrelations();
    if (user) {
      fetchFavoritePairs();
    }
  }, [selectedTimeframe, user]);

  const fetchCorrelations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('market_correlations')
        .select('*')
        .eq('timeframe', selectedTimeframe)
        .order('correlation_value', { ascending: false });

      if (error) throw error;
      setCorrelations((data || []).map(item => ({
        ...item,
        color_palette: item.color_palette as {
          positive: string;
          negative: string;
          neutral: string;
        } | undefined
      })));
    } catch (error) {
      console.error('Error fetching correlations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoritePairs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_favorite_pairs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavoritePairs(data || []);
    } catch (error) {
      console.error('Error fetching favorite pairs:', error);
    }
  };

  const toggleFavorite = async (symbolPair: string[]) => {
    if (!user) return;

    const existing = favoritePairs.find(
      fp => JSON.stringify(fp.symbol_pair.sort()) === JSON.stringify(symbolPair.sort())
    );

    try {
      if (existing) {
        await supabase
          .from('user_favorite_pairs')
          .delete()
          .eq('id', existing.id);
        
        setFavoritePairs(prev => prev.filter(fp => fp.id !== existing.id));
      } else {
        const { data, error } = await supabase
          .from('user_favorite_pairs')
          .insert({
            user_id: user.id,
            symbol_pair: symbolPair,
            notify_on_inverse_correlation: false,
            correlation_threshold: 0.8
          })
          .select()
          .single();

        if (error) throw error;
        setFavoritePairs(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getCorrelationColor = (value: number, palette?: any) => {
    const colors = palette || {
      positive: '#10B981',
      negative: '#EF4444',
      neutral: '#6B7280'
    };

    if (value >= 0.7) return colors.positive;
    if (value <= -0.7) return colors.negative;
    return colors.neutral;
  };

  const getCorrelationEmoji = (value: number) => {
    if (value >= 0.7) return <trendingUp className="w-4 h-4" />;
    if (value <= -0.7) return <trendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const filteredCorrelations = correlations.filter(corr => {
    if (filterMode === 'positive' && corr.correlation_value < 0) return false;
    if (filterMode === 'negative' && corr.correlation_value >= 0) return false;
    if (showSignificantOnly && Math.abs(corr.correlation_value) < 0.7) return false;
    return true;
  });

  const isFavorite = (symbolPair: string[]) => {
    return favoritePairs.some(
      fp => JSON.stringify(fp.symbol_pair.sort()) === JSON.stringify(symbolPair.sort())
    );
  };

  const formatCorrelationValue = (value: number) => {
    return value.toFixed(3);
  };

  const renderCorrelationTrend = (trend?: number[]) => {
    if (!trend || trend.length < 2) return null;

    const chartData = trend.map((value, index) => ({
      index,
      value
    }));

    return (
      <Div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%" />
          <lineChart data={chartData}>
            <line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            / />
        </CorrelationData>
      </Div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8" />
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" / />
      </Card>
    );
  }

  return (
    <Div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" />
            Market Correlations
            <Badge variant="secondary">{correlations.length} pairs</div />
          <CardDescription>
            Track correlations between different trading pairs with real-time updates
          </CardDescription />
        <CardContent className="space-y-4" />
          {/* Controls */}
          <Div className="flex flex-wrap gap-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <selectTrigger className="w-32">
                <selectValue / />
              <selectContent>
                {timeframes.map(tf => (
                  <selectItem key={tf} value={tf}>{tf}</Div>
                ))}
              </SelectContent />

            <Tabs value={filterMode} onValueChange={(v) = /> setFilterMode(v as any)}>
              <TabsList>
                <TabsTrigger value="all" />All</Tabs>
                <TabsTrigger value="positive" />Positive</TabsTrigger>
                <TabsTrigger value="negative" />Negative</TabsTrigger />
            </TabsTrigger>

            <Div className="flex items-center space-x-2">
              <Switch
                id="significant"
                checked={showSignificantOnly}
                onCheckedChange={setShowSignificantOnly}
              />
              <Label htmlFor="significant">Significant only (|r| &gt; 0.7)</Div>
            </Div>
          </Div>

          {/* Correlation Grid */}
          <Div className="grid gap-4">
            {filteredCorrelations.length === 0 ? (
              <alert>
                <info className="h-4 w-4" />
                <alertDescription>
                  No correlations found for the selected filters
                </div />
            ) : (
              filteredCorrelations.map(correlation => (
                <Card key={correlation.id} 
                  className={cn(
                    "transition-all cursor-pointer hover:shadow-lg",
                    selectedPair?.id === correlation.id && "ring-2 ring-blue-500"
                  )}
                  onClick={() = /> setSelectedPair(correlation)}
                >
                  <CardContent className="p-4" />
                    <Div className="flex items-start justify-between">
                      <Div className="space-y-2 flex-1">
                        <Div className="flex items-center gap-2">
                          <H3 className="font-semibold text-lg">
                            {correlation.symbol_pair.join(' / ')}
                          </Div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge style={{ 
                                    backgroundColor: getCorrelationColor(correlation.correlation_value, correlation.color_palette),
                                    color: 'white'
                                  }}
                   >
                                  {getCorrelationEmoji(correlation.correlation_value)}
                                  {formatCorrelationValue(correlation.correlation_value)}
                                </TooltipProvider />
                              <TooltipContent>
                                <P>Correlation coefficient</TooltipProvider>
                                <P className="text-xs text-gray-400">
                                  {correlation.data_points} data points
                                </p />
                            </Tooltip />
                          {correlation.significance_level && correlation.significance_level > 0.95 && (
                            <Badge variant="outline">95% significant</P>
                          )}
                        </Div>
                        
                        <P className="text-sm text-gray-500">
                          {new Date(correlation.start_date).toLocaleDateString()} - {new Date(correlation.end_date).toLocaleDateString()}
                        </P>

                        {correlation.correlation_trend && (
                          <Div className="mt-2">
                            <P className="text-xs text-gray-500 mb-1">Correlation trend</Div>
                            {renderCorrelationTrend(correlation.correlation_trend)}
                          </Div>
                        )}
                      </Div>

                      <Div className="flex gap-2">
                        {user && (
                          <Button variant="ghost"
                            size="icon"
                            onClick={(e) = /> {
                              e.stopPropagation();
                              toggleFavorite(correlation.symbol_pair);
                            }}
                          >
                            <Star 
                              className={cn(
                                "w-4 h-4",
                                isFavorite(correlation.symbol_pair) && "fill-yellow-500 text-yellow-500"
                              )}
                            />
                          </Div>
                        )}
                      </Div>
                    </div />
                </Card>
              ))
            )}
          </Div>

          {/* Selected Pair Details */}
          {selectedPair && (
            <Card className="border-blue-500" />
              <CardHeader>
                <CardTitle className="text-lg" />
                  {selectedPair.symbol_pair.join(' / ')} Details
                </Card />
              <CardContent className="space-y-4" />
                <Div className="grid grid-cols-2 gap-4 text-sm">
                  <Div>
                    <P className="text-gray-500">Correlation</Card>
                    <P className="font-semibold text-lg" style={{ color: getCorrelationColor(selectedPair.correlation_value) }}>
                      {formatCorrelationValue(selectedPair.correlation_value)}
                    </P>
                  </Div>
                  <Div>
                    <P className="text-gray-500">Timeframe</Div>
                    <P className="font-semibold">{selectedPair.timeframe}</P>
                  </Div>
                  <Div>
                    <P className="text-gray-500">Data Points</Div>
                    <P className="font-semibold">{selectedPair.data_points}</P>
                  </Div>
                  <Div>
                    <P className="text-gray-500">Period</Div>
                    <P className="font-semibold">
                      {Math.ceil((new Date(selectedPair.end_date).getTime() - new Date(selectedPair.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                    </P>
                  </Div>
                </Div>

                <alert>
                  <info className="h-4 w-4" />
                  <alertDescription>
                    {selectedPair.correlation_value > 0.7 && "These pairs move strongly in the same direction. Consider this when diversifying."}
                    {selectedPair.correlation_value < -0.7 && "These pairs move in opposite directions. One can hedge the other."}
                    {Math.abs(selectedPair.correlation_value) <= 0.7 && "These pairs have moderate to low correlation."}
                  </AlertDescription />
              </CardContent />
          )}
        </CardContent />
    </Div>
  );
} 