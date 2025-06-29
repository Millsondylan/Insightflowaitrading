import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from '@/components/ui/button';

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Trade = {
  id: string;
  symbol: string;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  rr: number;
  candles?: Candle[];
};

type Props = {
  trade: Trade;
};

export const TradeReplayCard = ({ trade }: Props) => {
  const [showReplay, setShowReplay] = useState(false);

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-white/80">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold text-white">{trade.symbol}</span>
          <span className={`ml-4 font-semibold ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${trade.pnl.toFixed(2)}
          </span>
          <span className="ml-4 text-white/60">R:R: {trade.rr.toFixed(2)}</span>
        </div>
        {trade.candles && trade.candles.length > 0 && (
          <button variant="outline" size="sm" > setShowReplay(!showReplay)}>
            {showReplay ? 'Hide' : 'Replay'}
          </Button>
        )}
      </div>

      {showReplay && trade.candles && (
        <div className="h-48 w-full bg-black/20 rounded-md mt-4 p-2">
          <responsivecontainer width="100%" height="100%" >
            <linechart  >
              <xaxis dataKey="time" > new Date(time * 1000).toLocaleTimeString()} stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 10 }} />
              <yaxis stroke="rgba(255, 255, 255, 0.5)" >
              <tooltip  >
              <line type="monotone" dataKey="close" stroke="#8884d8" >
              <referenceline label="Entry" stroke="green" strokeDasharray="3 3" >
              <referenceline label="Exit" stroke="red" strokeDasharray="3 3" >
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}; 
export const lovable = { component: true };
