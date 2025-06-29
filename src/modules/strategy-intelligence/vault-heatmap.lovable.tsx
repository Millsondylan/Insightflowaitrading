import React, { useState, useEffect } from 'react';
import { HeatmapData, HeatmapCell, Strategy } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VaultHeatmapProps {
  strategyId: string;
  timeframe?: 'hourly' | 'daily' | 'weekly';
  metric?: 'winRate' | 'profitFactor' | 'expectancy' | 'volume';
  colorScale?: 'green-red' | 'blue-purple' | 'yellow-orange';
  showLabels?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
}

export const VaultHeatmap: React.FC<Vaultheatmapprops > = ({
  strategyId,
  timeframe = 'daily',
  metric = 'winRate',
  colorScale = 'green-red',
  showLabels = true,
  onCellClick
}) => {
  const [heatmapData, setHeatmapData] = useState<Heatmapdata  />(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<Heatmapcell >(null);

  // Generate color based on value and selected color scale
  const getColor = (value: number): string => {
    if (colorScale === 'green-red') {
      // Green to red scale (good to bad)
      if (value > 0.7) return 'rgba(0, 255, 0, 0.8)';
      if (value > 0.5) return 'rgba(144, 238, 144, 0.8)';
      if (value > 0.3) return 'rgba(255, 255, 0, 0.8)';
      if (value > 0.1) return 'rgba(255, 165, 0, 0.8)';
      return 'rgba(255, 0, 0, 0.8)';
    } else if (colorScale === 'blue-purple') {
      // Blue to purple scale
      if (value > 0.7) return 'rgba(0, 0, 255, 0.8)';
      if (value > 0.5) return 'rgba(65, 105, 225, 0.8)';
      if (value > 0.3) return 'rgba(138, 43, 226, 0.8)';
      if (value > 0.1) return 'rgba(186, 85, 211, 0.8)';
      return 'rgba(238, 130, 238, 0.8)';
    } else {
      // Yellow to orange scale
      if (value > 0.7) return 'rgba(255, 255, 0, 0.8)';
      if (value > 0.5) return 'rgba(255, 215, 0, 0.8)';
      if (value > 0.3) return 'rgba(255, 165, 0, 0.8)';
      if (value > 0.1) return 'rgba(255, 140, 0, 0.8)';
      return 'rgba(255, 69, 0, 0.8)';
    }
  };

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/strategies/${strategyId}/heatmap?timeframe=${timeframe}&metric=${metric}`);
        // const data = await response.json();
        
        // For now, generate mock data
        const mockData = generateMockHeatmapData(strategyId, timeframe);
        
        setHeatmapData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load heatmap data');
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [strategyId, timeframe, metric]);

  // Generate labels based on timeframe
  const getLabels = (): { xLabels: string[], yLabels: string[] } => {
    if (timeframe === 'hourly') {
      return {
        xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        yLabels: Array.from({ length: 24 }, (_, i) => `${i}:00`)
      };
    } else if (timeframe === 'daily') {
      return {
        xLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        yLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
      };
    } else {
      return {
        xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        yLabels: ['2020', '2021', '2022', '2023']
      };
    }
  };

  const { xLabels, yLabels } = getLabels();

  // Mock data generator
  const generateMockHeatmapData = (strategyId: string, timeframe: string): HeatmapData => {
    let rows = 0;
    let cols = 0;
    
    if (timeframe === 'hourly') {
      rows = 24; // 24 hours
      cols = 5;  // 5 weekdays
    } else if (timeframe === 'daily') {
      rows = 5;  // 5 weeks
      cols = 7;  // 7 days
    } else {
      rows = 4;  // 4 years
      cols = 12; // 12 months
    }
    
    const data: HeatmapCell[][] = [];
    
    for (let y = 0; y < rows; y++) {
      const row: HeatmapCell[] = [];
      for (let x = 0; x < cols; x++) {
        // Generate random performance value between 0 and 1
        const value = Math.random();
        // Generate random number of trades between 0 and 50
        const trades = Math.floor(Math.random() * 50);
        
        row.push({ x, y, value, trades });
      }
      data.push(row);
    }
    
    return {
      strategyId,
      timeframe,
      data
    };
  };

  if (loading) {
    return <Div className="flex justify-center items-center h-64">Loading heatmap data...</Vaultheatmapprops>;
  }

  if (error) {
    return <Div className="text-red-500 p-4">Error: {error}</Div>;
  }

  if (!heatmapData || !heatmapData.data.length) {
    return <Div className="p-4">No heatmap data available for this strategy.</Div>;
  }

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
  ]

  const getHeatmapColor = (performance: number): string => {
    if (performance > 0.7) return 'bg-green-600'
    if (performance > 0.5) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <Card  style={{ width: "100%" }}>
      <Cardheader  / /></Card /></Card /></Card>
        <Cardtitle  style={{ color: "white" }}>Strategy Performance Heatmap</Cardtitle />
      <Cardcontent >
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy) => (
            <Div key={strategy.id} 
              className={`p-4 rounded-lg ${getHeatmapColor(strategy.performance.winRate)} text-white`}
 >
              <H3 className="text-lg font-bold" /></Cardcontent /></Cardcontent />{strategy.name}</Cardtitle>
              <Div className="text-xs text-gray-300 mb-2">{strategy.description}</Div>
              <Div className="mt-2">
                <Div>Win Rate: {(strategy.performance.winRate * 100).toFixed(1)}%</Div>
                <Div>Profit Factor: {strategy.performance.profitFactor.toFixed(2)}</Div>
                <Div>Total Return: {strategy.performance.totalReturn}</Div>
                <Div>Max Drawdown: {(strategy.performance.maxDrawdown * 100).toFixed(1)}%</Div>
                <Div>Sharpe Ratio: {strategy.performance.sharpeRatio.toFixed(2)}</Div>
              </Div>
              <Div className="mt-2 flex space-x-2">
                {strategy.tags?.map((tag) => (
                  <Span key={tag} 
                    className="px-2 py-1 bg-black/30 rounded-full text-xs"
       ></Div>
                    {tag}
                  </Div>
                ))}
              </Div>
              <Div className="mt-2 text-xs text-gray-400">
                <Div>Author: {strategy.author}</Div>
                <Div>Version: {strategy.version}</Div>
                <Div>Created: {strategy.createdAt?.toLocaleDateString()}</Div>
              </Div>
            </Div>
          ))}
        </div />
    </Card>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['strategies', 'trades'],
  aiBlocks: ['strategyAnalysis'],
  functions: ['getHeatmapData', 'analyzeTimePatterns']
}; 