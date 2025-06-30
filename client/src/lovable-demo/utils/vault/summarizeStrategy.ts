type Strategy = {
  title: string;
  rules: string[];
  checklist: string[];
  warning?: string;
};

export function summarizeStrategy(strategy: Strategy): {
  summary: string;
  emotion: "Disciplined" | "Aggressive" | "Fearful" | "Neutral";
  suggestions: string[];
} {
  const allText = [...strategy.rules, ...strategy.checklist, strategy.warning || ''].join(' ').toLowerCase();
  
  // Analyze strategy focus
  const focuses = [];
  if (allText.includes('breakout') || allText.includes('break above') || allText.includes('break out')) {
    focuses.push('breakout entries');
  }
  if (allText.includes('reversal') || allText.includes('bounce') || allText.includes('rejection')) {
    focuses.push('reversal patterns');
  }
  if (allText.includes('trend') || allText.includes('moving average') || allText.includes('ma ')) {
    focuses.push('trend following');
  }
  if (allText.includes('support') || allText.includes('resistance')) {
    focuses.push('support/resistance levels');
  }
  if (allText.includes('volume') && (allText.includes('spike') || allText.includes('confirmation'))) {
    focuses.push('volume confirmation');
  }
  if (allText.includes('rsi') || allText.includes('macd') || allText.includes('indicator')) {
    focuses.push('technical indicators');
  }
  if (allText.includes('scalp') || allText.includes('quick') || allText.includes('fast')) {
    focuses.push('scalping');
  }
  if (allText.includes('swing') || allText.includes('daily') || allText.includes('weekly')) {
    focuses.push('swing trading');
  }

  // Generate summary
  let summary = "This strategy";
  if (focuses.length > 0) {
    if (focuses.length === 1) {
      summary += ` focuses on ${focuses[0]}`;
    } else if (focuses.length === 2) {
      summary += ` combines ${focuses[0]} with ${focuses[1]}`;
    } else {
      summary += ` uses multiple approaches including ${focuses.slice(0, 2).join(' and ')}`;
    }
  } else {
    summary += " uses a systematic approach to market entry";
  }

  // Add timing context
  if (allText.includes('session') || allText.includes('open') || allText.includes('close')) {
    summary += " with specific timing requirements";
  }
  
  // Add risk management context
  if (allText.includes('stop loss') || allText.includes('risk') || allText.includes('position size')) {
    summary += " and includes risk management protocols";
  }

  summary += ".";

  // Determine emotional tone
  let emotion: "Disciplined" | "Aggressive" | "Fearful" | "Neutral" = "Neutral";
  
  // Disciplined indicators
  const disciplinedCount = 
    (allText.includes('checklist') ? 1 : 0) +
    (allText.includes('confirmation') ? 1 : 0) +
    (allText.includes('wait') ? 1 : 0) +
    (allText.includes('patient') ? 1 : 0) +
    (allText.includes('systematic') ? 1 : 0) +
    (allText.includes('rule') ? 1 : 0) +
    (allText.includes('stop loss') ? 1 : 0) +
    (allText.includes('risk management') ? 1 : 0);

  // Aggressive indicators
  const aggressiveCount = 
    (allText.includes('immediately') ? 1 : 0) +
    (allText.includes('fast') ? 1 : 0) +
    (allText.includes('quick') ? 1 : 0) +
    (allText.includes('scalp') ? 1 : 0) +
    (allText.includes('high leverage') ? 1 : 0) +
    (allText.includes('all in') ? 1 : 0) +
    (allText.includes('maximum') ? 1 : 0);

  // Fearful indicators
  const fearfulCount = 
    (allText.includes('careful') ? 1 : 0) +
    (allText.includes('cautious') ? 1 : 0) +
    (allText.includes('avoid') ? 1 : 0) +
    (allText.includes('never') ? 1 : 0) +
    (allText.includes('warning') ? 1 : 0) +
    (allText.includes('dangerous') ? 1 : 0) +
    (strategy.warning ? 2 : 0);

  if (disciplinedCount >= 3) {
    emotion = "Disciplined";
  } else if (aggressiveCount >= 2) {
    emotion = "Aggressive";
  } else if (fearfulCount >= 2) {
    emotion = "Fearful";
  }

  // Generate suggestions
  const suggestions = [];
  
  // Risk management suggestions
  if (!allText.includes('stop loss') && !allText.includes('sl ')) {
    suggestions.push("Consider adding clear stop loss rules to manage downside risk.");
  }
  
  if (!allText.includes('take profit') && !allText.includes('target') && !allText.includes('tp ')) {
    suggestions.push("Define exit logic more clearly with specific profit targets.");
  }
  
  // Confirmation suggestions
  if (focuses.includes('breakout entries') && !allText.includes('volume')) {
    suggestions.push("Consider adding a volume confirmation filter for breakout entries.");
  }
  
  if (!allText.includes('time') && !allText.includes('session') && !allText.includes('market hours')) {
    suggestions.push("Consider adding time-based filters to avoid low-liquidity periods.");
  }
  
  // Volatility suggestions
  if (!allText.includes('volatility') && !allText.includes('atr') && focuses.includes('scalping')) {
    suggestions.push("Consider adding a volatility filter for better entry timing.");
  }
  
  // Market condition suggestions
  if (!allText.includes('trend') && !allText.includes('market condition')) {
    suggestions.push("Consider defining market conditions where this strategy works best.");
  }
  
  // Position sizing suggestions
  if (!allText.includes('position size') && !allText.includes('risk per trade')) {
    suggestions.push("Add position sizing rules based on account risk tolerance.");
  }
  
  // Limit to 2 suggestions max
  return {
    summary,
    emotion,
    suggestions: suggestions.slice(0, 2)
  };
} 