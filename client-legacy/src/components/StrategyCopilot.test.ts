// Define StrategyOutput type locally for testing
type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
  warning?: string;
};

// Test the suggestion generation logic
const testStrategies: { name: string; strategy: StrategyOutput; expectedSuggestions: string[] }[] = [
  {
    name: "Breakout Strategy without Volume",
    strategy: {
      title: "Momentum Breakout",
      rules: [
        "Enter on 1H candle close above breakout range",
        "Confirm with RSI > 60",
        "Set stop-loss below consolidation low"
      ],
      checklist: ["Resistance marked", "RSI checked"],
    },
    expectedSuggestions: [
      "volume confirmation", // Should suggest volume
      "ATR stop loss", // Should suggest ATR-based stop
    ]
  },
  {
    name: "RSI Strategy without Exit",
    strategy: {
      title: "RSI Divergence",
      rules: [
        "Monitor 4H RSI for divergence",
        "Enter when RSI < 30 with bullish divergence"
      ],
      checklist: ["RSI divergence confirmed"],
    },
    expectedSuggestions: [
      "RSI exit", // Should suggest RSI-based exit
      "stop loss", // Should suggest adding stop loss
    ]
  },
  {
    name: "EMA Strategy Single Timeframe",
    strategy: {
      title: "EMA Pullback",
      rules: [
        "Enter when price touches rising EMA20 on 1H",
        "Confirm with bullish candle"
      ],
      checklist: ["EMA angle verified"],
    },
    expectedSuggestions: [
      "trend filter", // Should suggest trend alignment
      "timeframe confirmation", // Should suggest MTF
      "profit target" // Should suggest take profit
    ]
  },
  {
    name: "Complete Strategy",
    strategy: {
      title: "Complete System",
      rules: [
        "Enter on 1H breakout with volume confirmation",
        "RSI > 60 and ADX > 25",
        "Stop loss at 1.5x ATR below entry",
        "Take profit at 2:1 risk/reward",
        "Exit if 4H trend changes"
      ],
      checklist: ["All conditions met"],
    },
    expectedSuggestions: [
      // Fewer suggestions as strategy is more complete
    ]
  }
];

// Mock test to show what suggestions would be generated
export function testCopilotSuggestions() {
  console.log("=== Strategy Copilot Suggestion Test ===\n");
  
  testStrategies.forEach(test => {
    console.log(`Test: ${test.name}`);
    console.log("Strategy Rules:");
    test.strategy.rules.forEach((rule, i) => {
      console.log(`  ${i + 1}. ${rule}`);
    });
    
    console.log("\nExpected Suggestion Types:");
    test.expectedSuggestions.forEach(suggestion => {
      console.log(`  - ${suggestion}`);
    });
    
    console.log("\n" + "─".repeat(50) + "\n");
  });
}

// Example of how the copilot analyzes strategies
export function analyzeSuggestionQuality(strategy: StrategyOutput): {
  hasRiskManagement: boolean;
  hasEntryRules: boolean;
  hasExitRules: boolean;
  completenessScore: number;
} {
  const rulesText = strategy.rules.join(' ').toLowerCase();
  
  const hasRiskManagement = 
    rulesText.includes('stop loss') || 
    rulesText.includes('risk') ||
    rulesText.includes('atr');
    
  const hasEntryRules = 
    rulesText.includes('enter') || 
    rulesText.includes('buy') ||
    rulesText.includes('breakout');
    
  const hasExitRules = 
    rulesText.includes('exit') || 
    rulesText.includes('close') ||
    rulesText.includes('take profit');
  
  const indicators = [
    'rsi', 'macd', 'ema', 'sma', 'volume', 
    'atr', 'adx', 'bollinger', 'vwap'
  ];
  
  const indicatorCount = indicators.filter(ind => 
    rulesText.includes(ind)
  ).length;
  
  const completenessScore = 
    (hasRiskManagement ? 30 : 0) +
    (hasEntryRules ? 25 : 0) +
    (hasExitRules ? 25 : 0) +
    (indicatorCount * 5) +
    (strategy.rules.length >= 3 ? 10 : 0);
  
  return {
    hasRiskManagement,
    hasEntryRules,
    hasExitRules,
    completenessScore: Math.min(100, completenessScore)
  };
} 