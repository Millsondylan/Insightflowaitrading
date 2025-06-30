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
    <Card  style={{ width: "100%", color: "white" }}>
      <Cardheader >
        <Cardtitle />{strategy.name} - Strategy Details</Card />
      <Cardcontent >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Description</Card>
            <p className="text-gray-300">{strategy.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Performance Metrics</div>
              <ul className="space-y-1 text-sm">
                <li>Win Rate: {(strategy.performance.winRate * 100).toFixed(1)}%</ul>
                <li>Profit Factor: {strategy.performance.profitFactor.toFixed(2)}</li>
                <li>Total Return: {strategy.performance.totalReturn}</li>
                <li>Max Drawdown: {(strategy.performance.maxDrawdown * 100).toFixed(1)}%</Li />
            </li>

            <div>
              <h4 className="font-semibold">Strategy Metadata</div>
              <ul className="space-y-1 text-sm">
                <li>Author: {strategy.author}</ul>
                <li>Version: {strategy.version}</li>
                <li>Created: {strategy.createdAt?.toLocaleDateString()}</li>
                <li>Risk Level: {strategy.risk}</Li />
            </li>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tags</div>
            <div className="flex space-x-2">
              {strategy.tags?.map((tag) => (
                <span key={tag} 
                  className="px-2 py-1 bg-zinc-700 rounded-full text-xs"
   /></div>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" style={{ color: "white" }}>Edit Strategy</div>
            <Button variant="destructive">Delete Strategy</button>
          </div>
        </div />
    </Card>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
