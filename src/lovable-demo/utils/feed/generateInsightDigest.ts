type Insight = {
  type: "market" | "strategy" | "mindset";
  title: string;
  summary: string;
  tone: "Analytical" | "Optimistic" | "Reflective" | "Cautionary";
};

export function generateInsightDigest(): Insight[] {
  return [
    {
      type: "market",
      title: "🔥 Volatility rising in crypto majors",
      summary: "BTC and ETH show increased range expansion—breakout setups are gaining traction.",
      tone: "Analytical",
    },
    {
      type: "strategy",
      title: "📌 Vault Highlight: 'Momentum Scalp'",
      summary: "Short-duration scalps using MA slope + RSI cross showing 67% win rate this week.",
      tone: "Optimistic",
    },
    {
      type: "mindset",
      title: "🧠 Daily Mindset Prompt",
      summary: "What would a 'disciplined version of you' *not* trade today?",
      tone: "Reflective",
    },
  ];
} 