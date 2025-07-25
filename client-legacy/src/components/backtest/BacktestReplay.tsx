
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Rewind, FastForward, Repeat, Zap } from 'lucide-react';

// Assuming these types are available from your backtesting library
// If not, define them here.
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type SimulatedTrade = {
  entryIndex: number;
  exitIndex: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  outcome: "win" | "loss";
};

type Props = {
  candles: Candle[];
  trades: SimulatedTrade[];
  strategyName?: string;
};

const BacktestReplay = ({ candles, trades, strategyName }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // 500ms default

  const tradeEvents = useMemo(() => {
    const events = new Map<number, { type: 'entry' | 'exit'; trade: SimulatedTrade }>();
    trades.forEach(trade => {
      events.set(trade.entryIndex, { type: 'entry', trade });
      events.set(trade.exitIndex, { type: 'exit', trade });
    });
    return events;
  }, [trades]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= candles.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [candles.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(handleNext, speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, handleNext]);

  const handlePlayPause = () => setIsPlaying(prev => !prev);
  const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };
  const toggleSpeed = () => setSpeed(s => (s === 500 ? 250 : 500));

  const currentEvent = tradeEvents.get(currentIndex);
  const progress = (candles.length > 0) ? ((currentIndex + 1) / candles.length) * 100 : 0;

  return (
    <div className="rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">{strategyName || 'Trade Replay'}</h3>
        <span className="text-sm font-mono text-white/50">
          {currentIndex + 1} / {candles.length}
        </span>
      </div>

      <div className="relative">
        <div className="h-64 w-full bg-white/5 rounded-lg flex items-center justify-center text-white/40">
          Chart loading...
        </div>
        {currentEvent && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-md text-white font-bold text-sm shadow-lg animate-pulse-once
              ${currentEvent.type === 'entry' ? 'bg-green-500/90' : 'bg-red-500/90'}`}>
            {currentEvent.type === 'entry' ? '🟢 ENTRY' : '🔴 EXIT'}
            {currentEvent.type === 'exit' && (
              <span className="ml-2 font-mono">
                PnL: ${currentEvent.trade.pnl.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-1.5">
        <div 
          className="bg-glow-cyan h-1.5 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
       />
      </div>

      <div className="flex justify-between items-center gap-4 mt-4">
        <Button variant="ghost" size="icon" onClick={handleReset} title="Reset">
          <Repeat className="h-4 w-4"/>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} title="Previous Candle">
            <Rewind className="h-4 w-4"/>
          </Button>
          <Button variant="outline" size="icon" onClick={handlePlayPause} className="w-16">
            {isPlaying ? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4"/>}
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} title="Next Candle">
            <FastForward className="h-4 w-4"/>
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSpeed} title="Toggle Speed">
          <Zap className={`h-4 w-4 transition-colors ${speed === 250 ? 'text-glow-cyan' : ''}`}/>
        </Button>
      </div>
    </div>
  );
};

export default BacktestReplay;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
