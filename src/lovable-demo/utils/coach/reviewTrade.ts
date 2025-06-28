export type Trade = {
  id: string;
  symbol: string;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  rr: number;
  notes?: string;
  strategyId?: string;
};

export type TradeReview = {
  summary: string;
  emotion: "Confident" | "Fearful" | "FOMO" | "Revenge" | "Disciplined";
  behaviors: string[];
  suggestions: string[];
};

export function reviewTrade(trade: Trade): TradeReview {
  const isWinning = trade.pnl > 0;
  const notes = trade.notes?.toLowerCase() || '';
  const behaviors: string[] = [];
  const suggestions: string[] = [];
  let emotion: TradeReview['emotion'] = 'Disciplined';
  let summary = '';

  // Calculate trade duration in hours
  const entryTime = new Date(trade.entryTime);
  const exitTime = new Date(trade.exitTime);
  const durationHours = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);

  // Analyze R:R ratio for insights
  const lowRR = trade.rr < 1;
  const highRR = trade.rr > 3;
  const veryShortTrade = durationHours < 0.5;
  const veryLongTrade = durationHours > 24;

  // Emotion detection from notes
  if (notes.includes('scared') || notes.includes('afraid') || notes.includes('nervous') || notes.includes('panic')) {
    emotion = 'Fearful';
  } else if (notes.includes('fomo') || notes.includes('chasing') || notes.includes('missed') || notes.includes('rushing')) {
    emotion = 'FOMO';
  } else if (notes.includes('revenge') || notes.includes('angry') || notes.includes('frustrated') || notes.includes('get back')) {
    emotion = 'Revenge';
  } else if (notes.includes('confident') || notes.includes('strong') || notes.includes('perfect') || notes.includes('easy')) {
    emotion = 'Confident';
  }

  // Behavioral pattern detection
  if (veryShortTrade && !isWinning) {
    behaviors.push('Premature exit');
    if (emotion === 'Disciplined') emotion = 'Fearful';
  }

  if (lowRR && isWinning) {
    behaviors.push('Cut profits short');
    behaviors.push('Ignored profit targets');
  }

  if (lowRR && !isWinning) {
    behaviors.push('Let losses run');
    if (emotion === 'Disciplined') emotion = 'Fearful';
  }

  if (veryLongTrade && !isWinning) {
    behaviors.push('Held losing position too long');
    behaviors.push('Ignored stop loss');
  }

  if (notes.includes('early') || notes.includes('too soon')) {
    behaviors.push('Premature exit');
  }

  if (notes.includes('late') || notes.includes('should have')) {
    behaviors.push('Delayed decision making');
  }

  if (notes.includes('plan') && notes.includes('changed')) {
    behaviors.push('Deviated from plan');
  }

  if (notes.includes('no plan') || notes.includes('impulse')) {
    behaviors.push('Traded without plan');
    if (emotion === 'Disciplined') emotion = 'FOMO';
  }

  // Generate summary based on analysis
  if (isWinning) {
    if (lowRR) {
      summary = `Profitable trade but exited early, missing potential gains.`;
    } else if (highRR) {
      summary = `Excellent execution with strong risk-reward ratio.`;
    } else {
      summary = `Solid winning trade with good risk management.`;
    }
  } else {
    if (lowRR) {
      summary = `Loss was controlled and within acceptable risk parameters.`;
    } else if (veryLongTrade) {
      summary = `Held losing position too long, amplifying the loss.`;
    } else {
      summary = `Trade didn't work out as planned but loss was managed.`;
    }
  }

  // Add context from notes if available
  if (notes.includes('breakout')) {
    summary = summary.replace('Trade', 'Breakout trade');
  } else if (notes.includes('reversal')) {
    summary = summary.replace('Trade', 'Reversal trade');
  } else if (notes.includes('scalp')) {
    summary = summary.replace('Trade', 'Scalp trade');
  }

  // Generate suggestions based on behaviors and emotions
  if (behaviors.includes('Premature exit')) {
    suggestions.push('Visualize the entire trade beforehand to resist emotional exits.');
    suggestions.push('Set alerts instead of watching price action constantly.');
  }

  if (behaviors.includes('Cut profits short')) {
    suggestions.push('Define profit targets before entry and stick to them.');
    suggestions.push('Consider scaling out at multiple levels instead of full exit.');
  }

  if (behaviors.includes('Let losses run')) {
    suggestions.push('Always define your stop loss before entering a trade.');
    suggestions.push('Practice accepting small losses to prevent large ones.');
  }

  if (behaviors.includes('Deviated from plan')) {
    suggestions.push('Revisit checklist before modifying open trades.');
    suggestions.push('Write down your plan and keep it visible during the trade.');
  }

  if (behaviors.includes('Traded without plan')) {
    suggestions.push('Never enter a trade without a complete plan.');
    suggestions.push('Use the Strategy Builder to formalize your approach.');
  }

  if (emotion === 'Fearful') {
    suggestions.push('Practice position sizing to reduce emotional stress.');
    suggestions.push('Consider paper trading to build confidence.');
  }

  if (emotion === 'FOMO') {
    suggestions.push('Wait for your setup instead of chasing moves.');
    suggestions.push('Keep a watchlist and be patient for opportunities.');
  }

  if (emotion === 'Revenge') {
    suggestions.push('Take a break after consecutive losses.');
    suggestions.push('Focus on process over profits to avoid emotional trading.');
  }

  // Default suggestions if none generated
  if (suggestions.length === 0) {
    if (isWinning) {
      suggestions.push('Great execution! Document what worked for future reference.');
    } else {
      suggestions.push('Review your entry criteria to improve setup quality.');
    }
    suggestions.push('Continue following your trading plan consistently.');
  }

  // Limit to 2 suggestions for clarity
  return {
    summary,
    emotion,
    behaviors,
    suggestions: suggestions.slice(0, 2)
  };
} 