import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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
    <div style={{ padding: "16px", border: "1px solid #374151" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: "700", color: "white" }}>{trade.symbol}</span>
          <span className={`ml-4 font-semibold ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${trade.pnl.toFixed(2)}
          </span>
          <span >R:R: {trade.rr.toFixed(2)}</span>
        </div>
        {trade.candles && trade.candles.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setShowReplay(!showReplay)}>
            {showReplay ? 'Hide' : 'Replay'}
          </Button>
        )}
      </div>

      {showReplay && trade.candles && (
        <div style={{ width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trade.candles}>
              <span style={{fontSize: '16px'}}>❌</span> new Date(time * 1000).toLocaleTimeString()} stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 10 }} />
              <YAxis domain={['dataMin', 'dataMax']} stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
              <ReferenceLine y={trade.entryPrice} label="Entry" stroke="green" strokeDasharray="3 3" />
              <ReferenceLine y={trade.exitPrice} label="Exit" stroke="red" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}; 