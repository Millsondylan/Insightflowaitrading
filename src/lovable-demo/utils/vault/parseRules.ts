export function parseRules(rules: string[]): {
  text: string;
  icon: string;
  tag?: string;
}[] {
  return rules.map(rule => {
    const lowerRule = rule.toLowerCase();
    
    // Technical Indicators
    if (lowerRule.includes('rsi') && (lowerRule.includes('>') && lowerRule.includes('70') || lowerRule.includes('overbought'))) {
      return { text: rule, icon: "📊", tag: "Overbought" };
    }
    if (lowerRule.includes('rsi') && (lowerRule.includes('<') && lowerRule.includes('30') || lowerRule.includes('oversold'))) {
      return { text: rule, icon: "📊", tag: "Oversold" };
    }
    if (lowerRule.includes('rsi')) {
      return { text: rule, icon: "📊", tag: "RSI Signal" };
    }
    
    if (lowerRule.includes('macd') && lowerRule.includes('cross')) {
      return { text: rule, icon: "⚡", tag: "MACD Cross" };
    }
    if (lowerRule.includes('macd')) {
      return { text: rule, icon: "⚡", tag: "MACD Signal" };
    }
    
    if (lowerRule.includes('moving average') || lowerRule.includes('ma ') || lowerRule.includes('ema')) {
      if (lowerRule.includes('cross') || lowerRule.includes('above') || lowerRule.includes('below')) {
        return { text: rule, icon: "〰️", tag: "MA Cross" };
      }
      return { text: rule, icon: "〰️", tag: "Moving Average" };
    }
    
    // Price Action Patterns
    if (lowerRule.includes('breakout') || lowerRule.includes('break above') || lowerRule.includes('break out')) {
      return { text: rule, icon: "📈", tag: "Breakout" };
    }
    if (lowerRule.includes('breakdown') || lowerRule.includes('break below') || lowerRule.includes('break down')) {
      return { text: rule, icon: "📉", tag: "Breakdown" };
    }
    
    if (lowerRule.includes('reversal') || lowerRule.includes('bounce') || lowerRule.includes('rejection')) {
      return { text: rule, icon: "🔄", tag: "Reversal" };
    }
    
    if (lowerRule.includes('support') && (lowerRule.includes('hold') || lowerRule.includes('bounce'))) {
      return { text: rule, icon: "🛡️", tag: "Support Hold" };
    }
    if (lowerRule.includes('support')) {
      return { text: rule, icon: "🛡️", tag: "Support Level" };
    }
    
    if (lowerRule.includes('resistance') && (lowerRule.includes('break') || lowerRule.includes('reject'))) {
      return { text: rule, icon: "🚧", tag: "Resistance Test" };
    }
    if (lowerRule.includes('resistance')) {
      return { text: rule, icon: "🚧", tag: "Resistance Level" };
    }
    
    // Volume Analysis
    if (lowerRule.includes('volume') && (lowerRule.includes('spike') || lowerRule.includes('surge') || lowerRule.includes('increase'))) {
      return { text: rule, icon: "📊", tag: "Volume Spike" };
    }
    if (lowerRule.includes('volume') && (lowerRule.includes('low') || lowerRule.includes('decrease'))) {
      return { text: rule, icon: "📊", tag: "Low Volume" };
    }
    if (lowerRule.includes('volume')) {
      return { text: rule, icon: "📊", tag: "Volume Signal" };
    }
    
    // Trend Analysis
    if (lowerRule.includes('uptrend') || lowerRule.includes('up trend') || (lowerRule.includes('trend') && lowerRule.includes('up'))) {
      return { text: rule, icon: "📈", tag: "Uptrend" };
    }
    if (lowerRule.includes('downtrend') || lowerRule.includes('down trend') || (lowerRule.includes('trend') && lowerRule.includes('down'))) {
      return { text: rule, icon: "📉", tag: "Downtrend" };
    }
    if (lowerRule.includes('sideways') || lowerRule.includes('consolidation') || lowerRule.includes('range')) {
      return { text: rule, icon: "↔️", tag: "Sideways" };
    }
    
    // Candlestick Patterns
    if (lowerRule.includes('doji') || lowerRule.includes('hammer') || lowerRule.includes('engulfing')) {
      return { text: rule, icon: "🕯️", tag: "Candlestick" };
    }
    
    // Time-based Rules
    if (lowerRule.includes('open') || lowerRule.includes('close') || lowerRule.includes('session')) {
      return { text: rule, icon: "⏰", tag: "Timing" };
    }
    
    // Risk Management
    if (lowerRule.includes('stop loss') || lowerRule.includes('sl ') || lowerRule.includes('stop-loss')) {
      return { text: rule, icon: "🛑", tag: "Stop Loss" };
    }
    if (lowerRule.includes('take profit') || lowerRule.includes('tp ') || lowerRule.includes('target')) {
      return { text: rule, icon: "🎯", tag: "Take Profit" };
    }
    if (lowerRule.includes('risk') || lowerRule.includes('position size')) {
      return { text: rule, icon: "⚖️", tag: "Risk Management" };
    }
    
    // Default case
    return { text: rule, icon: "📋", tag: undefined };
  });
} 