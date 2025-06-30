
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface HeatmapData {
  strategyId: string;
  timeframe: string;
  data: HeatmapCell[][];
}

export interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  trades: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  risk: string;
  performance: {
    winRate: number;
    profitFactor: number;
    totalReturn: string;
    maxDrawdown: number;
    sharpeRatio: number;
    totalTrades: number;
    profitableTrades: number;
    averageTradeProfit: number;
    averageTradeDuration: number;
    expectancy: number;
    riskRewardRatio: number;
  };
  tags?: string[];
  author: string;
  createdAt: Date;
  updatedAt?: Date;
  version?: string;
  marketConditions?: string[];
  timeframe?: string;
  assets?: string[];
}

interface VaultHeatmapProps {
  strategyId: string;
  timeframe?: 'hourly' | 'daily' | 'weekly';
  metric?: 'winRate' | 'profitFactor' | 'expectancy' | 'volume';
  colorScale?: 'green-red' | 'blue-purple' | 'yellow-orange';
  showLabels?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
}

export const VaultHeatmap: React.FC<VaultHeatmapProps> = ({
  strategyId,
  timeframe = 'daily',
  metric = 'winRate',
  colorScale = 'green-red',
  showLabels = true,
  onCellClick
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock strategies for heatmap visualization
  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Momentum Trend',
      description: 'Trend following strategy targeting strong momentum stocks',
      risk: 'Low',
      performance: {
        winRate: 0.65,
        profitFactor: 2.3,
        totalReturn: '+24.5%',
        maxDrawdown: 0.15,
        sharpeRatio: 1.8,
        totalTrades: 120,
        profitableTrades: 78,
        averageTradeProfit: 0.5,
        averageTradeDuration: 5,
        expectancy: 0.4,
        riskRewardRatio: 2.5
      },
      tags: ['Trend Following', 'Long-Term'],
      author: 'AI Strategist',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20'),
      version: '1.2.0',
      marketConditions: ['Bull Market', 'Stable Volatility'],
      timeframe: 'Daily',
      assets: ['NASDAQ', 'S&P 500']
    },
    {
      id: '2',
      name: 'Volatility Breakout',
      description: 'Short-term strategy capitalizing on market volatility',
      risk: 'Medium',
      performance: {
        winRate: 0.55,
        profitFactor: 1.8,
        totalReturn: '+18.3%',
        maxDrawdown: 0.25,
        sharpeRatio: 1.2,
        totalTrades: 200,
        profitableTrades: 110,
        averageTradeProfit: 0.3,
        averageTradeDuration: 3,
        expectancy: 0.25,
        riskRewardRatio: 1.8
      },
      tags: ['Volatility', 'Short-Term'],
      author: 'Quant Team',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-10'),
      version: '1.1.0',
      marketConditions: ['High Volatility', 'Trending Market'],
      timeframe: 'Hourly',
      assets: ['Crypto', 'Forex']
    }
  ];

  const getHeatmapColor = (performance: number): string => {
    if (performance > 0.7) return 'bg-green-600';
    if (performance > 0.5) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Card className="w-full h-[600px] bg-black/80 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Strategy Performance Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`p-4 rounded-lg ${getHeatmapColor(strategy.performance.winRate)} text-white`}
            >
              <h3 className="text-lg font-bold">{strategy.name}</h3>
              <div className="text-xs text-gray-300 mb-2">{strategy.description}</div>
              <div className="mt-2">
                <div>Win Rate: {(strategy.performance.winRate * 100).toFixed(1)}%</div>
                <div>Profit Factor: {strategy.performance.profitFactor.toFixed(2)}</div>
                <div>Total Return: {strategy.performance.totalReturn}</div>
                <div>Max Drawdown: {(strategy.performance.maxDrawdown * 100).toFixed(1)}%</div>
                <div>Sharpe Ratio: {strategy.performance.sharpeRatio.toFixed(2)}</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {strategy.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-black/30 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <div>Author: {strategy.author}</div>
                <div>Version: {strategy.version}</div>
                <div>Created: {strategy.createdAt?.toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
