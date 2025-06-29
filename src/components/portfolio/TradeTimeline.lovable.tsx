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
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  const sortedDates = Object.keys(groupedTrades).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div >
      {sortedDates.map(date => (
        <div key={date}>
          <h2 style={{ marginBottom: "16px" }}>
            {date}
          </h2>
          <div >
            {groupedTrades[date].map(trade => (
              <TradeReplayCard key={trade.id} trade={trade} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 