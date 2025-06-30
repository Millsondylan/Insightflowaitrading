// TODO: implement vault detail view with strategy breakdown
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Strategy } from './types';

export const VaultDetail: React.FC = () => {
  // Mock strategy for detail view
  const strategy: Strategy = {
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
    version: '1.2.0'
  };

  return (
    <Card className="w-full bg-black/80 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle>{strategy.name} - Strategy Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Description</h3>
            <p className="text-gray-300">{strategy.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Performance Metrics</h4>
              <ul className="space-y-1 text-sm">
                <li>Win Rate: {(strategy.performance.winRate * 100).toFixed(1)}%</li>
                <li>Profit Factor: {strategy.performance.profitFactor.toFixed(2)}</li>
                <li>Total Return: {strategy.performance.totalReturn}</li>
                <li>Max Drawdown: {(strategy.performance.maxDrawdown * 100).toFixed(1)}%</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Strategy Metadata</h4>
              <ul className="space-y-1 text-sm">
                <li>Author: {strategy.author}</li>
                <li>Version: {strategy.version}</li>
                <li>Created: {strategy.createdAt?.toLocaleDateString()}</li>
                <li>Risk Level: {strategy.risk}</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tags</h4>
            <div className="flex space-x-2">
              {strategy.tags?.map((tag) => (
                <Span key={tag} 
                  className="px-2 py-1 bg-zinc-700 rounded-full text-xs"
               >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" className="text-white">Edit Strategy</Button>
            <Button variant="destructive">Delete Strategy</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 