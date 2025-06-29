import React, { useState, useEffect, useMemo, useCallback } from 'react';

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
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ fontWeight: "700", color: "white" }}>{strategyName || 'Trade Replay'}</h3>
        <span >
          {currentIndex + 1} / {candles.length}
        </span>
      </div>

      <div >
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Chart loading...
        </div>
        {currentEvent && (
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-md text-white font-bold text-sm shadow-lg animate-pulse-once
              ${currentEvent.type === 'entry' ? 'bg-green-500/90' : 'bg-red-500/90'}`}
          >
            {currentEvent.type === 'entry' ? '🟢 ENTRY' : '🔴 EXIT'}
            {currentEvent.type === 'exit' && (
              <span >
                PnL: ${currentEvent.trade.pnl.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div style={{ width: "100%" }}>
          <div 
              
              style={{ width: `${progress}%` }}
          />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Button variant="ghost" size="icon" onClick={handleReset} title="Reset">
          <Repeat  />
        </Button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button variant="outline" size="icon" onClick={handlePrev} title="Previous Candle">
            <Rewind  />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePlayPause} >
            {isPlaying ? <Pause  /> : <Play  />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} title="Next Candle">
            <FastForward  />
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSpeed} title="Toggle Speed">
          <span style={{fontSize: '16px'}}>⚡</span>
        </Button>
      </div>
    </div>
  );
};

export default BacktestReplay; 