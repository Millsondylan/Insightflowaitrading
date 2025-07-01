export type ParsedRule = {
  raw: string;
  type: "entry" | "exit" | "filter" | "unknown";
  timeframe?: string;
  indicators: string[];
  conditions: string[];
};

// Common trading timeframes
const TIMEFRAME_PATTERNS = [
  /\b(\d+)m(?:in)?(?:ute)?s?\b/i,  // 1m, 5min, 15minute, 30minutes
  /\b(\d+)h(?:our)?s?\b/i,         // 1h, 4hour, 24hours
  /\b(\d+)d(?:ay)?s?\b/i,          // 1d, 7days
  /\b(\d+)w(?:eek)?s?\b/i,         // 1w, 2weeks
  /\bM(\d+)\b/,                     // M5, M15, M30
  /\bH(\d+)\b/,                     // H1, H4
  /\bD(\d+)\b/,                     // D1
  /\b(daily|weekly|monthly|hourly|minute)\b/i
];

// Entry signal keywords
const ENTRY_KEYWORDS = [
  'enter', 'entry', 'buy', 'sell', 'long', 'short', 
  'open', 'position', 'trigger', 'signal', 'breakout', 
  'breakthrough', 'cross above', 'cross below', 'breaks above',
  'breaks below', 'when', 'if'
];

// Exit signal keywords
const EXIT_KEYWORDS = [
  'exit', 'close position', 'close trade', 'stop loss', 'stoploss', 'sl', 
  'take profit', 'takeprofit', 'tp', 'target', 
  'trailing stop', 'stop out', 'profit target'
];

// Common technical indicators
const INDICATOR_PATTERNS = [
  /\b(RSI|rsi)\b/,
  /\b(MACD|macd)\b/,
  /\b(EMA|ema)(\d+)?\b/,
  /\b(SMA|sma)(\d+)?\b/,
  /\b(MA|ma)(\d+)?\b/,
  /\b(BB|bollinger band[s]?)\b/i,
  /\b(ATR|atr)\b/,
  /\b(ADX|adx)\b/,
  /\b(VWAP|vwap)\b/,
  /\b(volume|vol)\b/i,
  /\b(OBV|obv)\b/,
  /\b(stochastic[s]?|stoch)\b/i,
  /\b(momentum|mom)\b/i,
  /\b(CCI|cci)\b/,
  /\b(williams? %r|%r)\b/i,
  /\b(pivot[s]? point[s]?)\b/i,
  /\b(support|resistance)\b/i,
  /\b(trend ?line[s]?)\b/i,
  /\b(channel[s]?)\b/i,
  /\b(fibonacci|fib)\b/i,
  /\b(breakout|breakdown)\b/i,
  /\b(divergence)\b/i,
  /\b(pattern[s]?)\b/i,
  /\b(candle(?:stick)?)\b/i,
  /\b(price action)\b/i,
  /\b(high|low|close|open)\b/i
];

// Condition patterns
const CONDITION_PATTERNS = [
  /\b(above|below|greater than|less than|crosses?|breaks?)\b/i,
  /\b(>|<|>=|<=|=)\b/,
  /\b(and|or|when|if|while|until)\b/i,
  /\b(confirm(?:ed|ation)?|valid(?:ate)?)\b/i,
  /\b(spike[s]?|surge[s]?|drop[s]?|fall[s]?)\b/i,
  /\b(bullish|bearish)\b/i,
  /\b(overbought|oversold)\b/i,
  /\b(convergence|divergence)\b/i
];

