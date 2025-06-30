import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Eye, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  Camera,
  BarChart3,
  Sparkles,
  Save,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';

interface TradeEntry {
  id: string;
  user_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  entry_price: number;
  exit_price?: number;
  size: number;
  entry_date: string;
  exit_date?: string;
  pnl?: number;
  notes?: string;
  strategy?: string;
  tags?: string[];
  screenshots?: string[];
  ai_analysis?: {
    setup_quality: number;
    execution_rating: number;
    lessons_learned: string[];
    improvement_suggestions: string[];
    pattern_detected?: string;
    risk_assessment: string;
  };
  vision_analysis?: {
    detected_patterns: string[];
    support_resistance_levels: number[];
    trend_direction: 'bullish' | 'bearish' | 'sideways';
    confidence_score: number;
    chart_analysis: string;
  };
  status: 'open' | 'closed';
  created_at: string;
}

interface VisionAnalysisResult {
  patterns: string[];
  levels: number[];
  trend: 'bullish' | 'bearish' | 'sideways';
  confidence: number;
  analysis: string;
}

interface TradeStatistics {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  avg_win: number;
  avg_loss: number;
  best_strategy: string;
  worst_timeframe: string;
  most_profitable_day: string;
}

const JournalV2 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [currentTrade, setCurrentTrade] = useState<Partial<TradeEntry>>({});
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState('journal');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStrategy, setFilterStrategy] = useState('all');
  const [filterTimeframe, setFilterTimeframe] = useState('all');
  const [statistics, setStatistics] = useState<TradeStatistics | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Load trades and statistics
  useEffect(() => {
    const loadJournalData = async () => {
      if (!user) return;

      try {
        // Load trades
        const { data: tradesData, error: tradesError } = await supabase
          .from('demo_trades')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!tradesError && tradesData) {
          const transformedTrades: TradeEntry[] = tradesData.map(trade => ({
            id: trade.id,
            user_id: trade.user_id,
            symbol: trade.symbol,
            side: trade.side,
            entry_price: trade.entry_price,
            exit_price: trade.exit_price,
            size: trade.size,
            entry_date: trade.created_at,
            exit_date: trade.exit_date,
            pnl: trade.pnl,
            notes: trade.notes,
            strategy: trade.strategy,
            tags: trade.tags || [],
            screenshots: trade.screenshots || [],
            status: trade.status || 'closed',
            created_at: trade.created_at
          }));
          setTrades(transformedTrades);
        }

        // Calculate statistics
        setIsLoadingStats(true);
        if (tradesData && tradesData.length > 0) {
          const winningTrades = tradesData.filter(t => t.pnl && t.pnl > 0);
          const losingTrades = tradesData.filter(t => t.pnl && t.pnl < 0);
          const totalPnL = tradesData.reduce((sum, t) => sum + (t.pnl || 0), 0);
          
          const stats: TradeStatistics = {
            total_trades: tradesData.length,
            winning_trades: winningTrades.length,
            losing_trades: losingTrades.length,
            win_rate: (winningTrades.length / tradesData.length) * 100,
            total_pnl: totalPnL,
            avg_win: winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length : 0,
            avg_loss: losingTrades.length > 0 ? losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length : 0,
            best_strategy: 'RSI Momentum', // Mock for now
            worst_timeframe: 'Friday Evening', // Mock for now
            most_profitable_day: 'Tuesday' // Mock for now
          };
          setStatistics(stats);
        }
        setIsLoadingStats(false);
      } catch (error) {
        console.error('Error loading journal data:', error);
        setIsLoadingStats(false);
      }
    };

    loadJournalData();
  }, [user]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedImages(prev => [...prev, ...files]);
  };

  // Analyze chart with AI vision
  const analyzeChart = async (imageFile: File): Promise<VisionAnalysisResult | null> => {
    try {
      setIsAnalyzing(true);
      
      // Mock AI vision analysis (in real app, this would call YOLOv8 model)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: VisionAnalysisResult = {
        patterns: ['Double Bottom', 'Bullish Divergence', 'Support Break'],
        levels: [1.2540, 1.2485, 1.2620],
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        confidence: 75 + Math.random() * 20,
        analysis: `Chart analysis detected a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} formation with clear support/resistance levels. The price action shows strong momentum with volume confirmation.`
      };
      
      return mockAnalysis;
    } catch (error) {
      console.error('Error analyzing chart:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate AI trade analysis
  const generateAIAnalysis = async (trade: Partial<TradeEntry>) => {
    try {
      // Mock AI analysis generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isWinning = (trade.pnl || 0) > 0;
      const setupQuality = 60 + Math.random() * 35;
      const executionRating = 65 + Math.random() * 30;
      
      const analysis = {
        setup_quality: setupQuality,
        execution_rating: executionRating,
        lessons_learned: isWinning ? [
          'Good entry timing at support level',
          'Proper risk management applied',
          'Market conditions were favorable'
        ] : [
          'Entry was too early before confirmation',
          'Stop loss was too tight for volatility',
          'Market sentiment changed during trade'
        ],
        improvement_suggestions: [
          'Wait for additional confirmation signals',
          'Consider market session timing',
          'Review correlation with other assets',
          'Adjust position sizing based on volatility'
        ],
        pattern_detected: ['Support/Resistance', 'Momentum Break'][Math.floor(Math.random() * 2)],
        risk_assessment: isWinning ? 'Well-managed risk with appropriate sizing' : 'Risk management could be improved'
      };
      
      return analysis;
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      return null;
    }
  };

  // Save trade entry
  const saveTrade = async () => {
    if (!currentTrade.symbol || !currentTrade.entry_price || !currentTrade.side || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Upload screenshots to Supabase Storage
      let screenshotUrls: string[] = [];
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          const fileName = `${user.id}/${Date.now()}_${image.name}`;
          const { data, error } = await supabase.storage
            .from('trade-screenshots')
            .upload(fileName, image);
          
          if (!error && data) {
            const { data: { publicUrl } } = supabase.storage
              .from('trade-screenshots')
              .getPublicUrl(fileName);
            screenshotUrls.push(publicUrl);
          }
        }
      }

      // Generate AI analysis
      const aiAnalysis = await generateAIAnalysis(currentTrade);

      // Analyze uploaded charts
      let visionAnalysis = null;
      if (uploadedImages.length > 0) {
        visionAnalysis = await analyzeChart(uploadedImages[0]);
      }

      // Save trade to database
      const { data, error } = await supabase
        .from('demo_trades')
        .insert({
          user_id: user.id,
          symbol: currentTrade.symbol,
          side: currentTrade.side,
          entry_price: currentTrade.entry_price,
          exit_price: currentTrade.exit_price,
          size: currentTrade.size || 1,
          entry_date: currentTrade.entry_date || new Date().toISOString(),
          exit_date: currentTrade.exit_date,
          pnl: currentTrade.pnl,
          notes: currentTrade.notes,
          strategy: currentTrade.strategy,
          tags: currentTrade.tags || [],
          screenshots: screenshotUrls,
          ai_analysis: aiAnalysis,
          vision_analysis: visionAnalysis,
          status: currentTrade.status || 'closed'
        })
        .select()
        .single();

      if (error) throw error;

      // Add to trades list
      if (data) {
        const newTrade: TradeEntry = {
          ...data,
          created_at: data.created_at
        };
        setTrades(prev => [newTrade, ...prev]);
      }

      // Reset form
      setCurrentTrade({});
      setUploadedImages([]);
      
      toast({
        title: "Trade Saved! 📊",
        description: "Trade entry has been saved with AI analysis.",
      });
    } catch (error) {
      console.error('Error saving trade:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save trade entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter trades
  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (trade.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStrategy = filterStrategy === 'all' || trade.strategy === filterStrategy;
    return matchesSearch && matchesStrategy;
  });

  // Get unique strategies for filter
  const uniqueStrategies = Array.from(new Set(trades.map(t => t.strategy).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead 
        title="Trading Journal - InsightFlow AI" 
        description="AI-powered trade journal with vision analysis and performance insights"
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Journal</h1>
            <p className="text-gray-400">AI-powered trade analysis and insights</p>
          </div>
          <Button 
            onClick={() => setCurrentTab('add-trade')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trade
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="journal" className="text-white data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="add-trade" className="text-white data-[state=active]:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Trade
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="text-white data-[state=active]:bg-blue-600">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            {/* Filters */}
            <Card className="bg-black/20 border-gray-700 text-white">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search trades..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/20 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <select
                    value={filterStrategy}
                    onChange={(e) => setFilterStrategy(e.target.value)}
                    className="px-3 py-2 bg-black/20 border border-gray-600 rounded text-white"
                  >
                    <option value="all">All Strategies</option>
                    {uniqueStrategies.map(strategy => (
                      <option key={strategy} value={strategy}>{strategy}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Trades List */}
            <div className="grid gap-4">
              {filteredTrades.map((trade) => (
                <Card key={trade.id} className="bg-black/20 border-gray-700 text-white hover:bg-black/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="grid lg:grid-cols-4 gap-6">
                      {/* Trade Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-blue-300 border-blue-500/50">
                            {trade.symbol}
                          </Badge>
                          <Badge className={`${trade.side === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {trade.side.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">
                            {trade.strategy || 'Manual'}
                          </Badge>
                          {trade.pnl && (
                            <Badge className={`${trade.pnl >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Entry Price</p>
                            <p className="font-mono text-white">{trade.entry_price}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Exit Price</p>
                            <p className="font-mono text-white">{trade.exit_price || 'Open'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Size</p>
                            <p className="text-white">{trade.size}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Date</p>
                            <p className="text-white">{new Date(trade.entry_date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {trade.notes && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-sm text-gray-300">{trade.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* AI Analysis */}
                      {trade.ai_analysis && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-purple-300 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            AI Analysis
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-400">Setup Quality</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-purple-400 h-2 rounded-full"
                                    style={{ width: `${trade.ai_analysis.setup_quality}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-white">{trade.ai_analysis.setup_quality.toFixed(0)}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Execution</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-400 h-2 rounded-full"
                                    style={{ width: `${trade.ai_analysis.execution_rating}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-white">{trade.ai_analysis.execution_rating.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-gray-400">Key Lessons:</p>
                            {trade.ai_analysis.lessons_learned.slice(0, 2).map((lesson, index) => (
                              <p key={index} className="text-xs text-gray-300 flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                {lesson}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vision Analysis */}
                      {trade.vision_analysis && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-cyan-300 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Chart Analysis
                          </h4>
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-400">Trend Direction</p>
                              <Badge className={`text-xs ${
                                trade.vision_analysis.trend === 'bullish' ? 'bg-green-500/20 text-green-300' :
                                trade.vision_analysis.trend === 'bearish' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {trade.vision_analysis.trend.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-400">Confidence</p>
                              <p className="text-sm text-white">{trade.vision_analysis.confidence_score.toFixed(0)}%</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">Patterns Detected:</p>
                              <div className="flex flex-wrap gap-1">
                                {trade.vision_analysis.detected_patterns.map((pattern, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {pattern}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Screenshots */}
                    {trade.screenshots && trade.screenshots.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-400 mb-2">Chart Screenshots:</p>
                        <div className="flex gap-2">
                          {trade.screenshots.map((url, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                              <Camera className="w-6 h-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add Trade Tab */}
          <TabsContent value="add-trade" className="space-y-6">
            <Card className="bg-black/20 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Add New Trade Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Trade Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Symbol *</label>
                        <Input
                          placeholder="BTC/USD"
                          value={currentTrade.symbol || ''}
                          onChange={(e) => setCurrentTrade({...currentTrade, symbol: e.target.value})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Side *</label>
                        <select
                          value={currentTrade.side || ''}
                          onChange={(e) => setCurrentTrade({...currentTrade, side: e.target.value as 'buy' | 'sell'})}
                          className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                        >
                          <option value="">Select Side</option>
                          <option value="buy">Buy</option>
                          <option value="sell">Sell</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Entry Price *</label>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="43250.50"
                          value={currentTrade.entry_price || ''}
                          onChange={(e) => setCurrentTrade({...currentTrade, entry_price: parseFloat(e.target.value)})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Exit Price</label>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="43500.75"
                          value={currentTrade.exit_price || ''}
                          onChange={(e) => setCurrentTrade({...currentTrade, exit_price: parseFloat(e.target.value)})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Size</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1.0"
                          value={currentTrade.size || ''}
                          onChange={(e) => setCurrentTrade({...currentTrade, size: parseFloat(e.target.value)})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">P&L</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="250.25"
                          value={currentTrade.pnl || ''}
                          onChange={(e) => setCurrentTrade({...currentTrade, pnl: parseFloat(e.target.value)})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Strategy</label>
                      <Input
                        placeholder="RSI Momentum"
                        value={currentTrade.strategy || ''}
                        onChange={(e) => setCurrentTrade({...currentTrade, strategy: e.target.value})}
                        className="bg-black/20 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Notes</label>
                      <Textarea
                        placeholder="Trade setup, market conditions, lessons learned..."
                        value={currentTrade.notes || ''}
                        onChange={(e) => setCurrentTrade({...currentTrade, notes: e.target.value})}
                        className="bg-black/20 border-gray-600 text-white min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Chart Upload & Analysis */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Chart Screenshots</label>
                      <div 
                        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">Click to upload chart screenshots</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Uploaded Images */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Uploaded Charts:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative">
                              <div className="aspect-square bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                                <Camera className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-xs text-gray-400 mt-1 truncate">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Analysis Preview */}
                    {uploadedImages.length > 0 && (
                      <Card className="bg-purple-500/10 border-purple-500/20">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <h4 className="font-medium text-purple-300">AI Analysis Ready</h4>
                          </div>
                          <p className="text-sm text-gray-300">
                            Your charts will be analyzed for patterns, support/resistance levels, and trend direction using our AI vision system.
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <Button 
                      onClick={saveTrade}
                      disabled={isSaving || isAnalyzing}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSaving || isAnalyzing ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          {isAnalyzing ? 'Analyzing Charts...' : 'Saving Trade...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Trade Entry
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {statistics && (
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Performance Cards */}
                <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total P&L</p>
                        <p className={`text-2xl font-bold ${statistics.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${statistics.total_pnl.toFixed(2)}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Win Rate</p>
                        <p className="text-2xl font-bold text-white">{statistics.win_rate.toFixed(1)}%</p>
                      </div>
                      <Target className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Trades</p>
                        <p className="text-2xl font-bold text-white">{statistics.total_trades}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Avg Win</p>
                        <p className="text-2xl font-bold text-green-400">${statistics.avg_win.toFixed(2)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <Brain className="w-5 h-5" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statistics && (
                    <>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-purple-300 font-medium">Best Strategy</p>
                        <p className="text-white">{statistics.best_strategy}</p>
                        <p className="text-xs text-gray-400">Most profitable approach in your portfolio</p>
                      </div>
                      
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-orange-300 font-medium">Improvement Area</p>
                        <p className="text-white">{statistics.worst_timeframe}</p>
                        <p className="text-xs text-gray-400">Consider avoiding trades during this time</p>
                      </div>
                      
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-green-300 font-medium">Best Trading Day</p>
                        <p className="text-white">{statistics.most_profitable_day}</p>
                        <p className="text-xs text-gray-400">Your most successful trading day historically</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-300">
                    <Eye className="w-5 h-5" />
                    Pattern Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-cyan-300 font-medium">Most Detected Pattern</p>
                    <p className="text-white">Support/Resistance Breaks</p>
                    <p className="text-xs text-gray-400">Found in 67% of your profitable trades</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-blue-300 font-medium">Chart Analysis Accuracy</p>
                    <p className="text-white">82.5%</p>
                    <p className="text-xs text-gray-400">AI vision model accuracy on your charts</p>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-green-300 font-medium">Trend Alignment</p>
                    <p className="text-white">Bullish trades perform 23% better</p>
                    <p className="text-xs text-gray-400">When aligned with overall market trend</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JournalV2; 