'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye,
  Play,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';

interface MarketInsight {
  id: string;
  symbol: string;
  type: 'breakout' | 'reversal' | 'continuation' | 'consolidation';
  timeframe: string;
  description: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  potentialReturn: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: string;
  volume: number;
  volatility: number;
}

interface TrendingTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export default function MarketsPage() {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState('4H');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock data - in real app this would come from AI analysis
  const marketInsights: MarketInsight[] = [
    {
      id: '1',
      symbol: 'EURUSD',
      type: 'breakout',
      timeframe: '4H',
      description: 'Price approaching key resistance at 1.0850 with increasing volume. RSI showing momentum building.',
      confidence: 85,
      riskLevel: 'medium',
      potentialReturn: 2.5,
      stopLoss: 1.0800,
      takeProfit: 1.0925,
      timestamp: '2024-01-15T10:30:00Z',
      volume: 1250000,
      volatility: 0.8
    },
    {
      id: '2',
      symbol: 'GBPJPY',
      type: 'reversal',
      timeframe: '1H',
      description: 'Double top formation at 185.50 with bearish divergence on RSI. Potential reversal setup.',
      confidence: 72,
      riskLevel: 'high',
      potentialReturn: 3.2,
      stopLoss: 186.00,
      takeProfit: 183.50,
      timestamp: '2024-01-15T09:15:00Z',
      volume: 890000,
      volatility: 1.2
    },
    {
      id: '3',
      symbol: 'USDJPY',
      type: 'continuation',
      timeframe: 'Daily',
      description: 'Strong uptrend continuation with price above all moving averages. Pullback to 20 EMA expected.',
      confidence: 78,
      riskLevel: 'low',
      potentialReturn: 1.8,
      stopLoss: 147.50,
      takeProfit: 149.80,
      timestamp: '2024-01-15T08:45:00Z',
      volume: 2100000,
      volatility: 0.6
    }
  ];

  const trendingTickers: TrendingTicker[] = [
    { symbol: 'EURUSD', price: 1.0845, change: 0.0025, changePercent: 0.23, volume: 1250000, marketCap: 0 },
    { symbol: 'GBPJPY', price: 185.20, change: -0.45, changePercent: -0.24, volume: 890000, marketCap: 0 },
    { symbol: 'USDJPY', price: 148.25, change: 0.35, changePercent: 0.24, volume: 2100000, marketCap: 0 },
    { symbol: 'AUDUSD', price: 0.6720, change: 0.0015, changePercent: 0.22, volume: 750000, marketCap: 0 },
    { symbol: 'USDCAD', price: 1.3450, change: -0.0020, changePercent: -0.15, volume: 680000, marketCap: 0 }
  ];

  const timeframes = ['1H', '4H', 'Daily', 'Weekly'];
  const setupTypes = ['all', 'breakout', 'reversal', 'continuation', 'consolidation'];

  const filteredInsights = marketInsights.filter(insight => {
    const matchesTimeframe = selectedTimeframe === 'all' || insight.timeframe === selectedTimeframe;
    const matchesType = selectedType === 'all' || insight.type === selectedType;
    return matchesTimeframe && matchesType;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breakout': return 'bg-blue-600';
      case 'reversal': return 'bg-purple-600';
      case 'continuation': return 'bg-green-600';
      case 'consolidation': return 'bg-orange-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
              Market & Setup Engine
            </h1>
            <p className="text-slate-300">AI-curated insights and market analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/modules/markets/planner')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Daily Planner
            </button>
            <button
              onClick={() => router.push('/modules/markets/broadcast')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Broadcast Mode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Market Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-2">Timeframe</label>
                  <div className="flex flex-wrap gap-2">
                    {timeframes.map(tf => (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedTimeframe === tf
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-2">Setup Type</label>
                  <div className="flex flex-wrap gap-2">
                    {setupTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Zap className="h-6 w-6 text-yellow-400 mr-2" />
                AI Market Insights
              </h2>
              {filteredInsights.map(insight => (
                <div key={insight.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-white">{insight.symbol}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(insight.type)}`}>
                        {insight.type.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">{insight.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">{insight.confidence}%</div>
                        <div className="text-xs text-slate-400">Confidence</div>
                      </div>
                      <div className={`text-sm font-medium ${getRiskColor(insight.riskLevel)}`}>
                        {insight.riskLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{insight.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-400">{insight.potentialReturn}%</div>
                      <div className="text-xs text-slate-400">Potential Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-400">{insight.stopLoss}</div>
                      <div className="text-xs text-slate-400">Stop Loss</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-400">{insight.takeProfit}</div>
                      <div className="text-xs text-slate-400">Take Profit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-400">{insight.volatility}</div>
                      <div className="text-xs text-slate-400">Volatility</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(insight.timestamp).toLocaleTimeString()}
                      </span>
                      <span>Vol: {insight.volume.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <BarChart3 className="h-4 w-4 text-green-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Play className="h-4 w-4 text-purple-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Trending Tickers & Quick Actions */}
          <div className="space-y-6">
            {/* Trending Tickers */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Globe className="h-5 w-5 text-blue-400 mr-2" />
                Trending Tickers
              </h2>
              <div className="space-y-3">
                {trendingTickers.map(ticker => (
                  <div key={ticker.symbol} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{ticker.symbol}</div>
                      <div className="text-sm text-slate-400">${ticker.price.toFixed(4)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${ticker.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                      </div>
                      <div className="text-sm text-slate-400">
                        {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules/strategy/create')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Create Strategy from Setup
                </button>
                <button
                  onClick={() => router.push('/modules/markets/scanner')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Market Scanner
                </button>
                <button
                  onClick={() => router.push('/modules/markets/correlations')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Correlation Matrix
                </button>
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Market Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Setups:</span>
                  <span className="text-white font-medium">{filteredInsights.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">High Confidence:</span>
                  <span className="text-green-400 font-medium">
                    {filteredInsights.filter(i => i.confidence >= 80).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Volatility:</span>
                  <span className="text-white font-medium">
                    {(filteredInsights.reduce((sum, i) => sum + i.volatility, 0) / filteredInsights.length).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Hours:</span>
                  <span className="text-white font-medium">24/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 