function extractTimeframe(rule: string): string | undefined {
  const ruleLower = rule.toLowerCase();
  
  // Check each timeframe pattern
  for (const pattern of TIMEFRAME_PATTERNS) {
    const match = rule.match(pattern);
    if (match) {
      const fullMatch = match[0];
      
      // Handle specific cases
      if (fullMatch.toLowerCase() === 'daily') return '1D';
      if (fullMatch.toLowerCase() === 'weekly') return '1W';
      if (fullMatch.toLowerCase() === 'monthly') return '1M';
      if (fullMatch.toLowerCase() === 'hourly') return '1H';
      if (fullMatch.toLowerCase() === 'minute') return '1m';
      
      // Handle numeric patterns
      if (match[1]) {
        const num = match[1];
        if (pattern.source.includes('min')) return `${num}m`;
        if (pattern.source.includes('hour')) return `${num}H`;
        if (pattern.source.includes('day')) return `${num}D`;
        if (pattern.source.includes('week')) return `${num}W`;
        if (pattern.source.startsWith('\\bM')) return `${num}m`;
        if (pattern.source.startsWith('\\bH')) return `${num}H`;
        if (pattern.source.startsWith('\\bD')) return `${num}D`;
      }
      
      return fullMatch.toUpperCase();
    }
  }
  
  return undefined;
}

function classifyRuleType(rule: string): ParsedRule['type'] {
  const ruleLower = rule.toLowerCase();
  
  // Check for entry keywords first (to catch "enter" before "close")
  for (const keyword of ENTRY_KEYWORDS) {
    if (ruleLower.includes(keyword.toLowerCase())) {
      return 'entry';
    }
  }
  
  // Check for exit keywords
  for (const keyword of EXIT_KEYWORDS) {
    if (ruleLower.includes(keyword.toLowerCase())) {
      return 'exit';
    }
  }
  
  // Special case: if rule mentions "close above" or "close below", it's likely entry
  if (/close\s+(above|below|over|under)/i.test(rule)) {
    return 'entry';
  }
  
  // If it contains indicators or conditions but no entry/exit keywords, it's likely a filter
  const hasIndicators = INDICATOR_PATTERNS.some(pattern => pattern.test(rule));
  const hasConditions = CONDITION_PATTERNS.some(pattern => pattern.test(rule));
  
  if (hasIndicators || hasConditions) {
    return 'filter';
  }
  
  return 'unknown';
}

function extractIndicators(rule: string): string[] {
  const indicators = new Set<string>();
  
  for (const pattern of INDICATOR_PATTERNS) {
    const matches = rule.match(new RegExp(pattern.source, pattern.flags + 'g'));
    if (matches) {
      matches.forEach(match => {
        // Normalize the indicator name
        let indicator = match.trim();
        
        // Handle special cases
        if (/\b(EMA|ema|SMA|sma|MA|ma)\d+\b/.test(indicator)) {
          // Keep the number with the moving average
          indicator = indicator.toUpperCase();
        } else {
          // General normalization
          indicator = indicator.toUpperCase()
            .replace(/\s+/g, ' ')
            .replace(/BAND[S]?$/i, 'BANDS')
            .replace(/^%/, 'WILLIAMS %');
        }
        
        indicators.add(indicator);
      });
    }
  }
  
  return Array.from(indicators);
}

function extractConditions(rule: string): string[] {
  const conditions: string[] = [];
  const segments = rule.split(/\b(and|or)\b/i);
  
  for (const segment of segments) {
    const trimmed = segment.trim();
    if (trimmed && trimmed.toLowerCase() !== 'and' && trimmed.toLowerCase() !== 'or') {
      // Check if this segment contains condition keywords or operators
      const hasCondition = CONDITION_PATTERNS.some(pattern => pattern.test(trimmed));
      if (hasCondition || /[<>=]/.test(trimmed)) {
        // Clean up the condition
        const condition = trimmed
          .replace(/^\s*,\s*/, '') // Remove leading commas
          .replace(/\s*,\s*$/, '') // Remove trailing commas
          .trim();
        
        if (condition) {
          conditions.push(condition);
        }
      }
    }
  }
  
  // If no conditions found but the rule has comparison operators, use the whole rule
  if (conditions.length === 0 && /[<>=]|above|below|greater|less/i.test(rule)) {
    conditions.push(rule.trim());
  }
  
  return conditions;
}

export function parseRules(rules: string[]): ParsedRule[] {
  return rules.map(rule => {
    const trimmedRule = rule.trim();
    
    return {
      raw: trimmedRule,
      type: classifyRuleType(trimmedRule),
      timeframe: extractTimeframe(trimmedRule),
      indicators: extractIndicators(trimmedRule),
      conditions: extractConditions(trimmedRule)
    };
  });
} 