import { LessonBlock } from "./lessonSchema";

export const academyLessons: LessonBlock[] = [
  // Lesson 1: Mastering Breakouts
  {
    id: "breakout-1",
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
    title: "Confirmation and Entry",
    content: `A common mistake is entering a breakout too early. Wait for confirmation to avoid 'fakeouts.'
    
Confirmation can be a candle closing strongly beyond the key level, or a retest where the price pulls back to the level and then continues in the breakout direction. Your entry should be placed after this confirmation, with a stop-loss just below the breakout level.`,
    keyTakeaways: [
      "Wait for a candle to close beyond the level.",
      "A retest of the breakout level provides stronger confirmation.",
      "Place stop-losses strategically to manage risk.",
    ],
  },
  {
    id: "breakout-4",
    title: "Managing Breakout Trades",
    content: `Once a breakout trade is entered, proper management is crucial for maximizing profitability and minimizing risk.

Set a profit target based on the previous price structure, such as the height of the consolidation pattern projected from the breakout point. Use trailing stops to lock in profits if the trend continues strongly. Be prepared to exit quickly if the price action suggests the breakout was false.`,
    keyTakeaways: [
      "Set profit targets using measured moves from the pattern.",
      "Implement trailing stops to protect profits in strong trends.",
      "Exit promptly if volume dries up or price action weakens.",
    ],
  },
  {
    id: "breakout-5",
    title: "Breakout Trading Strategies",
    content: `There are several proven strategies for trading breakouts effectively across different market conditions.

The Flag Breakout strategy involves identifying a consolidation pattern after a strong move, then entering when price breaks out of this flag pattern. The Range Breakout strategy focuses on rectangular consolidations where price bounces between support and resistance before breaking out. The Moving Average Breakout strategy uses the crossing of key moving averages as confirmation signals.`,
    keyTakeaways: [
      "Flag Breakout strategy works well in trending markets.",
      "Range Breakout strategy is effective in choppy markets.",
      "Moving Average Breakout strategy provides trend confirmation.",
    ],
  },

  // Lesson 2: Essential Risk Management
  {
    id: "risk-1",
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
    title: "Position Sizing",
    content: `Position sizing is how you determine how many shares or units of an asset to trade. It's calculated based on your risk per trade (e.g., 1% of your account) and the distance to your stop-loss.
    
The formula is: Position Size = (Account Risk) / (Distance to Stop-Loss). Proper position sizing ensures you adhere to your risk limit regardless of the trade setup.`,
    keyTakeaways: [
      "Position size is determined by risk tolerance and stop-loss.",
      "Ensures consistent risk across all trades.",
      "Prevents catastrophic losses from a single bad trade.",
    ],
  },
  {
    id: "risk-3",
    title: "Risk-to-Reward Ratio",
    content: `The risk-to-reward ratio compares the potential profit of a trade to its potential loss. It's a critical metric for evaluating trade quality.

A 1:2 risk-to-reward ratio means you're risking $1 to potentially gain $2. Professional traders typically aim for ratios of 1:2 or better. Even with a win rate of just 50%, a consistent 1:2 risk-to-reward ratio will lead to profitability over time.`,
    keyTakeaways: [
      "Calculate risk-to-reward before entering any trade.",
      "Aim for a minimum 1:2 risk-to-reward ratio.",
      "A strong risk-to-reward ratio can make up for a lower win rate.",
    ],
  },
  {
    id: "risk-4",
    title: "Correlation Risk",
    content: `Correlation risk occurs when multiple positions in your portfolio move together, amplifying both gains and losses. This can significantly increase overall portfolio risk.

For example, if you hold positions in multiple technology stocks that tend to move together, you effectively have a larger position in the tech sector than intended. Diversify across uncorrelated or negatively correlated assets to reduce this risk and smooth returns.`,
    keyTakeaways: [
      "Monitor correlation between positions in your portfolio.",
      "Diversify across uncorrelated asset classes.",
      "Consider market regimes where correlations may change.",
    ],
  },
  {
    id: "risk-5",
    title: "Risk Management Systems",
    content: `A comprehensive risk management system combines multiple approaches to protect your capital and enhance long-term returns.

This includes daily loss limits (e.g., stop trading after losing 3% in a day), weekly loss limits (stop trading after losing 7% in a week), drawdown rules (reduce position sizes after a 10% drawdown), and regular performance reviews to identify patterns in winning and losing trades.`,
    keyTakeaways: [
      "Implement daily and weekly loss limits.",
      "Adjust position sizing based on recent performance.",
      "Regularly review and improve your risk management system.",
    ],
  },
  
  // Lesson 3: Technical Analysis Fundamentals
  {
    id: "tech-1",
    title: "Understanding Price Action",
    content: `Price action is the movement of a security's price plotted over time and is the primary focus of technical analysis.

Price action forms patterns that technical analysts interpret to make trading decisions. These patterns reflect the psychology of market participants and often repeat over time. Understanding how to read candlesticks, bars, and charts is essential for interpreting price action correctly.`,
    keyTakeaways: [
      "Price action reveals market psychology through visual patterns.",
      "Candlestick formations provide insights into buyer/seller strength.",
      "Historical price patterns tend to repeat due to human psychology.",
    ],
  },
  {
    id: "tech-2",
    title: "Moving Averages",
    content: `Moving averages smooth out price data to create a single flowing line, making it easier to identify the direction of the trend.

The Simple Moving Average (SMA) gives equal weight to all price points, while the Exponential Moving Average (EMA) gives more weight to recent prices. Common periods include the 20-day, 50-day, and 200-day moving averages. When shorter-term moving averages cross above longer-term ones, it's often considered bullish.`,
    keyTakeaways: [
      "Moving averages help identify trend direction and strength.",
      "EMAs respond more quickly to price changes than SMAs.",
      "Moving average crossovers can signal potential trend changes.",
    ],
  },
  {
    id: "tech-3",
    title: "RSI and MACD Indicators",
    content: `The Relative Strength Index (RSI) and Moving Average Convergence Divergence (MACD) are popular momentum indicators used to identify potential reversal points and trend strength.

RSI measures the speed and change of price movements on a scale from 0 to 100. Values above 70 indicate overbought conditions, while values below 30 suggest oversold conditions. MACD shows the relationship between two moving averages and includes a histogram that measures momentum.`,
    keyTakeaways: [
      "RSI helps identify overbought and oversold conditions.",
      "MACD signal line crossovers can indicate potential entry points.",
      "Divergence between indicators and price often precedes reversals.",
    ],
  },
  {
    id: "tech-4",
    title: "Chart Patterns",
    content: `Chart patterns are specific formations on price charts that can help predict future price movements based on historical precedent.

Common bullish patterns include the Cup and Handle, Ascending Triangle, and Double Bottom. Bearish patterns include Head and Shoulders, Descending Triangle, and Double Top. Continuation patterns like Flags and Pennants suggest the trend will resume after a brief consolidation.`,
    keyTakeaways: [
      "Reversal patterns signal potential trend changes.",
      "Continuation patterns suggest the trend will resume.",
      "The reliability of patterns increases with timeframe and volume confirmation.",
    ],
  },
  {
    id: "tech-5",
    title: "Volume Analysis",
    content: `Volume represents the total number of shares or contracts traded during a specified time period and provides insight into the strength behind price movements.

Strong price movements accompanied by high volume suggest conviction, while price changes on low volume may indicate a lack of participation. Volume often leads price, meaning volume spikes frequently precede significant price movements. Volume indicators like On-Balance Volume (OBV) and Volume Profile can provide additional insights.`,
    keyTakeaways: [
      "Volume confirms the strength of price movements.",
      "Rising prices with increasing volume suggests a healthy uptrend.",
      "Volume divergence often precedes price reversals.",
    ],
  },
  
  // Lesson 4: Trading Psychology
  {
    id: "psych-1",
    title: "Understanding Emotional Biases",
    content: `Emotional biases are systematic errors in judgment caused by feelings rather than factual analysis, and they can significantly impact trading decisions.

Fear often leads to premature exits or hesitation to enter trades, while greed can cause traders to hold positions too long or size positions inappropriately. Overconfidence may result in excessive trading or ignoring risk management principles. Understanding and managing these emotional responses is crucial for trading success.`,
    keyTakeaways: [
      "Recognize your emotional responses to market movements.",
      "Develop techniques to remain objective during volatility.",
      "Create trading rules that account for emotional biases.",
    ],
  },
  {
    id: "psych-2",
    title: "Developing a Trading Mindset",
    content: `A successful trading mindset combines discipline, patience, adaptability, and emotional control to execute trading plans effectively.

Discipline involves following your trading plan and risk management rules without exception. Patience means waiting for high-probability setups rather than forcing trades. Adaptability is necessary because market conditions constantly change. Emotional control allows for clear thinking during both winning and losing periods.`,
    keyTakeaways: [
      "Treat trading as a business, not a hobby or gambling activity.",
      "Focus on process rather than outcomes for long-term success.",
      "Establish routines that reinforce disciplined trading behavior.",
    ],
  },
  {
    id: "psych-3",
    title: "Managing Losses",
    content: `How a trader handles losses often determines their long-term success, as losses are an inevitable part of trading.

Accept that losing trades are part of the process, not personal failures. View losses as the cost of doing business and opportunities to learn. Implement stop-losses before entering trades to remove emotional decision-making during adverse price movements. Regularly review losing trades to identify patterns and areas for improvement.`,
    keyTakeaways: [
      "Use pre-determined stop-losses to limit emotional decisions.",
      "Analyze losing trades for improvement opportunities.",
      "Maintain a positive expectancy despite individual losses.",
    ],
  },
  {
    id: "psych-4",
    title: "Peak Performance Techniques",
    content: `Professional traders use various psychological techniques to maintain peak performance under market pressure.

Visualization involves mentally rehearsing trades and responses to different scenarios. Mindfulness meditation can improve focus and reduce reactivity to market fluctuations. Journaling helps identify patterns in both trading decisions and emotional responses. Physical exercise and proper sleep improve cognitive function and emotional regulation.`,
    keyTakeaways: [
      "Incorporate visualization techniques into your routine.",
      "Practice mindfulness to maintain focus during trading.",
      "Maintain physical health to support mental performance.",
    ],
  },
  {
    id: "psych-5",
    title: "Creating a Feedback Loop",
    content: `A structured feedback system allows traders to continuously improve by learning from both successes and failures.

Maintain a detailed trading journal that records not only trade details but also your thoughts and emotions. Regularly review this journal to identify patterns and areas for improvement. Set specific, measurable goals for your trading process rather than just profit targets. Consider working with a coach or mentor to gain outside perspective on your trading.`,
    keyTakeaways: [
      "Use a detailed trading journal to identify patterns.",
      "Regularly review and analyze your trading performance.",
      "Seek objective feedback from mentors or trading communities.",
    ],
  },
  
  // Lesson 5: Market Structure
  {
    id: "structure-1",
    title: "Understanding Market Phases",
    content: `Markets typically cycle through four main phases: accumulation, markup, distribution, and markdown, each with distinct characteristics and trading opportunities.

Accumulation occurs when smart money begins buying in a relatively flat, range-bound market after a downtrend. Markup is characterized by rising prices with higher highs and higher lows. Distribution happens when smart money begins selling into strength, creating another range-bound period. Markdown is the downtrend phase with lower highs and lower lows.`,
    keyTakeaways: [
      "Identify current market phase to adapt your strategy accordingly.",
      "Accumulation and distribution phases favor range trading strategies.",
      "Markup and markdown phases favor trend-following approaches.",
    ],
  },
  {
    id: "structure-2",
    title: "Support and Resistance Dynamics",
    content: `Support and resistance levels are psychological price barriers where supply and demand forces interact, often causing price to reverse or pause.

Support levels are prices where buying pressure exceeds selling pressure, causing downward movements to stall. Resistance levels are prices where selling pressure exceeds buying pressure, causing upward movements to stall. When these levels break, they often switch roles—former support becomes resistance, and former resistance becomes support.`,
    keyTakeaways: [
      "The more times a level is tested, the more significant it becomes.",
      "Support/resistance can be horizontal or dynamic (trend lines, moving averages).",
      "Volume confirms the strength or weakness of support/resistance levels.",
    ],
  },
  {
    id: "structure-3",
    title: "Order Flow Analysis",
    content: `Order flow analysis examines the buying and selling pressure behind price movements to understand market sentiment and potential direction.

Market depth shows pending buy and sell orders at various price levels, revealing potential support and resistance. Time and sales data shows executed trades in real-time, indicating whether buyers or sellers are more aggressive. Volume profile displays the amount of volume traded at each price level, highlighting areas of interest.`,
    keyTakeaways: [
      "Large limit orders can indicate institutional interest at certain levels.",
      "Absorption of large orders without price movement suggests strong support/resistance.",
      "The pace of transactions can indicate momentum and potential reversals.",
    ],
  },
  {
    id: "structure-4",
    title: "Market Microstructure",
    content: `Market microstructure examines how orders interact to form prices and the mechanisms through which trading occurs.

Bid-ask spread is the difference between the highest buy price and lowest sell price, indicating liquidity. Order types include market orders (executed immediately at best available price), limit orders (executed only at specified price or better), and stop orders (converted to market orders when price reaches a trigger level). Market makers provide liquidity by continuously offering to buy and sell.`,
    keyTakeaways: [
      "Tighter bid-ask spreads indicate higher liquidity.",
      "Understanding order types helps optimize trade execution.",
      "Wider spreads during high volatility can impact trading costs.",
    ],
  },
  {
    id: "structure-5",
    title: "Institutional Trading Patterns",
    content: `Institutional traders move large volumes that can significantly impact price, creating identifiable patterns that retail traders can recognize.

Institutional buying often appears as steady accumulation with minimal price impact, followed by sharp upward movements. Stop hunts occur when price briefly moves to trigger retail stop losses before reversing to the original trend direction. Liquidity grabs involve quick movements to areas of concentrated orders before continuing in the intended direction.`,
    keyTakeaways: [
      "Look for unusual volume without corresponding price movement.",
      "Identify levels where stop losses are likely concentrated.",
      "Monitor for price rejection from key levels with strong volume.",
    ],
  },
  
  // Lesson 6: Advanced Trading Strategies
  {
    id: "strategy-1",
    title: "Mean Reversion Trading",
    content: `Mean reversion strategies capitalize on the tendency of prices to return to their average state after moving significantly away from it.

This approach involves identifying overbought or oversold conditions using indicators such as RSI, Bollinger Bands, or statistical measures. Traders enter counter-trend positions expecting the price to revert to its mean. These strategies work best in range-bound markets but can fail during strong trending conditions.`,
    keyTakeaways: [
      "Look for extreme readings in oscillator indicators.",
      "Confirm mean reversion with price action patterns.",
      "Implement strict stop-losses, as outlier moves can persist.",
    ],
  },
  {
    id: "strategy-2",
    title: "Momentum Trading",
    content: `Momentum trading seeks to capitalize on the continuation of existing trends by entering positions in the direction of the prevailing market movement.

This strategy relies on the principle that assets that have performed well (or poorly) recently will continue to perform well (or poorly) in the short term. Momentum traders use indicators like MACD, Rate of Change (ROC), or simple price performance metrics to identify strong momentum. Proper exit strategies are crucial as momentum eventually fades.`,
    keyTakeaways: [
      "Enter trades in the direction of strong price momentum.",
      "Use volume to confirm the strength of momentum.",
      "Implement trailing stops to capture maximum trend movement.",
    ],
  },
  {
    id: "strategy-3",
    title: "Volatility Breakout Trading",
    content: `Volatility breakout strategies aim to capture profits from significant price movements that occur after periods of low volatility or consolidation.

Markets typically cycle between periods of expansion (high volatility) and contraction (low volatility). Volatility breakout traders identify periods of unusually low volatility, which often precede large price movements. They then place orders to enter trades when price breaks out of the consolidation range, regardless of direction.`,
    keyTakeaways: [
      "Identify periods of decreasing volatility using indicators like Bollinger Band width.",
      "Place entries above and below consolidation ranges.",
      "Calculate position sizes based on volatility to maintain consistent risk.",
    ],
  },
  {
    id: "strategy-4",
    title: "Statistical Arbitrage",
    content: `Statistical arbitrage exploits temporary price discrepancies between related instruments based on mathematical models and statistical analysis.

This approach involves identifying assets with a historical statistical relationship (correlation) that temporarily deviates from its norm. Traders take opposing positions in these assets, expecting the relationship to revert to its statistical average. Common forms include pairs trading, basket trading, and index arbitrage.`,
    keyTakeaways: [
      "Identify pairs or baskets of assets with strong historical correlation.",
      "Enter trades when the correlation deviates significantly.",
      "Monitor the correlation coefficient for changes in relationship strength.",
    ],
  },
  {
    id: "strategy-5",
    title: "Options Strategies",
    content: `Options strategies provide traders with flexible approaches to profit from directional moves, volatility changes, or time decay while often defining maximum risk.

Vertical spreads involve buying and selling options of the same type and expiration but different strike prices, reducing cost and defining risk. Iron condors are neutral strategies that profit from price staying within a range. Calendar spreads exploit time decay differences between near-term and longer-term options. Each strategy has a unique risk profile and market outlook.`,
    keyTakeaways: [
      "Match options strategies to your market outlook (directional, neutral, or volatility-based).",
      "Consider implied volatility levels when selecting strategies.",
      "Understand all potential risk scenarios before entering options positions.",
    ],
  }
]; 