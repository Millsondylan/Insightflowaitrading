type Ticker = { symbol: string; change: number; volume: number };
type Strategy = { id: string; title: string; tags: string[] };

export function generatePlan(
  tickers: Ticker[],
  strategies: Strategy[]
): { strategyId: string; symbol: string }[] {
  const plan: { strategyId: string; symbol: string }[] = [];
  const usedTickers = new Set<string>();
  const usedStrategies = new Set<string>();

  // Sort tickers by volume (higher volume = more liquid/reliable)
  const sortedTickers = [...tickers].sort((a, b) => b.volume - a.volume);

  for (const strategy of strategies) {
    if (plan.length >= 3) break;
    if (usedStrategies.has(strategy.id)) continue;

    let matchedTicker: Ticker | null = null;

    // Breakout strategies - look for strong positive momentum
    if (strategy.tags.some(tag => tag.toLowerCase().includes('breakout'))) {
      matchedTicker = sortedTickers.find(
        t => t.change > 2 && t.volume > 1000000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // Reversal strategies - look for oversold conditions
    else if (strategy.tags.some(tag => tag.toLowerCase().includes('reversal'))) {
      matchedTicker = sortedTickers.find(
        t => t.change < -2 && t.volume > 500000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // Momentum strategies - look for strong directional moves
    else if (strategy.tags.some(tag => tag.toLowerCase().includes('momentum'))) {
      matchedTicker = sortedTickers.find(
        t => Math.abs(t.change) > 1.5 && t.volume > 750000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // Scalping strategies - look for high volume with moderate moves
    else if (strategy.tags.some(tag => tag.toLowerCase().includes('scalp'))) {
      matchedTicker = sortedTickers.find(
        t => Math.abs(t.change) > 0.5 && Math.abs(t.change) < 2 && t.volume > 2000000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // Swing strategies - look for moderate moves with good volume
    else if (strategy.tags.some(tag => tag.toLowerCase().includes('swing'))) {
      matchedTicker = sortedTickers.find(
        t => Math.abs(t.change) > 1 && t.volume > 300000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // Volume strategies - prioritize high volume regardless of price change
    else if (strategy.tags.some(tag => tag.toLowerCase().includes('volume'))) {
      matchedTicker = sortedTickers.find(
        t => t.volume > 1500000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // Support/Resistance strategies - look for moderate moves that might test levels
    else if (strategy.tags.some(tag => 
      tag.toLowerCase().includes('support') || tag.toLowerCase().includes('resistance')
    )) {
      matchedTicker = sortedTickers.find(
        t => Math.abs(t.change) > 0.8 && Math.abs(t.change) < 3 && t.volume > 400000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // RSI strategies - look for potential overbought/oversold conditions
    else if (strategy.tags.some(tag => tag.toLowerCase().includes('rsi'))) {
      matchedTicker = sortedTickers.find(
        t => (t.change > 3 || t.change < -3) && t.volume > 600000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // MACD strategies - look for trending moves
    else if (strategy.tags.some(tag => tag.toLowerCase().includes('macd'))) {
      matchedTicker = sortedTickers.find(
        t => Math.abs(t.change) > 1.2 && t.volume > 500000 && !usedTickers.has(t.symbol)
      ) || null;
    }
    
    // Default matching - any reasonable move with good volume
    else {
      matchedTicker = sortedTickers.find(
        t => Math.abs(t.change) > 1 && t.volume > 500000 && !usedTickers.has(t.symbol)
      ) || null;
    }

    // If we found a match, add it to the plan
    if (matchedTicker) {
      plan.push({
        strategyId: strategy.id,
        symbol: matchedTicker.symbol
      });
      usedTickers.add(matchedTicker.symbol);
      usedStrategies.add(strategy.id);
    }
  }

  return plan;
} 