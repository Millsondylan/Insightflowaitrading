export type DigestItemInput = {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  matchedStrategies: number;
};

/**
 * Generates a short, AI-like summary for a market ticker based on its performance data.
 * Uses conditional phrasing to create varied, contextual descriptions.
 */
export function generateDigestSummary(item: DigestItemInput): string {
  const { symbol, change, volume, matchedStrategies } = item;
  
  // Price movement descriptors
  const getPriceMovementPhrase = (change: number): string => {
    if (change > 3) return "rallying strongly";
    if (change > 2) return "breaking out";
    if (change > 1) return "gaining momentum";
    if (change > 0.5) return "showing modest gains";
    if (change > 0) return "up slightly";
    if (change > -0.5) return "dipping slightly";
    if (change > -1) return "showing modest losses";
    if (change > -2) return "declining";
    if (change > -3) return "dropping";
    return "falling sharply";
  };

  // Volume descriptors
  const getVolumePhrase = (volume: number): string => {
    if (volume > 100_000_000) return "strong volume";
    if (volume > 50_000_000) return "good volume";
    if (volume > 10_000_000) return "moderate volume";
    return "light volume";
  };

  // Strategy match descriptors
  const getStrategyPhrase = (count: number): string => {
    if (count > 3) return "multiple strategies aligned";
    if (count > 1) return `${count} matching strategies`;
    if (count === 1) return "one strategy match";
    return "";
  };

  // Additional context based on patterns
  const getContextualPhrase = (change: number, volume: number, strategies: number): string => {
    // High volume breakouts
    if (Math.abs(change) > 2 && volume > 50_000_000) {
      return change > 0 ? "with strong institutional interest" : "amid heavy selling pressure";
    }
    
    // Multiple strategy matches
    if (strategies > 2) {
      return "suggesting convergence of multiple technical setups";
    }
    
    // Consolidation patterns
    if (Math.abs(change) < 0.5 && strategies > 0) {
      return "in a consolidation pattern that aligns with current strategy filters";
    }
    
    // High volume but small moves
    if (volume > 75_000_000 && Math.abs(change) < 1) {
      return "with unusual volume suggesting potential setup development";
    }
    
    return "";
  };

  // Build the summary
  const pricePhrase = getPriceMovementPhrase(change);
  const volumePhrase = getVolumePhrase(volume);
  const strategyPhrase = getStrategyPhrase(matchedStrategies);
  const contextPhrase = getContextualPhrase(change, volume, matchedStrategies);
  
  // Template variations for more natural language
  const templates = [
    // Standard template
    () => {
      let summary = `${symbol} is ${pricePhrase}`;
      if (volumePhrase !== "light volume") summary += ` with ${volumePhrase}`;
      if (strategyPhrase) summary += ` and ${strategyPhrase}`;
      if (contextPhrase) summary += ` ${contextPhrase}`;
      return summary + ".";
    },
    
    // Strategy-focused template
    () => {
      if (matchedStrategies > 0) {
        let summary = `${symbol} shows ${strategyPhrase}`;
        summary += ` while ${pricePhrase}`;
        if (volumePhrase !== "light volume") summary += ` on ${volumePhrase}`;
        return summary + ".";
      }
      return templates[0]();
    },
    
    // Volume-focused template
    () => {
      if (volume > 75_000_000) {
        let summary = `${symbol} is ${pricePhrase} on ${volumePhrase}`;
        if (strategyPhrase) summary += `, with ${strategyPhrase}`;
        if (contextPhrase) summary += ` ${contextPhrase}`;
        return summary + ".";
      }
      return templates[0]();
    }
  ];
  
  // Choose template based on what's most significant
  let templateIndex = 0;
  if (matchedStrategies > 2) templateIndex = 1;
  else if (volume > 75_000_000) templateIndex = 2;
  
  const summary = templates[templateIndex]();
  
  // Ensure summary doesn't exceed reasonable length and clean up formatting
  return summary.replace(/\s+/g, ' ').trim();
} 