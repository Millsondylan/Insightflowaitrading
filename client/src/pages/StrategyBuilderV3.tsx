import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  Save, 
  BarChart3, 
  Settings, 
  Code, 
  TrendingUp,
  Target,
  Shield,
  Clock,
  DollarSign,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';

// Mock LineChart component for demonstration
const LineChart = ({ data, color }: { data: any[], color: string }) => (
  <div className="w-full h-full bg-black/20 rounded flex items-center justify-center">
    <p className="text-gray-400">Chart visualization ({data.length} data points)</p>
  </div>
);

interface StrategyParameter {
  name: string;
  type: 'number' | 'boolean' | 'select';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description: string;
}

interface GeneratedStrategy {
  title: string;
  description: string;
  pseudocode: string;
  parameters: StrategyParameter[];
  logic: {
    entry_conditions: string[];
    exit_conditions: string[];
    risk_management: string[];
  };
  timeframes: string[];
  markets: string[];
}

interface BacktestResult {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  max_drawdown: number;
  sharpe_ratio: number;
  profit_factor: number;
  avg_win: number;
  avg_loss: number;
  largest_win: number;
  largest_loss: number;
  equity_curve: { date: string; equity: number }[];
  trade_list: {
    id: number;
    entry_date: string;
    exit_date: string;
    symbol: string;
    side: 'buy' | 'sell';
    entry_price: number;
    exit_price: number;
    pnl: number;
    return_pct: number;
  }[];
}

