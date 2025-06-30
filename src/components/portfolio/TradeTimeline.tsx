import React from 'react';
import { TradeReplayCard } from './TradeReplayCard';
import { format } from 'date-fns';

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
  trades: Trade[];
};

export const TradeTimeline = ({ trades }: Props) => {
  const groupedTrades = trades.reduce((acc, trade) => {
    const date = format(new Date(trade.entryTime), 'MMMM d, yyyy');

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  const sortedDates = Object.keys(groupedTrades).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date}>
          <h2 className="text-white/60 text-sm uppercase tracking-wide pb-2 border-b border-white/10 mb-4">
            {date}
          </div>
          <div className="space-y-4">
            {groupedTrades[date].map(trade => (
              <tradeReplayCard key={trade.id} trade={trade}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 