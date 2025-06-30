export function generateCopilotInsights(input: string): {
  summary: string;
  alert?: string;
  suggestion?: string;
}[] {
  const insights = [];
  const lowerInput = input.toLowerCase();

  // Breakout + MA strategy detection
  if (lowerInput.includes("breakout") && lowerInput.includes("ma")) {
    insights.push({
      summary: "This strategy uses a breakout above MA—momentum-based logic detected.",
      suggestion: "Consider confirming with volume or RSI to avoid fakeouts.",
    });
  }

  // Missing exit condition
  if (!lowerInput.includes("exit") && !lowerInput.includes("stop") && !lowerInput.includes("target")) {
    insights.push({
      summary: "No exit condition found.",
      alert: "Missing exit rule could result in undefined risk.",
      suggestion: "Add an exit trigger like 'close below MA' or 'RR > 2.0'.",
    });
  }

  // Risk management analysis
  if (!lowerInput.includes("stop loss") && !lowerInput.includes("risk")) {
    insights.push({
      summary: "No risk management detected.",
      alert: "Strategy lacks downside protection.",
      suggestion: "Define stop loss levels or position sizing rules.",
    });
  }

  // Volume confirmation
  if ((lowerInput.includes("breakout") || lowerInput.includes("momentum")) && !lowerInput.includes("volume")) {
    insights.push({
      summary: "Momentum strategy without volume confirmation.",
      suggestion: "Add volume filter to confirm genuine breakouts and avoid low-liquidity moves.",
    });
  }

  // RSI overbought/oversold without confirmation
  if (lowerInput.includes("rsi") && (lowerInput.includes("70") || lowerInput.includes("30"))) {
    insights.push({
      summary: "RSI extreme levels detected—counter-trend approach identified.",
      suggestion: "Consider adding price action confirmation or divergence analysis.",
    });
  }

  // Support/resistance without timeframe
  if ((lowerInput.includes("support") || lowerInput.includes("resistance")) && !lowerInput.includes("timeframe")) {
    insights.push({
      summary: "Support/resistance levels mentioned without timeframe context.",
      suggestion: "Specify which timeframe levels you're using (daily, weekly, etc.).",
    });
  }

  // Scalping without time constraints
  if (lowerInput.includes("scalp") && !lowerInput.includes("time") && !lowerInput.includes("session")) {
    insights.push({
      summary: "Scalping strategy detected.",
      suggestion: "Consider adding session filters (avoid low-liquidity periods).",
    });
  }

  // Multiple indicators without hierarchy
  const indicators = ["rsi", "macd", "ma", "bollinger", "stochastic"];
  const foundIndicators = indicators.filter(ind => lowerInput.includes(ind));
  if (foundIndicators.length > 2) {
    insights.push({
      summary: `Multiple indicators detected: ${foundIndicators.join(", ")}.`,
      alert: "Too many indicators may cause conflicting signals.",
      suggestion: "Prioritize 1-2 primary indicators and use others as confirmation only.",
    });
  }

  // Reversal strategy without confirmation
  if (lowerInput.includes("reversal") && !lowerInput.includes("confirmation") && !lowerInput.includes("divergence")) {
    insights.push({
      summary: "Reversal strategy without confirmation signals.",
      suggestion: "Add confirmation like candlestick patterns or momentum divergence.",
    });
  }

  // No position sizing mentioned
  if (!lowerInput.includes("position") && !lowerInput.includes("size") && !lowerInput.includes("%")) {
    insights.push({
      summary: "No position sizing rules specified.",
      suggestion: "Define position size based on account risk (e.g., 1-2% per trade).",
    });
  }

  // FOMO-prone language detection
  if (lowerInput.includes("always") || lowerInput.includes("never miss") || lowerInput.includes("every")) {
    insights.push({
      summary: "Absolute language detected in strategy description.",
      alert: "Avoid 'always' or 'never' in trading—markets are probabilistic.",
      suggestion: "Reframe with probability-based language and accept some missed opportunities.",
    });
  }

  // Default insight if no specific patterns found
  if (insights.length === 0) {
    insights.push({
      summary: "Strategy framework identified—basic structure looks reasonable.",
      suggestion: "Consider adding specific entry/exit criteria and risk management rules.",
    });
  }

  return insights;
} 