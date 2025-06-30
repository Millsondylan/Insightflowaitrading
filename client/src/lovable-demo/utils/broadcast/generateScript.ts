type VaultInsight = { title: string; winRate: number };
type MarketInsight = { symbol: string; change: number };
type ReplayTag = { time: string; label: string };

type BroadcastSegment = {
  type: "vault" | "market" | "replay";
  title: string;
  script: string;
};

export function generateScript(
  vault: VaultInsight[],
  market: MarketInsight[],
  replay: ReplayTag[]
): BroadcastSegment[] {
  return [
    {
      type: "vault",
      title: "📘 Featured Strategy: 'Breakout Surfer'",
      script: "Breakout Surfer posted a 68% win rate this week—built on MA slope confirmation and pullback re-entries.",
    },
    {
      type: "market",
      title: "📊 BTC Flash Update",
      script: "Bitcoin is up 2.4% today with strong volume. Look for continuation setups above $31,000.",
    },
    {
      type: "replay",
      title: "🎬 Replay Tag: 'Volatility Spike'",
      script: "Tuesday's USD/JPY scalp showed a sharp reversal after a 4% wick—annotated as a volatility trap.",
    },
  ];
} 