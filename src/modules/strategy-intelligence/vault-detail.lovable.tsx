// TODO: implement vault detail view with strategy breakdown
import React from 'react';
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
    <Card style={{ width: "100%", color: "white" }}>
      <CardHeader>
        <CardTitle>{strategy.name} - Strategy Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div >
          <div>
            <h3 style={{ fontWeight: "700" }}>Description</h3>
            <p >{strategy.description}</p>
          </div>

          <div >
            <div>
              <h4 >Performance Metrics</h4>
              <ul >
                <li>Win Rate: {(strategy.performance.winRate * 100).toFixed(1)}%</li>
                <li>Profit Factor: {strategy.performance.profitFactor.toFixed(2)}</li>
                <li>Total Return: {strategy.performance.totalReturn}</li>
                <li>Max Drawdown: {(strategy.performance.maxDrawdown * 100).toFixed(1)}%</li>
              </ul>
            </div>

            <div>
              <h4 >Strategy Metadata</h4>
              <ul >
                <li>Author: {strategy.author}</li>
                <li>Version: {strategy.version}</li>
                <li>Created: {strategy.createdAt?.toLocaleDateString()}</li>
                <li>Risk Level: {strategy.risk}</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 >Tags</h4>
            <div style={{ display: "flex" }}>
              {strategy.tags?.map((tag) => (
                <span 
                  key={tag} 
                  
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <Button variant="outline" style={{ color: "white" }}>Edit Strategy</Button>
            <Button variant="destructive">Delete Strategy</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 