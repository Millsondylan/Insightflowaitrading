type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export function sliceCandlesBetween(
  candles: Candle[],
  startTime: string,
  endTime: string
): Candle[] {
  return candles.filter(c => c.time >= startTime && c.time <= endTime);
} 