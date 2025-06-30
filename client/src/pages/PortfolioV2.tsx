import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  DollarSign, TrendingUp, TrendingDown, Shield, Target, BarChart3, PieChart, 
  Activity, ArrowUpRight, ArrowDownRight, Calculator, AlertTriangle, CheckCircle
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';
import LineChart from '@/components/charts/LineChart';

interface PortfolioPosition {
  symbol: string;
  size: number;
  avg_price: number;
  current_price: number;
  pnl: number;
  pnl_percent: number;
  allocation_percent: number;
  risk_score: number;
}

interface RiskMetrics {
  portfolio_var: number;
  sharpe_ratio: number;
  max_drawdown: number;
  correlation_risk: number;
  concentration_risk: number;
  overall_risk_score: number;
}

const PortfolioV2 = () => {
  const { user } = useAuth();
  
  const [positions, setPositions] = useState<PortfolioPosition[]>([
    { symbol: 'BTC/USD', size: 0.5, avg_price: 42000, current_price: 43250, pnl: 625, pnl_percent: 2.98, allocation_percent: 35.2, risk_score: 8.5 },
    { symbol: 'ETH/USD', size: 5, avg_price: 2500, current_price: 2680, pnl: 900, pnl_percent: 7.2, allocation_percent: 28.1, risk_score: 7.8 },
    { symbol: 'EUR/USD', size: 10000, avg_price: 1.0850, current_price: 1.0875, pnl: 250, pnl_percent: 0.23, allocation_percent: 22.7, risk_score: 4.2 },
    { symbol: 'AAPL', size: 50, avg_price: 185, current_price: 192.75, pnl: 387.5, pnl_percent: 4.19, allocation_percent: 14.0, risk_score: 5.6 }
  ]);

  const [riskMetrics] = useState<RiskMetrics>({
    portfolio_var: 2.3,
    sharpe_ratio: 1.42,
    max_drawdown: 8.7,
    correlation_risk: 6.2,
    concentration_risk: 4.8,
    overall_risk_score: 6.8
  });

  const [portfolioValue] = useState(47850);
  const [totalPnL] = useState(2162.5);
  const [riskCapacity, setRiskCapacity] = useState([5000]);
  const [positionSizePercent, setPositionSizePercent] = useState([2]);

  const calculatePositionSize = (riskAmount: number, stopLossPercent: number, price: number) => {
    if (stopLossPercent === 0) return 0;
    return (riskAmount / (stopLossPercent / 100)) / price;
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-400';
    if (score <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLevel = (score: number) => {
    if (score <= 3) return 'Low';
    if (score <= 6) return 'Medium';
    return 'High';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead title="Portfolio Management - InsightFlow AI" description="Advanced portfolio analytics and risk management" />

      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
            <p className="text-gray-400">Advanced analytics and risk management tools</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />Overview
            </TabsTrigger>
            <TabsTrigger value="positions" className="text-white data-[state=active]:bg-blue-600">
              <PieChart className="w-4 h-4 mr-2" />Positions
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-white data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4 mr-2" />Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-white data-[state=active]:bg-blue-600">
              <Calculator className="w-4 h-4 mr-2" />Risk Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Portfolio Value</p>
                      <p className="text-2xl font-bold text-white">${portfolioValue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total P&L</p>
                      <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                      </p>
                    </div>
                    {totalPnL >= 0 ? <TrendingUp className="w-8 h-8 text-green-400" /> : <TrendingDown className="w-8 h-8 text-red-400" />}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Risk Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(riskMetrics.overall_risk_score)}`}>
                        {riskMetrics.overall_risk_score.toFixed(1)}/10
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Sharpe Ratio</p>
                      <p className="text-2xl font-bold text-white">{riskMetrics.sharpe_ratio.toFixed(2)}</p>
                    </div>
                    <Target className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <div key={position.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-blue-300 border-blue-500/50">
                            {position.symbol}
                          </Badge>
                          <span className="text-sm text-white">{position.allocation_percent.toFixed(1)}%</span>
                        </div>
                        <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full"
                            style={{ width: `${position.allocation_percent}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Max Drawdown</p>
                      <p className="text-lg font-bold text-red-400">{riskMetrics.max_drawdown.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Portfolio VaR</p>
                      <p className="text-lg font-bold text-orange-400">{riskMetrics.portfolio_var.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Correlation Risk</p>
                      <p className={`text-lg font-bold ${getRiskColor(riskMetrics.correlation_risk)}`}>
                        {getRiskLevel(riskMetrics.correlation_risk)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Concentration Risk</p>
                      <p className={`text-lg font-bold ${getRiskColor(riskMetrics.concentration_risk)}`}>
                        {getRiskLevel(riskMetrics.concentration_risk)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            <Card className="bg-black/20 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Current Positions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                    <div>Symbol</div>
                    <div>Size</div>
                    <div>Avg Price</div>
                    <div>Current Price</div>
                    <div>P&L</div>
                    <div>P&L %</div>
                    <div>Allocation</div>
                    <div>Risk Score</div>
                  </div>
                  
                  {positions.map((position) => (
                    <div key={position.symbol} className="grid grid-cols-8 gap-4 p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                      <div>
                        <Badge variant="outline" className="text-blue-300 border-blue-500/50">
                          {position.symbol}
                        </Badge>
                      </div>
                      <div className="text-white font-mono">{position.size}</div>
                      <div className="text-white font-mono">{position.avg_price.toLocaleString()}</div>
                      <div className="text-white font-mono">{position.current_price.toLocaleString()}</div>
                      <div className={`font-medium ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </div>
                      <div className={`font-medium ${position.pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.pnl_percent >= 0 ? '+' : ''}{position.pnl_percent.toFixed(2)}%
                      </div>
                      <div className="text-white">{position.allocation_percent.toFixed(1)}%</div>
                      <div className={`font-medium ${getRiskColor(position.risk_score)}`}>
                        {position.risk_score.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-300 font-medium">High Concentration Risk</p>
                    <p className="text-xs text-gray-300">BTC position exceeds 30% of portfolio</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-300 font-medium">Correlation Alert</p>
                    <p className="text-xs text-gray-300">BTC and ETH positions highly correlated</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-300 font-medium">Good Diversification</p>
                    <p className="text-xs text-gray-300">Forex positions provide good hedge</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Risk Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Market Risk', value: 7.2, max: 10 },
                    { label: 'Credit Risk', value: 2.1, max: 10 },
                    { label: 'Liquidity Risk', value: 4.8, max: 10 },
                    { label: 'Operational Risk', value: 3.2, max: 10 }
                  ].map((risk) => (
                    <div key={risk.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{risk.label}</span>
                        <span className={`text-sm font-medium ${getRiskColor(risk.value)}`}>
                          {risk.value.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            risk.value <= 3 ? 'bg-green-400' : 
                            risk.value <= 6 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${(risk.value / risk.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Position Size Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Risk Amount: ${riskCapacity[0]}
                    </label>
                    <Slider
                      value={riskCapacity}
                      onValueChange={setRiskCapacity}
                      max={10000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Position Size: {positionSizePercent[0]}% of portfolio
                    </label>
                    <Slider
                      value={positionSizePercent}
                      onValueChange={setPositionSizePercent}
                      max={20}
                      min={0.5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium text-blue-300 mb-2">Recommended Position Size</h4>
                    <p className="text-lg font-bold text-white">
                      ${(portfolioValue * (positionSizePercent[0] / 100)).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      Maximum risk: ${riskCapacity[0]} ({(riskCapacity[0] / portfolioValue * 100).toFixed(1)}% of portfolio)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Risk-Reward Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Entry Price</label>
                      <input 
                        type="number" 
                        placeholder="43250" 
                        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Stop Loss</label>
                      <input 
                        type="number" 
                        placeholder="42500" 
                        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Take Profit</label>
                      <input 
                        type="number" 
                        placeholder="44500" 
                        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Position Size</label>
                      <input 
                        type="number" 
                        placeholder="0.5" 
                        className="w-full p-2 bg-black/20 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Risk/Reward Ratio</p>
                        <p className="text-lg font-bold text-green-400">1:1.67</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Win Rate Needed</p>
                        <p className="text-lg font-bold text-white">37.5%</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply Risk Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PortfolioV2; 