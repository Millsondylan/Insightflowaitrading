import { parseRules } from './parseRules';

// Example rules from the user's request
const exampleRules = [
  "Enter on 1H close above breakout range",
  "RSI > 60 and volume spike",
  "Stop loss below previous low"
];

console.log("=== Parse Rules Demo ===\n");
console.log("Input Rules:");
exampleRules.forEach((rule, i) => {
  console.log(`${i + 1}. "${rule}"`);
});

console.log("\n--- Parsed Output ---\n");

const parsed = parseRules(exampleRules);

parsed.forEach((rule, index) => {
  console.log(`Rule ${index + 1}:`);
  console.log(`  Raw: "${rule.raw}"`);
  console.log(`  Type: ${rule.type}`);
  if (rule.timeframe) {
    console.log(`  Timeframe: ${rule.timeframe}`);
  }
  if (rule.indicators.length > 0) {
    console.log(`  Indicators: [${rule.indicators.join(', ')}]`);
  }
  if (rule.conditions.length > 0) {
    console.log(`  Conditions: [${rule.conditions.map(c => `"${c}"`).join(', ')}]`);
  }
  console.log();
});

// More complex examples
console.log("\n=== More Complex Examples ===\n");

const complexRules = [
  "When daily MACD crosses above signal line and RSI < 70, enter long position",
  "Exit if 4H EMA20 crosses below EMA50 or price drops 5% from entry",
  "Confirm breakout with 15min volume > 2x average and ADX > 25",
  "Take profit at 1.5x risk or when weekly resistance is hit"
];

const complexParsed = parseRules(complexRules);

complexParsed.forEach((rule, index) => {
  console.log(`\nComplex Rule ${index + 1}:`);
  console.log(`  "${rule.raw}"`);
  console.log(`  → Type: ${rule.type}`);
  console.log(`  → Timeframe: ${rule.timeframe || 'Not specified'}`);
  console.log(`  → Indicators: ${rule.indicators.length > 0 ? rule.indicators.join(', ') : 'None'}`);
  console.log(`  → Conditions: ${rule.conditions.length}`);
  rule.conditions.forEach(cond => {
    console.log(`     • ${cond}`);
  });
});

// Export function to run the demo
export function runParserDemo() {
  console.log("\n📊 Strategy Rule Parser - Live Demo\n");
  
  // Interactive example
  const userStrategy = [
    "Enter when 1H RSI shows bullish divergence near support",
    "Confirm with MACD histogram turning positive on 4H timeframe",
    "Volume must be above 20-day average",
    "Set initial stop loss at -2% from entry",
    "Trail stop to breakeven after +3% profit",
    "Exit 50% at resistance, let rest run with trailing stop"
  ];
  
  console.log("User Strategy Rules:");
  userStrategy.forEach((rule, i) => console.log(`  ${i + 1}. ${rule}`));
  
  const analysis = parseRules(userStrategy);
  
  console.log("\n🔍 Parsed Analysis:\n");
  
  // Group by type
  const entryRules = analysis.filter(r => r.type === 'entry');
  const exitRules = analysis.filter(r => r.type === 'exit');
  const filterRules = analysis.filter(r => r.type === 'filter');
  
  if (entryRules.length > 0) {
    console.log("🟢 Entry Rules:");
    entryRules.forEach(r => {
      console.log(`   - ${r.raw}`);
      if (r.timeframe) console.log(`     Timeframe: ${r.timeframe}`);
      if (r.indicators.length) console.log(`     Uses: ${r.indicators.join(', ')}`);
    });
  }
  
  if (filterRules.length > 0) {
    console.log("\n🔵 Filter/Confirmation Rules:");
    filterRules.forEach(r => {
      console.log(`   - ${r.raw}`);
      if (r.indicators.length) console.log(`     Indicators: ${r.indicators.join(', ')}`);
    });
  }
  
  if (exitRules.length > 0) {
    console.log("\n🔴 Exit Rules:");
    exitRules.forEach(r => {
      console.log(`   - ${r.raw}`);
      if (r.conditions.length) console.log(`     Conditions: ${r.conditions.join(' | ')}`);
    });
  }
  
  // Summary
  console.log("\n📈 Strategy Summary:");
  console.log(`   Total Rules: ${analysis.length}`);
  console.log(`   Entry Signals: ${entryRules.length}`);
  console.log(`   Exit Signals: ${exitRules.length}`);
  console.log(`   Filters: ${filterRules.length}`);
  
  const allIndicators = new Set(analysis.flatMap(r => r.indicators));
  console.log(`   Unique Indicators: ${Array.from(allIndicators).join(', ')}`);
  
  const allTimeframes = new Set(analysis.map(r => r.timeframe).filter(Boolean));
  console.log(`   Timeframes Used: ${Array.from(allTimeframes).join(', ')}`);
} 