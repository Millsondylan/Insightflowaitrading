import { LessonBlock } from "./lessonSchema";

export const academyLessons: LessonBlock[] = [
  // Lesson 1: Mastering Breakouts
  {
    id: "breakout-1",
    topic: "Mastering Breakouts",
    title: "What is a Breakout?",
    content: `A breakout is a stock price moving outside a defined support or resistance level with increased volume.
    
A resistance level is a price point where an asset has had trouble exceeding in a given time frame. Support is the price level that an asset has had trouble falling below. Breakouts are a foundational concept in technical analysis and can signal the start of a new trend.`,
    keyTakeaways: [
      "Breakouts occur above resistance or below support.",
      "Increased volume is a key confirmation signal.",
      "Breakouts can indicate a potential new trend direction.",
    ],
  },
  {
    id: "breakout-2",
    topic: "Mastering Breakouts",
    title: "Identifying Key Levels",
    content: `To trade breakouts, you must first identify key support and resistance levels.
    
Look for historical price points where the market has reversed or consolidated. Trendlines, moving averages, and Fibonacci levels can also act as dynamic support and resistance. The more times a level has been tested, the more significant it becomes.`,
    keyTakeaways: [
      "Use horizontal lines for historical highs and lows.",
      "Draw trendlines to connect swing points.",
      "Moving averages can act as dynamic support/resistance.",
    ],
  },
  {
    id: "breakout-3",
    topic: "Mastering Breakouts",
    title: "Confirmation and Entry",
    content: `A common mistake is entering a breakout too early. Wait for confirmation to avoid 'fakeouts.'
    
Confirmation can be a candle closing strongly beyond the key level, or a retest where the price pulls back to the level and then continues in the breakout direction. Your entry should be placed after this confirmation, with a stop-loss just below the breakout level.`,
    keyTakeaways: [
      "Wait for a candle to close beyond the level.",
      "A retest of the breakout level provides stronger confirmation.",
      "Place stop-losses strategically to manage risk.",
    ],
  },

  // Lesson 2: Essential Risk Management
  {
    id: "risk-1",
    topic: "Essential Risk Management",
    title: "The 1% Rule",
    content: `The 1% rule is a fundamental risk management principle that suggests you should never risk more than 1% of your total trading capital on a single trade.
    
For example, if you have a $10,000 account, you should not risk more than $100 on any given trade. This helps protect your capital from significant drawdowns and allows you to survive losing streaks.`,
    keyTakeaways: [
      "Never risk more than 1% of your account on one trade.",
      "Preserves capital during losing streaks.",
      "Enforces discipline and removes emotion.",
    ],
  },
  {
    id: "risk-2",
    topic: "Essential Risk Management",
    title: "Position Sizing",
    content: `Position sizing is how you determine how many shares or units of an asset to trade. It's calculated based on your risk per trade (e.g., 1% of your account) and the distance to your stop-loss.
    
The formula is: Position Size = (Account Risk) / (Distance to Stop-Loss). Proper position sizing ensures you adhere to your risk limit regardless of the trade setup.`,
    keyTakeaways: [
      "Position size is determined by risk tolerance and stop-loss.",
      "Ensures consistent risk across all trades.",
      "Prevents catastrophic losses from a single bad trade.",
    ],
  },
]; 