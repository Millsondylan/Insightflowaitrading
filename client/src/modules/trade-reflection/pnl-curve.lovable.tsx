// TODO: implement PnL curve visualization
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PnLCurveProps {
  timeframe?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
}

export const PnLCurve: React.FC<pnLCurveProps> = ({ timeframe = '1M' }) => {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(timeframe);
  
  // Mock data - TODO: Connect to generatePnLCurve function
  const data = [
    { date: '2024-01-01', value: 100000, drawdown: 0 },
    { date: '2024-01-08', value: 102500, drawdown: -0.5 },
    { date: '2024-01-15', value: 104800, drawdown: -0.2 },
    { date: '2024-01-22', value: 103200, drawdown: -2.1 },
    { date: '2024-01-29', value: 107500, drawdown: 0 },
    { date: '2024-02-05', value: 109200, drawdown: -0.8 },
    { date: '2024-02-12', value: 112000, drawdown: 0 },
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">P&L Curve</Card>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <Button key={tf} 
              size="sm" 
              variant={selectedTimeframe === tf ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe(tf as any)}
            >
              {tf}
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <lineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
            <XAxis dataKey="date" stroke="#666"/>
            <YAxis stroke="#666" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: unknown) => [`$${value.toLocaleString()}`, 'Balance']} />
            <line type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={2} dot={false}/>
          </div />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Return</div>
          <p className="text-lg font-bold text-green-500">+12.0%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Max Drawdown</div>
          <p className="text-lg font-bold text-red-500">-2.1%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sharpe Ratio</div>
          <p className="text-lg font-bold">1.42</p>
        </div>
      </div />
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
