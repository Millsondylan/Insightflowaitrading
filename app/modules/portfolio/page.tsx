'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  RefreshCw,
  Settings,
  Plus,
  Eye,
  EyeOff,
  Download,
  Filter,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  pnl: number;
  pnlPercent: number;
  status: 'open' | 'closed' | 'pending';
  strategy?: string;
  notes?: string;
}

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

interface PortfolioStats {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayPnl: number;
  dayPnlPercent: number;
  winRate: number;
  totalTrades: number;
  avgTradeSize: number;
}

export default function PortfolioPage() {
  const router = useRouter();
  const [showBalances, setShowBalances] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data - in real app this would come from broker API
  const portfolioStats: PortfolioStats = {
    totalValue: 125430.50,
    totalPnl: 15430.50,
    totalPnlPercent: 14.03,
    dayPnl: 1250.75,
    dayPnlPercent: 1.01,
    winRate: 68.5,
    totalTrades: 156,
    avgTradeSize: 1250.00
  };

  const positions: Position[] = [
    {
      symbol: 'AAPL',
      quantity: 100,
      avgPrice: 145.50,
      currentPrice: 152.75,
      marketValue: 15275.00,
      unrealizedPnl: 725.00,
      unrealizedPnlPercent: 4.98,
      dayChange: 125.00,
      dayChangePercent: 0.82
    },
    {
      symbol: 'TSLA',
      quantity: 50,
      avgPrice: 240.00,
      currentPrice: 235.50,
      marketValue: 11775.00,
      unrealizedPnl: -225.00,
      unrealizedPnlPercent: -1.88,
      dayChange: -75.00,
      dayChangePercent: -0.63
    },
    {
      symbol: 'NVDA',
      quantity: 25,
      avgPrice: 480.00,
      currentPrice: 520.00,
      marketValue: 13000.00,
      unrealizedPnl: 1000.00,
      unrealizedPnlPercent: 8.33,
      dayChange: 250.00,
      dayChangePercent: 1.96
    }
  ];

  const recentTrades: Trade[] = [
    {
      id: '1',
      symbol: 'AAPL',
      side: 'buy',
      quantity: 50,
      price: 150.25,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      pnl: 125.00,
      pnlPercent: 1.66,
      status: 'closed',
      strategy: 'Breakout Momentum',
      notes: 'Strong volume breakout above resistance'
    },
    {
      id: '2',
      symbol: 'TSLA',
      side: 'sell',
      quantity: 25,
      price: 238.00,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      pnl: -150.00,
      pnlPercent: -2.52,
      status: 'closed',
      strategy: 'Mean Reversion',
      notes: 'Stopped out on support break'
    },
    {
      id: '3',
      symbol: 'NVDA',
      side: 'buy',
      quantity: 15,
      price: 515.00,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      pnl: 75.00,
      pnlPercent: 0.97,
      status: 'open',
      strategy: 'AI Momentum',
      notes: 'AI detected strong momentum signal'
    }
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  const filters = ['all', 'winners', 'losers', 'open', 'closed'];

  const filteredTrades = recentTrades.filter(trade => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'winners') return trade.pnl > 0;
    if (selectedFilter === 'losers') return trade.pnl < 0;
    if (selectedFilter === 'open') return trade.status === 'open';
    if (selectedFilter === 'closed') return trade.status === 'closed';
    return true;
  });

  const syncBrokerData = () => {
    // In real app, this would call broker API
    console.log('Syncing broker data...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <BarChart3 className="h-8 w-8 text-green-400 mr-3" />
              Portfolio & Trade Capture
            </h1>
            <p className="text-slate-300">Real-time portfolio tracking and trade management</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={syncBrokerData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Broker
            </button>
            <button
              onClick={() => router.push('/modules/portfolio/settings')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Value</span>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="text-slate-400 hover:text-white"
              >
                {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-2xl font-bold text-white">
              {showBalances ? `$${portfolioStats.totalValue.toLocaleString()}` : '****'}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">+{portfolioStats.totalPnlPercent}%</span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Day P&L</span>
            <div className="text-2xl font-bold text-white">
              ${portfolioStats.dayPnl.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">+{portfolioStats.dayPnlPercent}%</span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Win Rate</span>
            <div className="text-2xl font-bold text-white">{portfolioStats.winRate}%</div>
            <div className="text-slate-400 text-sm mt-1">
              {portfolioStats.totalTrades} trades
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Avg Trade</span>
            <div className="text-2xl font-bold text-white">
              ${portfolioStats.avgTradeSize.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm mt-1">
              Per trade
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Positions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Target className="h-6 w-6 text-blue-400 mr-2" />
                Current Positions
              </h2>
              <div className="flex items-center gap-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                  <Plus className="h-4 w-4 inline mr-1" />
                  New Trade
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left p-4 text-slate-300 font-medium">Symbol</th>
                      <th className="text-right p-4 text-slate-300 font-medium">Quantity</th>
                      <th className="text-right p-4 text-slate-300 font-medium">Avg Price</th>
                      <th className="text-right p-4 text-slate-300 font-medium">Current</th>
                      <th className="text-right p-4 text-slate-300 font-medium">Market Value</th>
                      <th className="text-right p-4 text-slate-300 font-medium">P&L</th>
                      <th className="text-right p-4 text-slate-300 font-medium">Day Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map(position => (
                      <tr key={position.symbol} className="border-t border-slate-700 hover:bg-slate-700/30">
                        <td className="p-4">
                          <div className="font-medium text-white">{position.symbol}</div>
                        </td>
                        <td className="p-4 text-right text-white">{position.quantity}</td>
                        <td className="p-4 text-right text-white">${position.avgPrice.toFixed(2)}</td>
                        <td className="p-4 text-right text-white">${position.currentPrice.toFixed(2)}</td>
                        <td className="p-4 text-right text-white">${position.marketValue.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <div className={`font-medium ${position.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${position.unrealizedPnl.toLocaleString()}
                          </div>
                          <div className={`text-xs ${position.unrealizedPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.unrealizedPnlPercent >= 0 ? '+' : ''}{position.unrealizedPnlPercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className={`font-medium ${position.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${position.dayChange.toLocaleString()}
                          </div>
                          <div className={`text-xs ${position.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.dayChangePercent >= 0 ? '+' : ''}{position.dayChangePercent.toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Trade History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Clock className="h-6 w-6 text-yellow-400 mr-2" />
                Recent Trades
              </h2>
              <button
                onClick={() => router.push('/modules/portfolio/trades')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View All
              </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade List */}
            <div className="space-y-3">
              {filteredTrades.map(trade => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules/portfolio/export')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <button
                  onClick={() => router.push('/modules/portfolio/analytics')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performance Analytics
                </button>
                <button
                  onClick={() => router.push('/modules/portfolio/alerts')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Set Alerts
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

  const getStatusIcon = () => {
    switch (trade.status) {
      case 'open': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/portfolio/trade/${trade.id}`)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            trade.side === 'buy' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {trade.side === 'buy' ? (
              <ArrowUpRight className="h-4 w-4 text-white" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <div className="font-medium text-white">{trade.symbol}</div>
            <div className="text-xs text-slate-400 capitalize">{trade.side}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div className="text-right">
            <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${trade.pnl.toLocaleString()}
            </div>
            <div className={`text-xs ${trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-400">
          {trade.quantity} @ ${trade.price.toFixed(2)}
        </div>
        <div className="text-slate-400">
          {trade.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {trade.strategy && (
        <div className="mt-2">
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {trade.strategy}
          </span>
        </div>
      )}
    </div>
  );
} 