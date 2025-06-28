type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
};

export function parseStrategyPrompt(prompt: string): StrategyOutput {
  const lowerPrompt = prompt.toLowerCase();
  const rules: string[] = [];
  const checklist: string[] = [];
  let title = "Generated Strategy";

  // Entry conditions
  if (lowerPrompt.includes('breakout')) {
    rules.push("Price breaks above previous high");
    checklist.push("Confirm volume spike");
    title = "Breakout Strategy";
  }
  
  if (lowerPrompt.includes('rsi')) {
    if (lowerPrompt.includes('oversold') || lowerPrompt.includes('30')) {
      rules.push("RSI crosses above 30 (oversold recovery)");
    } else if (lowerPrompt.includes('overbought') || lowerPrompt.includes('70')) {
      rules.push("RSI crosses below 70 (overbought reversal)");
    } else {
      rules.push("RSI crosses above 50");
    }
    checklist.push("Check RSI divergence");
  }

  if (lowerPrompt.includes('moving average') || lowerPrompt.includes('ma cross')) {
    rules.push("Fast MA crosses above slow MA");
    checklist.push("Confirm trend direction on higher timeframe");
    title = "Moving Average Crossover Strategy";
  }

  if (lowerPrompt.includes('support') || lowerPrompt.includes('resistance')) {
    rules.push("Price bounces off support level");
    checklist.push("Identify key support/resistance zones");
    title = "Support/Resistance Strategy";
  }

  if (lowerPrompt.includes('macd')) {
    rules.push("MACD line crosses above signal line");
    checklist.push("Wait for MACD histogram confirmation");
  }

  // Exit conditions
  if (lowerPrompt.includes('stop loss') || lowerPrompt.includes('exit')) {
    rules.push("Exit at 2% stop loss or 3:1 risk-reward target");
  } else {
    rules.push("Exit at predetermined risk-reward ratio");
  }

  // Risk management
  if (lowerPrompt.includes('risk') || lowerPrompt.includes('position size')) {
    checklist.push("Calculate position size based on 1% account risk");
  }

  // Volume confirmation
  if (lowerPrompt.includes('volume')) {
    checklist.push("Confirm with above-average volume");
  }

  // Time-based filters
  if (lowerPrompt.includes('session') || lowerPrompt.includes('time')) {
    checklist.push("Trade only during active market hours");
  }

  // Default rules if none detected
  if (rules.length === 0) {
    rules.push("Entry condition not clearly specified");
    title = "Incomplete Strategy";
  }

  // Default checklist items
  if (checklist.length === 0) {
    checklist.push("Avoid trading during major news events");
  }

  return {
    title,
    rules,
    checklist,
  };
} 