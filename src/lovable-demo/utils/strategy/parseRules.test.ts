import { parseRules, ParsedRule } from './parseRules';

// Test cases to demonstrate the parser functionality
const testCases = [
  {
    name: "Basic Entry/Exit/Filter Rules",
    rules: [
      "Enter on 1H close above breakout range",
      "RSI > 60 and volume spike",
      "Stop loss below previous low"
    ]
  },
  {
    name: "Complex Timeframe Detection",
    rules: [
      "Wait for 15min candle confirmation",
      "Daily RSI crosses above 70",
      "Exit when 4H MACD shows divergence",
      "Check weekly trend before entry"
    ]
  },
  {
    name: "Multiple Indicators",
    rules: [
      "EMA20 crosses above EMA50 on 1H chart",
      "MACD histogram turns positive with volume surge",
      "Bollinger Bands squeeze with RSI oversold",
      "Price breaks above VWAP and pivot point"
    ]
  },
  {
    name: "Various Condition Types",
    rules: [
      "Enter long when price > resistance and ADX > 25",
      "Exit if momentum drops below zero or RSI < 30",
      "Confirm breakout with volume spike and bullish candle",
      "Take profit at fibonacci 1.618 extension"
    ]
  }
];

// Run tests and display results
export function runParseRulesTests() {
  console.log("=== Parse Rules Test Results ===\n");
  
  testCases.forEach(testCase => {
    console.log(`Test Case: ${testCase.name}`);
    console.log("─".repeat(50));
    
    const parsedRules = parseRules(testCase.rules);
    
    parsedRules.forEach((parsed, index) => {
      console.log(`\nRule ${index + 1}: "${parsed.raw}"`);
      console.log(`  Type: ${parsed.type}`);
      if (parsed.timeframe) {
        console.log(`  Timeframe: ${parsed.timeframe}`);
      }
      if (parsed.indicators.length > 0) {
        console.log(`  Indicators: ${parsed.indicators.join(', ')}`);
      }
      if (parsed.conditions.length > 0) {
        console.log(`  Conditions:`);
        parsed.conditions.forEach(condition => {
          console.log(`    - ${condition}`);
        });
      }
    });
    
    console.log("\n");
  });
}

// Example usage in a component
export function getStrategyBreakdown(rules: string[]): {
  entryRules: ParsedRule[];
  exitRules: ParsedRule[];
  filterRules: ParsedRule[];
  unknownRules: ParsedRule[];
} {
  const parsed = parseRules(rules);
  
  return {
    entryRules: parsed.filter(r => r.type === 'entry'),
    exitRules: parsed.filter(r => r.type === 'exit'),
    filterRules: parsed.filter(r => r.type === 'filter'),
    unknownRules: parsed.filter(r => r.type === 'unknown')
  };
}

// Helper function to format parsed rules for display
export function formatParsedRule(rule: ParsedRule): string {
  let formatted = `[${rule.type.toUpperCase()}]`;
  
  if (rule.timeframe) {
    formatted += ` ${rule.timeframe}`;
  }
  
  if (rule.indicators.length > 0) {
    formatted += ` | Indicators: ${rule.indicators.join(', ')}`;
  }
  
  return formatted;
} 