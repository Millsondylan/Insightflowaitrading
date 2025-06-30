type LessonChunk = {
  id: string;
  content: string;
};

export function generateLessonNarrator(chunk: LessonChunk): string {
  const content = chunk.content.toLowerCase();
  
  // Risk-Reward specific commentary
  if (content.includes("r:r") || content.includes("risk reward") || content.includes("risk-reward")) {
    return "🔍 Many traders overlook how powerful R:R can be. Pay close attention here.";
  }
  
  // Volume analysis commentary
  if (content.includes("volume")) {
    return "📈 Volume is often the hidden signal—do you know how to recognize the real surge?";
  }
  
  // Technical analysis patterns
  if (content.includes("support") || content.includes("resistance")) {
    return "🎯 Support and resistance levels are where the real psychology reveals itself.";
  }
  
  if (content.includes("breakout")) {
    return "🚀 Breakouts can be goldmines or traps—what separates the real ones from the fakes?";
  }
  
  if (content.includes("trend")) {
    return "📊 The trend is your friend, but knowing when it ends is your edge.";
  }
  
  // Risk management
  if (content.includes("stop loss") || content.includes("position size")) {
    return "🛡️ This is where fortunes are made or lost—risk management isn't optional.";
  }
  
  // Psychology and emotions
  if (content.includes("emotion") || content.includes("psychology") || content.includes("fear") || content.includes("greed")) {
    return "🧠 Your biggest enemy isn't the market—it's the trader in the mirror.";
  }
  
  // Entry and exit strategies
  if (content.includes("entry") || content.includes("exit")) {
    return "⏰ Timing is everything in trading—but how do you know when the moment is right?";
  }
  
  // Indicators and signals
  if (content.includes("rsi") || content.includes("macd") || content.includes("moving average")) {
    return "📡 Indicators tell stories, but are you listening to the right narrative?";
  }
  
  // Market conditions
  if (content.includes("volatile") || content.includes("choppy") || content.includes("sideways")) {
    return "🌊 Different market conditions require different approaches—adapt or get left behind.";
  }
  
  // Backtesting and strategy
  if (content.includes("backtest") || content.includes("strategy")) {
    return "🔬 Data doesn't lie, but it can mislead—what's your strategy really telling you?";
  }
  
  // Money management
  if (content.includes("profit") || content.includes("loss") || content.includes("pnl")) {
    return "💰 Profits and losses are just numbers—what matters is what you learn from them.";
  }
  
  // Time frames
  if (content.includes("timeframe") || content.includes("scalp") || content.includes("swing")) {
    return "⏳ Every timeframe tells a different story—which one are you reading?";
  }
  
  // Default reflective commentary
  return "💡 Take a moment to reflect—what's the most actionable takeaway from this section?";
} 