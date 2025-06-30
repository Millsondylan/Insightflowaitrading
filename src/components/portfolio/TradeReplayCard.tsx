
import React from 'react';
import { Card } from '@/components/ui/card';

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

interface TradeReplayCardProps {
  trade: Trade;
}

export const TradeReplayCard: React.FC<TradeReplayCardProps> = ({ trade }) => {
  const isProfitable = trade.pnl > 0;
  
  return (
    <Card className="p-6 bg-black/30 border border-white/10 backdrop-blur-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{trade.symbol}</h3>
          <p className="text-sm text-white/60">
            {new Date(trade.entryTime).toLocaleDateString()} - {new Date(trade.exitTime).toLocaleDateString()}
          </p>
        </div>
        <div className={`text-right ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
          <p className="text-lg font-bold">${trade.pnl.toFixed(2)}</p>
          <p className="text-sm">R/R: {trade.rr.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-white/60">Entry Price</p>
          <p className="text-white font-mono">${trade.entryPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-white/60">Exit Price</p>
          <p className="text-white font-mono">${trade.exitPrice.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
