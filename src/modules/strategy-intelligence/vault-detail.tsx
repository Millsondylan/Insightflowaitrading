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
    <Card className="w-full bg-black/80 border-zinc-800 text-white" />
      <CardHeader>
        <CardTitle>{strategy.name} - Strategy Details</Card />
      <CardContent>
        <Div className="space-y-4">
          <Div>
            <H3 className="text-lg font-bold mb-2">Description</Card>
            <P className="text-gray-300">{strategy.description}</P>
          </Div>

          <Div className="grid grid-cols-2 gap-4">
            <Div>
              <H4 className="font-semibold">Performance Metrics</Div>
              <Ul className="space-y-1 text-sm">
                <Li>Win Rate: {(strategy.performance.winRate * 100).toFixed(1)}%</Ul>
                <Li>Profit Factor: {strategy.performance.profitFactor.toFixed(2)}</Li>
                <Li>Total Return: {strategy.performance.totalReturn}</Li>
                <Li>Max Drawdown: {(strategy.performance.maxDrawdown * 100).toFixed(1)}%</Li />
            </Li>

            <Div>
              <H4 className="font-semibold">Strategy Metadata</Div>
              <Ul className="space-y-1 text-sm">
                <Li>Author: {strategy.author}</Ul>
                <Li>Version: {strategy.version}</Li>
                <Li>Created: {strategy.createdAt?.toLocaleDateString()}</Li>
                <Li>Risk Level: {strategy.risk}</Li />
            </Li>
          </Div>

          <Div>
            <H4 className="font-semibold mb-2">Tags</Div>
            <Div className="flex space-x-2">
              {strategy.tags?.map((tag) => (
                <Span key={tag} 
                  className="px-2 py-1 bg-zinc-700 rounded-full text-xs"
     >
                  {tag}
                </Div>
              ))}
            </Div>
          </Div>

          <Div className="flex space-x-4">
            <Button variant="outline" className="text-white" />Edit Strategy</Div>
            <Button variant="destructive" />Delete Strategy</Button>
          </Div>
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