const StrategyBuilderV3 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [prompt, setPrompt] = useState('');
  const [generatedStrategy, setGeneratedStrategy] = useState<GeneratedStrategy | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [selectedMarket, setSelectedMarket] = useState('BTC/USD');
  const [backtestPeriod, setBacktestPeriod] = useState(30); // days
  const [currentTab, setCurrentTab] = useState('builder');

  // Sample prompts for user inspiration
  const samplePrompts = [
    "Give me a 15 EMA pullback strategy for scalping",
    "Create a momentum breakout strategy using RSI and volume",
    "Build a mean reversion strategy with Bollinger Bands",
    "Design a trend following strategy with multiple timeframes",
    "Create a support and resistance trading strategy",
  ];

  // Generate strategy using AI
  const generateStrategy = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a strategy description.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI strategy generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated strategy based on prompt
      const strategy: GeneratedStrategy = {
        title: prompt.includes('EMA') ? 'EMA Pullback Strategy' : 
               prompt.includes('RSI') ? 'RSI Momentum Strategy' :
               prompt.includes('Bollinger') ? 'Bollinger Bands Mean Reversion' :
               'Custom Trading Strategy',
        description: `An automated trading strategy generated based on your prompt: "${prompt}". This strategy combines technical indicators with risk management rules to identify high-probability trading opportunities.`,
        pseudocode: `
// Entry Conditions
IF price > EMA(15) AND
   RSI < 30 AND
   volume > average_volume * 1.2
THEN
   ENTER LONG

// Exit Conditions  
IF price < EMA(15) OR
   RSI > 70 OR
   stop_loss_hit OR
   take_profit_hit
THEN
   EXIT POSITION

// Risk Management
- Max position size: 2% of account
- Stop loss: 1% below entry
- Take profit: 2% above entry
- Max daily trades: 3
        `,
        parameters: [
          {
            name: 'EMA Period',
            type: 'number',
            value: 15,
            min: 5,
            max: 50,
            step: 1,
            description: 'Period for Exponential Moving Average'
          },
          {
            name: 'RSI Period',
            type: 'number',
            value: 14,
            min: 5,
            max: 30,
            step: 1,
            description: 'Period for RSI calculation'
          },
          {
            name: 'RSI Oversold',
            type: 'number',
            value: 30,
            min: 10,
            max: 40,
            step: 1,
            description: 'RSI oversold threshold'
          },
          {
            name: 'RSI Overbought',
            type: 'number',
            value: 70,
            min: 60,
            max: 90,
            step: 1,
            description: 'RSI overbought threshold'
          },
          {
            name: 'Volume Multiplier',
            type: 'number',
            value: 1.2,
            min: 1.0,
            max: 3.0,
            step: 0.1,
            description: 'Volume filter multiplier'
          },
          {
            name: 'Stop Loss %',
            type: 'number',
            value: 1.0,
            min: 0.5,
            max: 5.0,
            step: 0.1,
            description: 'Stop loss percentage'
          },
          {
            name: 'Take Profit %',
            type: 'number',
            value: 2.0,
            min: 1.0,
            max: 10.0,
            step: 0.1,
            description: 'Take profit percentage'
          },
          {
            name: 'Max Position Size %',
            type: 'number',
            value: 2.0,
            min: 0.5,
            max: 10.0,
            step: 0.1,
            description: 'Maximum position size as % of account'
          }
        ],
        logic: {
          entry_conditions: [
            'Price above EMA(15)',
            'RSI below oversold threshold',
            'Volume above average * multiplier',
            'No existing position'
          ],
          exit_conditions: [
            'Price below EMA(15)',
            'RSI above overbought threshold', 
            'Stop loss triggered',
            'Take profit triggered'
          ],
          risk_management: [
            'Position sizing based on account %',
            'Stop loss on every trade',
            'Take profit targets',
            'Maximum daily trade limit'
          ]
        },
        timeframes: ['5m', '15m', '1h', '4h'],
        markets: ['BTC/USD', 'ETH/USD', 'EUR/USD', 'GBP/USD', 'AAPL', 'TSLA']
      };

      setGeneratedStrategy(strategy);
      setCurrentTab('strategy');
      
      toast({
        title: "Strategy Generated! 🎉",
        description: "Your AI strategy is ready. Review and adjust parameters before backtesting.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Run backtest
  const runBacktest = async () => {
    if (!generatedStrategy) return;

    setIsBacktesting(true);
    try {
      // Simulate backtest API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock backtest results
      const mockResult: BacktestResult = {
        total_trades: 127,
        winning_trades: 78,
        losing_trades: 49,
        win_rate: 61.4,
        total_pnl: 2547.83,
        max_drawdown: -8.7,
        sharpe_ratio: 1.42,
        profit_factor: 1.89,
        avg_win: 45.32,
        avg_loss: -23.67,
        largest_win: 234.56,
        largest_loss: -89.23,
        equity_curve: Array.from({ length: backtestPeriod }, (_, i) => ({
          date: new Date(Date.now() - (backtestPeriod - i) * 24 * 60 * 60 * 1000).toISOString(),
          equity: 10000 + (Math.random() - 0.3) * 100 * i + (i * 85)
        })),
        trade_list: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          entry_date: new Date(Date.now() - Math.random() * backtestPeriod * 24 * 60 * 60 * 1000).toISOString(),
          exit_date: new Date(Date.now() - Math.random() * backtestPeriod * 24 * 60 * 60 * 1000).toISOString(),
          symbol: selectedMarket,
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          entry_price: 43000 + Math.random() * 1000,
          exit_price: 43000 + Math.random() * 1000,
          pnl: (Math.random() - 0.4) * 200,
          return_pct: (Math.random() - 0.4) * 5
        }))
      };

      setBacktestResult(mockResult);
      setCurrentTab('results');
      
      toast({
        title: "Backtest Complete! 📊",
        description: `Strategy tested over ${backtestPeriod} days with ${mockResult.total_trades} trades.`,
      });
    } catch (error) {
      console.error('Error running backtest:', error);
      toast({
        title: "Backtest Failed",
        description: "Failed to run backtest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBacktesting(false);
    }
  };

  // Save strategy
  const saveStrategy = async () => {
    if (!generatedStrategy || !user) return;

    try {
      const { error } = await supabase
        .from('strategies')
        .insert({
          user_id: user.id,
          name: generatedStrategy.title,
          description: generatedStrategy.description,
          code: generatedStrategy.pseudocode,
          parameters: generatedStrategy.parameters,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Strategy Saved! 💾",
        description: "Your strategy has been saved to your vault.",
      });
    } catch (error) {
      console.error('Error saving strategy:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save strategy. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Update parameter value
  const updateParameter = (paramName: string, value: any) => {
    if (!generatedStrategy) return;
    
    setGeneratedStrategy({
      ...generatedStrategy,
      parameters: generatedStrategy.parameters.map(param => 
        param.name === paramName ? { ...param, value } : param
      )
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead 
        title="Strategy Builder - InsightFlow AI" 
        description="Build and backtest AI-powered trading strategies"
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Strategy Builder</h1>
            <p className="text-gray-400">Build, test, and deploy AI-powered trading strategies</p>
          </div>
          <div className="flex gap-2">
            {generatedStrategy && (
              <>
                <Button 
                  onClick={saveStrategy}
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Strategy
                </Button>
                <Button 
                  onClick={runBacktest}
                  disabled={isBacktesting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isBacktesting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isBacktesting ? 'Running...' : 'Backtest'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger value="builder" className="text-white data-[state=active]:bg-blue-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="strategy" disabled={!generatedStrategy} className="text-white data-[state=active]:bg-blue-600">
              <Code className="w-4 h-4 mr-2" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!backtestResult} className="text-white data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Strategy Prompt */}
              <div className="lg:col-span-2">
                <Card className="bg-black/20 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Describe Your Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Example: Give me a 15 EMA pullback strategy with RSI confirmation for 1-hour timeframe..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] bg-black/20 border-gray-600 text-white placeholder-gray-400"
                    />
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={generateStrategy}
                        disabled={isGenerating || !prompt.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isGenerating ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {isGenerating ? 'Generating...' : 'Generate Strategy'}
                      </Button>
                      
                      <div className="text-sm text-gray-400">
                        ⚡ Powered by GPT-4
                      </div>
                    </div>

                    {/* Sample Prompts */}
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-3">Sample prompts to get you started:</p>
                      <div className="flex flex-wrap gap-2">
                        {samplePrompts.map((sample, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setPrompt(sample)}
                            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            {sample}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Backtest Settings */}
              <div>
                <Card className="bg-black/20 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-400" />
                      Backtest Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Market</label>
                      <select
                        value={selectedMarket}
                        onChange={(e) => setSelectedMarket(e.target.value)}
                        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                      >
                        <option value="BTC/USD">BTC/USD</option>
                        <option value="ETH/USD">ETH/USD</option>
                        <option value="EUR/USD">EUR/USD</option>
                        <option value="GBP/USD">GBP/USD</option>
                        <option value="AAPL">AAPL</option>
                        <option value="TSLA">TSLA</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Timeframe</label>
                      <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                      >
                        <option value="5m">5 Minutes</option>
                        <option value="15m">15 Minutes</option>
                        <option value="1h">1 Hour</option>
                        <option value="4h">4 Hours</option>
                        <option value="1d">1 Day</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        Backtest Period: {backtestPeriod} days
                      </label>
                      <Slider
                        value={[backtestPeriod]}
                        onValueChange={(value) => setBacktestPeriod(value[0])}
                        max={365}
                        min={7}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Starting: $10,000
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Commission: 0.1%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            {generatedStrategy && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Strategy Details */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-black/20 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>{generatedStrategy.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">{generatedStrategy.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Timeframes</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedStrategy.timeframes.map(tf => (
                              <Badge key={tf} variant="secondary" className="text-xs">
                                {tf}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Markets</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedStrategy.markets.slice(0, 3).map(market => (
                              <Badge key={market} variant="secondary" className="text-xs">
                                {market}
                              </Badge>
                            ))}
                            {generatedStrategy.markets.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{generatedStrategy.markets.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strategy Logic */}
                  <Card className="bg-black/20 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Strategy Logic
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm text-gray-300 bg-black/40 p-4 rounded-lg overflow-x-auto">
                        {generatedStrategy.pseudocode}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                {/* Parameters Panel */}
                <div>
                  <Card className="bg-black/20 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Parameters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {generatedStrategy.parameters.map((param) => (
                        <div key={param.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">{param.name}</label>
                            <span className="text-sm text-blue-400">{param.value}</span>
                          </div>
                          
                          {param.type === 'number' && (
                            <Slider
                              value={[param.value]}
                              onValueChange={(value) => updateParameter(param.name, value[0])}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              className="w-full"
                            />
                          )}
                          
                          <p className="text-xs text-gray-400">{param.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {backtestResult && (
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Performance Metrics */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-black/20 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total P&L</span>
                        <span className={`font-medium ${backtestResult.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${backtestResult.total_pnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Win Rate</span>
                        <span className="font-medium text-white">{backtestResult.win_rate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Sharpe Ratio</span>
                        <span className="font-medium text-white">{backtestResult.sharpe_ratio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Max Drawdown</span>
                        <span className="font-medium text-red-400">{backtestResult.max_drawdown.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Profit Factor</span>
                        <span className="font-medium text-white">{backtestResult.profit_factor.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Trades</span>
                        <span className="font-medium text-white">{backtestResult.total_trades}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Trade Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Winners</span>
                        <span className="font-medium text-green-400">{backtestResult.winning_trades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Losers</span>
                        <span className="font-medium text-red-400">{backtestResult.losing_trades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Avg Win</span>
                        <span className="font-medium text-green-400">${backtestResult.avg_win.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Avg Loss</span>
                        <span className="font-medium text-red-400">${backtestResult.avg_loss.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Best Trade</span>
                        <span className="font-medium text-green-400">${backtestResult.largest_win.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Worst Trade</span>
                        <span className="font-medium text-red-400">${backtestResult.largest_loss.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Equity Curve */}
                <div className="lg:col-span-3">
                  <Card className="bg-black/20 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Equity Curve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <LineChart
                          data={backtestResult.equity_curve.map(point => ({
                            date: new Date(point.date).toLocaleDateString(),
                            value: point.equity
                          }))}
                          color="#3b82f6"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trade List */}
                  <Card className="bg-black/20 border-gray-700 text-white mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Recent Trades
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                          <div>Date</div>
                          <div>Symbol</div>
                          <div>Side</div>
                          <div>Entry</div>
                          <div>Exit</div>
                          <div>P&L</div>
                          <div>Return</div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {backtestResult.trade_list.map((trade) => (
                            <div 
                              key={trade.id}
                              className="grid grid-cols-7 gap-4 p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors text-sm"
                            >
                              <div className="text-gray-300">
                                {new Date(trade.entry_date).toLocaleDateString()}
                              </div>
                              <div className="text-white font-medium">{trade.symbol}</div>
                              <div>
                                <Badge className={`text-xs ${trade.side === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                  {trade.side.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-gray-300 font-mono">{trade.entry_price.toFixed(2)}</div>
                              <div className="text-gray-300 font-mono">{trade.exit_price.toFixed(2)}</div>
                              <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${trade.pnl.toFixed(2)}
                              </div>
                              <div className={`font-medium ${trade.return_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trade.return_pct >= 0 ? '+' : ''}{trade.return_pct.toFixed(2)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StrategyBuilderV3; 