import { OHLCV } from './sampleData';
import { Trade } from './runBacktest';

export interface ChartDataPoint {
  time: number;
  timestamp: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface TradeMarker {
  time: number;
  timestamp: string;
  price: number;
  type: 'entry' | 'exit';
  tradeId: number;
  pnl?: number;
  pnlPercentage?: number;
}

export interface ChartSeries {
  priceData: ChartDataPoint[];
  tradeMarkers: TradeMarker[];
}

/**
 * Transforms OHLCV candles and trade data into a format suitable for charting
 */
export function toChartSeries(candles: OHLCV[], trades: Trade[]): ChartSeries {
  // Convert candles to chart-friendly format
  const priceData: ChartDataPoint[] = candles.map((candle) => ({
    time: candle.time,
    timestamp: new Date(candle.time * 1000).toISOString(),
    price: candle.close,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume,
  }));

  // Create markers for trade entries and exits
  const tradeMarkers: TradeMarker[] = [];
  
  trades.forEach((trade, index) => {
    // Entry marker
    tradeMarkers.push({
      time: trade.entryTime,
      timestamp: new Date(trade.entryTime * 1000).toISOString(),
      price: trade.entryPrice,
      type: 'entry',
      tradeId: index + 1,
    });
    
    // Exit marker
    tradeMarkers.push({
      time: trade.exitTime,
      timestamp: new Date(trade.exitTime * 1000).toISOString(),
      price: trade.exitPrice,
      type: 'exit',
      tradeId: index + 1,
      pnl: trade.pnl,
      pnlPercentage: trade.pnlPercentage,
    });
  });

  return {
    priceData,
    tradeMarkers,
  };
}

/**
 * Finds the nearest candle time for a given timestamp
 * Useful for highlighting the candle corresponding to a trade
 */
export function findNearestCandleIndex(candles: OHLCV[], timestamp: number): number {
  return candles.findIndex((candle, i) => {
    if (i === candles.length - 1) return true;
    return candle.time <= timestamp && candles[i + 1].time > timestamp;
  });
} 