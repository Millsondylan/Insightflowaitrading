'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartLine, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  Play,
  BarChart3,
  Brain,
  Filter,
  Download
} from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  entryTime: string;
  exitTime: string;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  status: 'open' | 'closed' | 'cancelled';
  strategy: string;
  emotions: string[];
  mistakes: string[];
  lessons: string[];
  executionQuality: number;
  marketConditions: string;
}

interface TradeSession {
  id: string;
  date: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnL: number;
  winRate: number;
  avgReturn: number;
  maxDrawdown: number;
  emotionalState: string;
  energyLevel: number;
  focusScore: number;
}

export default function ReflectionPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedSymbol, setSelectedSymbol] = useState('all');

  // Mock data - in real app this would come from Supabase
  const trades: Trade[] = [
    {
      id: '1',
      symbol: 'EURUSD',
      type: 'long',
      entryPrice: 1.0845,
      exitPrice: 1.0875,
      entryTime: '2024-01-15T09:30:00Z',
      exitTime: '2024-01-15T11:45:00Z',
      quantity: 1.0,
      pnl: 30,
      pnlPercent: 0.28,
      status: 'closed',
      strategy: 'Breakout with RSI Filter',
      emotions: ['confident', 'focused'],
      mistakes: ['Entered slightly late'],
      lessons: ['Wait for stronger confirmation'],
      executionQuality: 85,
      marketConditions: 'Trending with good volume'
    },
    {
      id: '2',
      symbol: 'GBPJPY',
      type: 'short',
      entryPrice: 185.50,
      exitPrice: 184.80,
      entryTime: '2024-01-15T14:20:00Z',
      exitTime: '2024-01-15T16:30:00Z',
      quantity: 0.5,
      pnl: 35,
      pnlPercent: 0.38,
      status: 'closed',
      strategy: 'Mean Reversion Scalper',
      emotions: ['patient', 'disciplined'],
      mistakes: [],
      lessons: ['Good patience paid off'],
      executionQuality: 92,
      marketConditions: 'Ranging with clear levels'
    },
    {
      id: '3',
      symbol: 'USDJPY',
      type: 'long',
      entryPrice: 148.25,
      exitPrice: 147.90,
      entryTime: '2024-01-16T08:15:00Z',
      exitTime: '2024-01-16T09:45:00Z',
      quantity: 1.0,
      pnl: -35,
      pnlPercent: -0.24,
      status: 'closed',
      strategy: 'Trend Following',
      emotions: ['frustrated', 'impatient'],
      mistakes: ['Ignored stop loss', 'Revenge trading'],
      lessons: ['Always respect stop loss', 'Don\'t chase losses'],
      executionQuality: 45,
      marketConditions: 'Volatile with news impact'
    }
  ];

  const sessions: TradeSession[] = [
    {
      id: '1',
      date: '2024-01-15',
      totalTrades: 2,
      winningTrades: 2,
      losingTrades: 0,
      totalPnL: 65,
      winRate: 100,
      avgReturn: 0.33,
      maxDrawdown: 0,
      emotionalState: 'confident',
      energyLevel: 8,
      focusScore: 9
    },
    {
      id: '2',
      date: '2024-01-16',
      totalTrades: 1,
      winningTrades: 0,
      losingTrades: 1,
      totalPnL: -35,
      winRate: 0,
      avgReturn: -0.24,
      maxDrawdown: 35,
      emotionalState: 'frustrated',
      energyLevel: 4,
      focusScore: 3
    }
  ];

  const periods = ['1d', '7d', '30d', '90d'];
  const symbols = ['all', 'EURUSD', 'GBPJPY', 'USDJPY', 'AUDUSD'];

  const filteredTrades = trades.filter(trade => {
    const matchesSymbol = selectedSymbol === 'all' || trade.symbol === selectedSymbol;
    return matchesSymbol;
  });

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winRate = filteredTrades.length > 0 
    ? (filteredTrades.filter(t => t.pnl > 0).length / filteredTrades.length) * 100 
    : 0;
  const avgExecutionQuality = filteredTrades.length > 0
    ? filteredTrades.reduce((sum, trade) => sum + trade.executionQuality, 0) / filteredTrades.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <ChartLine className="h-8 w-8 text-purple-400 mr-3" />
              Trade Reflection & Coaching
            </h1>
            <p className="text-slate-300">Visual trade timelines, PnL metrics, and AI coaching</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/modules/reflection/replay')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Trade Replay
            </button>
            <button
              onClick={() => router.push('/modules/reflection/coach')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Coach
            </button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Period Filter */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-white mb-2">Time Period</label>
            <div className="flex flex-wrap gap-2">
              {periods.map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Symbol Filter */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-white mb-2">Symbol</label>
            <div className="flex flex-wrap gap-2">
              {symbols.map(symbol => (
                <button
                  key={symbol}
                  onClick={() => setSelectedSymbol(symbol)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSymbol === symbol
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Total PnL */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${totalPnL.toFixed(2)}
              </div>
              <div className="text-sm text-slate-400">Total PnL</div>
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{winRate.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Win Rate</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trade Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trade Timeline */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                Trade Timeline
              </h2>
              <div className="space-y-4">
                {filteredTrades.map(trade => (
                  <TradeCard key={trade.id} trade={trade} />
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-green-400 mr-2" />
                Performance Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{filteredTrades.length}</div>
                  <div className="text-xs text-slate-400">Total Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">
                    {filteredTrades.filter(t => t.pnl > 0).length}
                  </div>
                  <div className="text-xs text-slate-400">Winning Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-400">
                    {filteredTrades.filter(t => t.pnl < 0).length}
                  </div>
                  <div className="text-xs text-slate-400">Losing Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-400">
                    {avgExecutionQuality.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-400">Avg Execution</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Coaching & Insights */}
          <div className="space-y-6">
            {/* AI Coach Insights */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Brain className="h-5 w-5 text-yellow-400 mr-2" />
                AI Coach Insights
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-green-400">Strengths</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Your patience and discipline in the GBPJPY trade was excellent. You waited for the perfect setup.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-red-400">Areas for Improvement</div>
                      <div className="text-xs text-slate-300 mt-1">
                        The USDJPY trade shows emotional trading patterns. Consider taking a break after losses.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-400">Recommendations</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Focus on risk management. Consider reducing position size during volatile periods.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emotional Patterns */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Emotional Patterns</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Confidence Level:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-white text-sm">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Discipline Score:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-white text-sm">60%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Risk Management:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-white text-sm">40%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules/reflection/replay')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Replay Latest Trade
                </button>
                <button
                  onClick={() => router.push('/modules/journal/new')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Write Reflection
                </button>
                <button
                  onClick={() => router.push('/modules/reflection/export')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeCard({ trade }: { trade: Trade }) {
  const router = useRouter();

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/reflection/trade/${trade.id}`)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-white">{trade.symbol}</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            trade.type === 'long' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {trade.type.toUpperCase()}
          </span>
          <span className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${trade.pnl.toFixed(2)} ({trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium text-white">{trade.executionQuality}%</div>
            <div className="text-xs text-slate-400">Execution</div>
          </div>
          <Eye className="h-4 w-4 text-blue-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
        <div>
          <span className="text-slate-400">Entry:</span>
          <span className="text-white ml-1">{trade.entryPrice}</span>
        </div>
        <div>
          <span className="text-slate-400">Exit:</span>
          <span className="text-white ml-1">{trade.exitPrice}</span>
        </div>
        <div>
          <span className="text-slate-400">Duration:</span>
          <span className="text-white ml-1">
            {Math.round((new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) / (1000 * 60))}m
          </span>
        </div>
        <div>
          <span className="text-slate-400">Strategy:</span>
          <span className="text-white ml-1">{trade.strategy}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {trade.emotions.map(emotion => (
          <span key={emotion} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
            {emotion}
          </span>
        ))}
        {trade.mistakes.length > 0 && (
          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">
            {trade.mistakes.length} mistake{trade.mistakes.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
} 