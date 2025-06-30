type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export function generateReplayTags(candles: Candle[]): {
  time: string;
  label: string;
  type: "entry" | "exit" | "volatility" | "emotional";
}[] {
  const tags = [];
  const first = candles[0];
  const last = candles[candles.length - 1];

  if (first) tags.push({ time: first.time, label: "🚀 Entry Point", type: "entry" });
  if (last) tags.push({ time: last.time, label: "🏁 Exit Point", type: "exit" });

  const spike = candles.find(c => c.high - c.low > c.open * 0.04);
  if (spike) tags.push({ time: spike.time, label: "⚠️ Volatility Spike", type: "volatility" });

  return tags;
} 