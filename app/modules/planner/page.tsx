'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Target, 
  Calculator,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  Clock,
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  Settings,
  CheckCircle,
  X
} from 'lucide-react';

interface TradePlan {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  positionSize: number;
  riskAmount: number;
  riskPercent: number;
  rewardRiskRatio: number;
  expectedReturn: number;
  notes: string;
  status: 'draft' | 'active' | 'executed' | 'cancelled';
  createdAt: Date;
  targetDate?: Date;
}

interface RiskMetrics {
  totalRisk: number;
  maxDrawdown: number;
  portfolioRisk: number;
  correlationRisk: number;
  sectorExposure: Record<string, number>;
}

export default function PlannerPage() {
  const router = useRouter();
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Mock data - in real app this would come from Supabase
  const tradePlans: TradePlan[] = [
    {
      id: '1',
      symbol: 'AAPL',
      direction: 'long',
      entryPrice: 150.00,
      stopLoss: 145.00,
      takeProfit: 160.00,
      positionSize: 100,
      riskAmount: 500.00,
      riskPercent: 1.0,
      rewardRiskRatio: 2.0,
      expectedReturn: 1000.00,
      notes: 'Breakout above key resistance with volume confirmation. Strong earnings expected.',
      status: 'active',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      symbol: 'TSLA',
      direction: 'short',
      entryPrice: 240.00,
      stopLoss: 245.00,
      takeProfit: 230.00,
      positionSize: 50,
      riskAmount: 250.00,
      riskPercent: 0.5,
      rewardRiskRatio: 2.0,
      expectedReturn: 500.00,
      notes: 'Bearish divergence on RSI. Support break expected.',
      status: 'draft',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      symbol: 'NVDA',
      direction: 'long',
      entryPrice: 520.00,
      stopLoss: 510.00,
      takeProfit: 550.00,
      positionSize: 25,
      riskAmount: 250.00,
      riskPercent: 0.5,
      rewardRiskRatio: 3.0,
      expectedReturn: 750.00,
      notes: 'AI momentum play. Strong institutional buying detected.',
      status: 'executed',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  const riskMetrics: RiskMetrics = {
    totalRisk: 1000.00,
    maxDrawdown: 5.2,
    portfolioRisk: 2.0,
    correlationRisk: 0.35,
    sectorExposure: {
      'Technology': 45,
      'Consumer Discretionary': 25,
      'Healthcare': 15,
      'Financials': 10,
      'Others': 5
    }
  };

  const portfolioValue = 50000; // Mock portfolio value

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400';
      case 'active': return 'text-blue-400';
      case 'executed': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'active': return <Target className="h-4 w-4" />;
      case 'executed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Target className="h-8 w-8 text-blue-400 mr-3" />
              Trade Planning & Risk Management
            </h1>
            <p className="text-slate-300">Plan trades with precision and manage risk effectively</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/modules/planner/new-plan')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Trade Plan
            </button>
            <button
              onClick={() => router.push('/modules/planner/risk-calculator')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Risk Calculator
            </button>
          </div>
        </div>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Risk</span>
              <button
                onClick={() => setShowRiskDetails(!showRiskDetails)}
                className="text-slate-400 hover:text-white"
              >
                {showRiskDetails ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-2xl font-bold text-white">
              ${riskMetrics.totalRisk.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm mt-1">
              {((riskMetrics.totalRisk / portfolioValue) * 100).toFixed(1)}% of portfolio
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Max Drawdown</span>
            <div className="text-2xl font-bold text-white">{riskMetrics.maxDrawdown}%</div>
            <div className="text-slate-400 text-sm mt-1">
              Potential loss
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Portfolio Risk</span>
            <div className="text-2xl font-bold text-white">{riskMetrics.portfolioRisk}%</div>
            <div className="text-slate-400 text-sm mt-1">
              Per trade
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-sm">Correlation Risk</span>
            <div className="text-2xl font-bold text-white">{riskMetrics.correlationRisk}</div>
            <div className="text-slate-400 text-sm mt-1">
              Portfolio correlation
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trade Plans */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Target className="h-6 w-6 text-blue-400 mr-2" />
                Trade Plans
              </h2>
              <div className="flex items-center gap-2">
                <select className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm">
                  <option>All Plans</option>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Executed</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {tradePlans.map(plan => (
                <TradePlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Risk Analysis & Tools */}
          <div className="space-y-6">
            {/* Risk Analysis */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                Risk Analysis
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Risk:</span>
                  <span className="text-white font-medium">${riskMetrics.totalRisk.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Loss:</span>
                  <span className="text-red-400 font-medium">${(riskMetrics.totalRisk * (riskMetrics.maxDrawdown / 100)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk per Trade:</span>
                  <span className="text-white font-medium">{riskMetrics.portfolioRisk}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(riskMetrics.totalRisk / portfolioValue) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400 text-center">
                  {((riskMetrics.totalRisk / portfolioValue) * 100).toFixed(1)}% of portfolio at risk
                </div>
              </div>
            </div>

            {/* Sector Exposure */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Sector Exposure</h2>
              <div className="space-y-3">
                {Object.entries(riskMetrics.sectorExposure).map(([sector, exposure]) => (
                  <div key={sector} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{sector}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${exposure}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm font-medium">{exposure}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Tools</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules/planner/position-sizer')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Position Sizer
                </button>
                <button
                  onClick={() => router.push('/modules/planner/risk-calculator')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Risk Calculator
                </button>
                <button
                  onClick={() => router.push('/modules/planner/backtest')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Backtest Plan
                </button>
              </div>
            </div>

            {/* Risk Alerts */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Risk Alerts</h2>
              <div className="space-y-3">
                <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="text-sm text-red-400 font-medium mb-1">High Correlation Risk</div>
                  <div className="text-xs text-slate-300">
                    Multiple tech positions may increase portfolio risk
                  </div>
                </div>
                <div className="p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                  <div className="text-sm text-yellow-400 font-medium mb-1">Position Size Warning</div>
                  <div className="text-xs text-slate-300">
                    AAPL position exceeds 3% risk limit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradePlanCard({ plan, isSelected, onSelect }: { plan: TradePlan; isSelected: boolean; onSelect: () => void }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400';
      case 'active': return 'text-blue-400';
      case 'executed': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'active': return <Target className="h-4 w-4" />;
      case 'executed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className={`bg-slate-800/50 border rounded-lg p-6 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-slate-800/70' 
          : 'border-slate-700 hover:border-slate-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{plan.symbol}</h3>
            <div className={`flex items-center gap-1 ${getStatusColor(plan.status)}`}>
              {getStatusIcon(plan.status)}
              <span className="text-sm capitalize">{plan.status}</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              plan.direction === 'long' 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {plan.direction.toUpperCase()}
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-3">{plan.notes}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-blue-400">{plan.rewardRiskRatio}:1</div>
          <div className="text-xs text-slate-400">R:R Ratio</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-slate-400 text-xs">Entry</div>
          <div className="text-white font-medium">${plan.entryPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Stop Loss</div>
          <div className="text-red-400 font-medium">${plan.stopLoss.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Take Profit</div>
          <div className="text-green-400 font-medium">${plan.takeProfit.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Risk</div>
          <div className="text-white font-medium">${plan.riskAmount.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Expected Return:</span>
          <span className="text-green-400 font-medium">${plan.expectedReturn.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/modules/planner/edit/${plan.id}`);
            }}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
          >
            <Save className="h-4 w-4 text-blue-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/modules/planner/execute/${plan.id}`);
            }}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
          >
            <Target className="h-4 w-4 text-green-400" />
          </button>
        </div>
      </div>
    </div>
  );
} 