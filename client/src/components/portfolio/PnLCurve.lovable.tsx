import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Trade = {
  id: string;
  symbol: string;
  entryTime: string;
  exitTime:string;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  rr: number;
  strategyId?: string;
};

type Props = {
  trades: Trade[];
};

export const PnLCurve = ({ trades }: Props) => {
  const data = trades.reduce((acc, trade, index) => {
    const cumulativePnl = (acc[index - 1]?.cumulativePnl || 0) + trade.pnl;
    acc.push({
      name: `Trade ${index + 1}`,
      pnl: trade.pnl,
      cumulativePnl: cumulativePnl,
    });
    return acc;
  }, [] as { name: string; pnl: number; cumulativePnl: number }[]);

  return (
    <div className="h-64 w-full bg-white/5 rounded-lg p-4">
      <Responsivecontainer width="100%" height="100%">
        <areachart />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Cartesiangrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)">
          <Xaxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)"/></div></div>
          <yaxis stroke="rgba(255, 255, 255, 0.5)">
          <Tooltip >
          <area type="monotone" dataKey="cumulativePnl" stroke="#8884d8" fill="url(#colorUv)" name="Cumulative PnL"/>
      </Tooltip>
    </div>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
