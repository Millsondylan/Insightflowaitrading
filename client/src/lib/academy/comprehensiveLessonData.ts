import { LessonBlock } from "./lessonSchema";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon: string;
  lessons: LessonBlock[];
  quizzes: QuizQuestion[];
  duration: string;
  enrolled: number;
  rating: number;
}

export const comprehensiveCourses: Course[] = [
  {
    id: "technical-analysis-101",
    title: "Technical Analysis Mastery",
    description: "Master chart patterns, indicators, and price action trading with comprehensive technical analysis training.",
    category: "beginner",
    icon: "BarChart2",
    duration: "12 weeks",
    enrolled: 15420,
    rating: 4.8,
    lessons: [
      {
        id: "ta-intro-1",
        title: "What is Technical Analysis?",
        content: `Technical analysis is the study of historical price patterns to predict future market movements. Unlike fundamental analysis which focuses on company financials, technical analysis believes that all known information is already reflected in the price.

The core principles of technical analysis include:
1. Market action discounts everything - All news, earnings, and events are reflected in price
2. Prices move in trends - Markets tend to move in identifiable patterns
3. History tends to repeat itself - Human psychology creates recurring patterns

Technical traders use charts, indicators, and statistical analysis to identify high-probability trading opportunities. This approach works across all timeframes and markets, from 1-minute scalping to monthly position trading.`,
        keyTakeaways: [
          "Price reflects all known market information instantly",
          "Technical patterns work due to consistent human psychology",
          "Applicable across all markets and timeframes",
          "Complements fundamental analysis for complete market view"
        ],
      },
      {
        id: "ta-intro-2",
        title: "Understanding Different Chart Types",
        content: `Choosing the right chart type and timeframe is crucial for effective technical analysis. Each chart type reveals different aspects of market behavior.

Line Charts: Show closing prices connected by lines, best for identifying overall trends
Bar Charts: Display open, high, low, and close (OHLC) for each period
Candlestick Charts: Japanese charting method showing OHLC with visual patterns
Point & Figure: Focus purely on price movement, filtering out time and minor fluctuations
Renko Charts: Build bricks based on price movement, excellent for trend identification

Timeframe selection depends on your trading style:
- Scalpers: 1-minute to 15-minute charts
- Day traders: 5-minute to hourly charts  
- Swing traders: 4-hour to daily charts
- Position traders: Daily to monthly charts`,
        keyTakeaways: [
          "Candlestick charts provide the most visual information",
          "Multiple timeframe analysis improves accuracy",
          "Higher timeframes show stronger, more reliable trends",
          "Chart type selection depends on trading strategy"
        ],
      },
      {
        id: "ta-patterns-1",
        title: "Reversal Patterns",
        content: `Reversal patterns signal potential trend changes and offer some of the most profitable trading opportunities when identified correctly.

Head and Shoulders: The most reliable reversal pattern
- Left shoulder: Initial high in uptrend
- Head: Higher high showing trend exhaustion
- Right shoulder: Lower high confirming weakness
- Neckline break confirms reversal

Double/Triple Tops and Bottoms:
- Form at major resistance/support levels
- Each test shows weakening momentum
- Volume typically decreases on subsequent tests
- Break of middle point confirms pattern

Rounding Tops/Bottoms:
- Gradual shift in sentiment over extended periods
- Often seen in longer timeframes
- Volume follows U-shaped pattern
- Patience required but highly reliable`,
        keyTakeaways: [
          "Wait for pattern completion before entering trades",
          "Volume confirmation increases reliability",
          "Larger patterns lead to bigger moves",
          "Failed patterns often lead to strong continuations"
        ],
      }
    ],
    quizzes: [
      {
        id: "ta-quiz-1",
        question: "What is the primary assumption of technical analysis?",
        options: [
          "Company fundamentals drive all price movements",
          "All known information is already reflected in the price",
          "Markets are completely random and unpredictable",
          "Only institutional traders can profit from charts"
        ],
        correctAnswer: 1,
        explanation: "Technical analysis assumes that all available information - news, fundamentals, sentiment - is already incorporated into the current market price, making price action the most important factor to study.",
        difficulty: "beginner"
      },
      {
        id: "ta-quiz-2",
        question: "Which chart pattern is considered the most reliable reversal signal?",
        options: [
          "Ascending triangle",
          "Bull flag",
          "Head and shoulders",
          "Pennant"
        ],
        correctAnswer: 2,
        explanation: "The head and shoulders pattern is widely regarded as the most reliable reversal pattern due to its clear structure and the psychological shift it represents from bullish to bearish sentiment.",
        difficulty: "intermediate"
      },
      {
        id: "ta-quiz-3",
        question: "What timeframe would a swing trader typically focus on?",
        options: [
          "1-minute to 5-minute charts",
          "5-minute to 15-minute charts",
          "4-hour to daily charts",
          "Monthly to yearly charts"
        ],
        correctAnswer: 2,
        explanation: "Swing traders hold positions for several days to weeks, making 4-hour to daily charts ideal for identifying medium-term trends and patterns while filtering out intraday noise.",
        difficulty: "beginner"
      }
    ]
  },
  {
    id: "risk-management-pro",
    title: "Professional Risk Management",
    description: "Learn institutional-grade risk management techniques to protect capital and maximize long-term profitability.",
    category: "intermediate",
    icon: "Shield",
    duration: "8 weeks",
    enrolled: 12350,
    rating: 4.9,
    lessons: [
      {
        id: "risk-pro-1",
        title: "Modern Portfolio Theory",
        content: `Modern Portfolio Theory (MPT) revolutionized how we think about risk and return in trading and investing. Developed by Harry Markowitz, it shows how to construct portfolios that maximize return for a given level of risk.

Key concepts include:

Diversification: Don't put all eggs in one basket
- Combine uncorrelated assets to reduce overall risk
- Risk reduction without sacrificing returns
- Optimal number is typically 15-20 positions

Efficient Frontier:
- The curve representing optimal risk/return combinations
- Portfolios below the frontier are suboptimal
- Cannot achieve higher returns without accepting more risk

Risk Metrics:
- Standard Deviation: Measures volatility
- Sharpe Ratio: Risk-adjusted returns
- Beta: Correlation to market movements
- Maximum Drawdown: Worst peak-to-trough decline`,
        keyTakeaways: [
          "Diversification is the only free lunch in finance",
          "Correlation between assets matters more than individual risk",
          "Regular rebalancing maintains optimal risk levels",
          "Risk-adjusted returns matter more than absolute returns"
        ],
      },
      {
        id: "risk-pro-2",
        title: "Advanced Position Sizing",
        content: `Professional traders use sophisticated position sizing models that go beyond the basic percentage risk method. These models optimize capital allocation based on multiple factors.

Kelly Criterion:
- Mathematically optimal position size
- Formula: f = (bp - q) / b
- Where b = odds, p = probability of win, q = probability of loss
- Full Kelly often too aggressive; use fractional Kelly (25-50%)

Fixed Ratio Method:
- Increases position size based on profit milestones
- Delta parameter determines growth rate
- More conservative than fixed fractional
- Suitable for smaller accounts

Volatility-Based Sizing:
- Adjust position size inverse to volatility
- Use ATR (Average True Range) for calculation
- Maintains consistent portfolio heat
- Automatically reduces risk in volatile markets

Optimal f:
- Maximizes geometric growth rate
- Based on historical trade distribution
- Requires significant trade history
- Often combined with Monte Carlo simulation`,
        keyTakeaways: [
          "No single position sizing method works for all strategies",
          "Volatility adjustment prevents outsized losses",
          "Kelly Criterion requires accurate probability estimates",
          "Always test sizing methods with historical data"
        ],
      }
    ],
    quizzes: [
      {
        id: "risk-quiz-1",
        question: "What is the main benefit of portfolio diversification according to Modern Portfolio Theory?",
        options: [
          "It guarantees positive returns",
          "It reduces risk without necessarily sacrificing returns",
          "It eliminates all market risk",
          "It increases leverage opportunities"
        ],
        correctAnswer: 1,
        explanation: "Diversification reduces portfolio risk by combining uncorrelated assets, allowing for similar returns with lower overall volatility - often called 'the only free lunch in finance.'",
        difficulty: "intermediate"
      },
      {
        id: "risk-quiz-2",
        question: "When using the Kelly Criterion, why do traders often use a fraction (like 25%) instead of the full Kelly position size?",
        options: [
          "Full Kelly is mathematically incorrect",
          "Brokers don't allow full Kelly positions",
          "Full Kelly can lead to excessive volatility and large drawdowns",
          "Fractional Kelly is more profitable"
        ],
        correctAnswer: 2,
        explanation: "While Full Kelly maximizes long-term growth mathematically, it can result in extreme volatility and drawdowns that most traders find psychologically difficult to endure. Fractional Kelly provides a better balance of growth and risk.",
        difficulty: "advanced"
      }
    ]
  },
  {
    id: "crypto-trading-advanced",
    title: "Advanced Cryptocurrency Trading",
    description: "Master DeFi, yield farming, arbitrage, and advanced crypto trading strategies in the rapidly evolving digital asset markets.",
    category: "advanced",
    icon: "Bitcoin",
    duration: "10 weeks",
    enrolled: 8920,
    rating: 4.7,
    lessons: [
      {
        id: "crypto-adv-1",
        title: "Yield Farming and Liquidity Provision",
        content: `Decentralized Finance (DeFi) has created entirely new trading opportunities through yield farming and liquidity provision. Understanding these mechanisms is crucial for modern crypto traders.

Liquidity Pools:
- Automated Market Makers (AMMs) like Uniswap, Sushiswap
- Provide equal value of two tokens to earn fees
- Impermanent loss risk when prices diverge
- APY varies with trading volume and incentives

Yield Farming Strategies:
1. Single-sided staking: Stake one token for rewards
2. LP farming: Provide liquidity, stake LP tokens
3. Leveraged farming: Borrow to increase position size
4. Auto-compounding: Reinvest rewards automatically

Risk Management in DeFi:
- Smart contract risk: Audit reports essential
- Impermanent loss calculators for position planning
- Gas fee optimization for profitability
- Portfolio allocation: Never more than 20% in one protocol

Advanced Strategies:
- Delta-neutral farming: Hedge price exposure
- Cross-chain arbitrage: Exploit price differences
- Flash loan strategies: Capital-efficient trading
- MEV (Maximum Extractable Value) opportunities`,
        keyTakeaways: [
          "Impermanent loss is the biggest risk in liquidity provision",
          "Gas fees can eliminate profits on small positions",
          "Smart contract audits are essential due diligence",
          "Yields compress as more capital enters strategies"
        ],
      },
      {
        id: "crypto-adv-2",
        title: "Crypto-Specific Indicators and Patterns",
        content: `Cryptocurrency markets exhibit unique characteristics that require specialized technical analysis approaches beyond traditional methods.

On-Chain Analysis:
- Network Value to Transactions (NVT): Crypto P/E ratio
- Stock-to-Flow Model: Scarcity-based valuation
- MVRV Ratio: Market value vs realized value
- Exchange flows: Track smart money movements

Crypto-Specific Indicators:
1. Hash Ribbons: Miner capitulation signals
2. Puell Multiple: Mining profitability cycles
3. SOPR (Spent Output Profit Ratio): Profit-taking behavior
4. Funding rates: Perpetual futures sentiment

Whale Watching:
- Large wallet movements signal intentions
- Exchange inflows suggest selling pressure
- Accumulation addresses indicate smart money
- Distribution patterns reveal market tops

Market Structure:
- 24/7 trading creates unique patterns
- Weekend effects and low liquidity moves
- Correlation with traditional markets increasing
- Regulatory news impacts require fast reactions`,
        keyTakeaways: [
          "On-chain data provides insights unavailable in traditional markets",
          "Crypto markets are more sentiment-driven than traditional assets",
          "24/7 trading requires different risk management approaches",
          "Regulatory headlines can override all technical signals"
        ],
      }
    ],
    quizzes: [
      {
        id: "crypto-quiz-1",
        question: "What is impermanent loss in DeFi liquidity provision?",
        options: [
          "Permanent loss of tokens due to smart contract bugs",
          "Temporary loss compared to holding tokens separately due to price divergence",
          "Loss from high gas fees on Ethereum",
          "Loss from yield farming token price drops"
        ],
        correctAnswer: 1,
        explanation: "Impermanent loss occurs when the price ratio of paired tokens in a liquidity pool changes compared to when you deposited them. The loss is 'impermanent' because it only becomes permanent if you withdraw your liquidity at the diverged prices.",
        difficulty: "advanced"
      },
      {
        id: "crypto-quiz-2",
        question: "Which on-chain metric is often called the 'crypto P/E ratio'?",
        options: [
          "Hash Rate",
          "Network Value to Transactions (NVT)",
          "Market Cap to TVL",
          "Funding Rate"
        ],
        correctAnswer: 1,
        explanation: "The Network Value to Transactions (NVT) ratio compares a cryptocurrency's market cap to its transaction volume, similar to how P/E ratios compare stock prices to earnings, helping identify overvalued or undervalued conditions.",
        difficulty: "intermediate"
      }
    ]
  },
  {
    id: "algorithmic-trading",
    title: "Algorithmic Trading Systems",
    description: "Build, test, and deploy automated trading systems using modern programming techniques and quantitative strategies.",
    category: "advanced",
    icon: "Bot",
    duration: "16 weeks",
    enrolled: 4560,
    rating: 4.9,
    lessons: [
      {
        id: "algo-1",
        title: "Strategy Development Framework",
        content: `Developing robust algorithmic trading systems requires a systematic approach combining market knowledge, programming skills, and rigorous testing methodologies.

Strategy Development Pipeline:
1. Idea Generation
   - Market inefficiency hypothesis
   - Academic research papers
   - Observation of market patterns
   - Quantitative factor analysis

2. Initial Research
   - Historical data collection
   - Statistical validation
   - Economic rationale verification
   - Edge quantification

3. Backtesting Framework
   - In-sample vs out-of-sample testing
   - Walk-forward optimization
   - Monte Carlo simulation
   - Slippage and commission modeling

4. Risk Controls
   - Maximum position limits
   - Correlation constraints
   - Drawdown circuit breakers
   - Volatility scaling

Common Algorithm Types:
- Mean Reversion: Fade extreme moves
- Momentum: Follow strong trends
- Statistical Arbitrage: Exploit price relationships
- Market Making: Provide liquidity for edge
- High-Frequency: Microsecond execution`,
        keyTakeaways: [
          "Overfitting is the biggest enemy of algo trading",
          "Always test with realistic transaction costs",
          "Risk management rules must be hard-coded",
          "Simple strategies often outperform complex ones"
        ],
      },
      {
        id: "algo-2",
        title: "ML Models for Market Prediction",
        content: `Machine learning has revolutionized algorithmic trading, but successful implementation requires understanding both ML techniques and market dynamics.

Feature Engineering:
- Price-based: Returns, volatility, technical indicators
- Volume-based: Order flow, volume profile
- Microstructure: Bid-ask spread, order book imbalance
- Alternative data: Sentiment, satellite imagery, web scraping

Model Selection:
1. Linear Models
   - Ridge/Lasso regression for factor exposure
   - Logistic regression for direction prediction
   - Easy interpretation, less overfitting

2. Tree-based Models
   - Random Forests: Robust to outliers
   - XGBoost: State-of-the-art performance
   - Feature importance analysis

3. Neural Networks
   - LSTMs for sequence prediction
   - CNNs for pattern recognition
   - Transformer models for context

4. Ensemble Methods
   - Combine multiple models
   - Voting or stacking approaches
   - Reduces single model risk

Production Considerations:
- Model decay monitoring
- A/B testing frameworks
- Real-time feature calculation
- Failover and redundancy`,
        keyTakeaways: [
          "Feature engineering matters more than model selection",
          "Financial data violates many ML assumptions",
          "Ensemble methods reduce model risk",
          "Continuous retraining is essential for performance"
        ],
      }
    ],
    quizzes: [
      {
        id: "algo-quiz-1",
        question: "What is the primary risk in algorithmic trading system development?",
        options: [
          "Using too simple strategies",
          "Not having enough computing power",
          "Overfitting to historical data",
          "Trading too frequently"
        ],
        correctAnswer: 2,
        explanation: "Overfitting occurs when a strategy is too closely optimized to historical data and fails to generalize to new market conditions. This is the most common reason algorithmic strategies fail in live trading despite excellent backtest results.",
        difficulty: "advanced"
      },
      {
        id: "algo-quiz-2",
        question: "Why are ensemble methods preferred in financial machine learning?",
        options: [
          "They execute trades faster",
          "They require less data",
          "They reduce single model risk and improve robustness",
          "They are easier to implement"
        ],
        correctAnswer: 2,
        explanation: "Ensemble methods combine predictions from multiple models, reducing the risk of any single model failing due to market regime changes. This diversification at the model level improves robustness and consistency in live trading.",
        difficulty: "advanced"
      }
    ]
  },
  {
    id: "options-strategies",
    title: "Options Trading Mastery",
    description: "From basic options concepts to advanced multi-leg strategies, master the art and science of options trading.",
    category: "advanced",
    icon: "TrendingUp",
    duration: "14 weeks",
    enrolled: 7840,
    rating: 4.8,
    lessons: [
      {
        id: "options-1",
        title: "Understanding Options Greeks",
        content: `Options Greeks are essential risk metrics that measure how option prices change in response to various factors. Mastering Greeks is crucial for successful options trading.

The Primary Greeks:

Delta (Δ):
- Rate of change in option price per $1 move in underlying
- Call delta: 0 to 1, Put delta: -1 to 0
- Probability approximation of finishing in-the-money
- Delta hedging for market-neutral strategies

Gamma (Γ):
- Rate of change in delta per $1 move in underlying
- Highest for at-the-money options near expiration
- Gamma risk increases dramatically near expiration
- Long gamma profits from volatility

Theta (Θ):
- Time decay per day
- Accelerates as expiration approaches
- Nonlinear decay: faster for ATM options
- Weekend theta often priced into Friday close

Vega (ν):
- Sensitivity to implied volatility changes
- Highest for at-the-money options
- Longer expiration = higher vega
- Critical for earnings plays

Rho (ρ):
- Sensitivity to interest rate changes
- More relevant for LEAPS
- Often ignored for short-term options`,
        keyTakeaways: [
          "Greeks work together - understanding interactions is key",
          "Delta-neutral doesn't mean risk-neutral",
          "Gamma risk explodes near expiration",
          "Vega affects option prices more than most traders realize"
        ],
      },
      {
        id: "options-2",
        title: "Multi-Leg Strategies and Adjustments",
        content: `Professional options traders use complex multi-leg strategies to precisely define risk/reward profiles and profit from specific market conditions.

Income Strategies:

Iron Condor:
- Sell OTM call spread + OTM put spread
- Profit from range-bound markets
- Risk defined to spread width minus credit
- Adjustment: Roll untested side or convert to Iron Butterfly

Calendar Spreads:
- Sell near-term, buy longer-term same strike
- Profits from accelerated near-term decay
- Positive vega benefits from IV expansion
- Risk: Early assignment on short leg

Volatility Strategies:

Straddles/Strangles:
- Long: Profit from large moves either direction
- Short: Profit from range-bound movement
- Earnings plays: IV crush vs move magnitude
- Delta-neutral but gamma/vega exposed

Ratio Spreads:
- Buy 1, Sell 2 or more further OTM
- Collects credit with upside potential
- Undefined risk on ratio side
- Professional adjustment required

Advanced Adjustments:
- Rolling: Extend duration or adjust strikes
- Morphing: Convert one strategy to another
- Hedging: Add protective positions
- Dynamic sizing: Adjust based on Greeks`,
        keyTakeaways: [
          "Always map out profit/loss before entering",
          "Have adjustment plans before problems arise",
          "Commission costs matter more with multi-leg strategies",
          "Assignment risk is real - monitor short positions"
        ],
      }
    ],
    quizzes: [
      {
        id: "options-quiz-1",
        question: "Which Greek measures the rate of time decay in an option?",
        options: [
          "Delta",
          "Gamma",
          "Theta",
          "Vega"
        ],
        correctAnswer: 2,
        explanation: "Theta measures time decay - how much an option loses value each day as it approaches expiration. This decay accelerates as expiration nears, particularly for at-the-money options.",
        difficulty: "beginner"
      },
      {
        id: "options-quiz-2",
        question: "What is the maximum risk in an Iron Condor strategy?",
        options: [
          "Unlimited risk on both sides",
          "The credit received",
          "Strike width minus credit received",
          "The debit paid"
        ],
        correctAnswer: 2,
        explanation: "An Iron Condor's maximum risk is the width of either spread (they should be equal) minus the total credit received. This defined risk makes it popular for income generation in range-bound markets.",
        difficulty: "intermediate"
      }
    ]
  },
  {
    id: "forex-fundamentals",
    title: "Forex Trading Fundamentals",
    description: "Master currency trading from basic concepts to advanced fundamental and technical analysis in the world's largest market.",
    category: "intermediate",
    icon: "DollarSign",
    duration: "10 weeks",
    enrolled: 11230,
    rating: 4.7,
    lessons: [
      {
        id: "forex-1",
        title: "Understanding Currency Markets",
        content: `The foreign exchange market is the world's largest and most liquid financial market, with over $7 trillion in daily trading volume. Understanding its unique structure is essential for successful trading.

Market Participants:
1. Central Banks
   - Set monetary policy and interest rates
   - Intervene to stabilize currencies
   - Largest single impact on long-term trends
   
2. Commercial Banks
   - Facilitate client transactions
   - Proprietary trading desks
   - Provide majority of liquidity
   
3. Hedge Funds & Institutions
   - Macro strategies based on fundamentals
   - Carry trades and arbitrage
   - Can move markets with large positions
   
4. Retail Traders
   - Access through brokers
   - Typically day trade or swing trade
   - Growing influence with technology

Market Sessions:
- Sydney: 5 PM - 2 AM EST
- Tokyo: 7 PM - 4 AM EST
- London: 3 AM - 12 PM EST
- New York: 8 AM - 5 PM EST

Best Trading Times:
- London/NY overlap: 8 AM - 12 PM EST (highest volume)
- Major news releases: 8:30 AM EST (US data)
- Session opens: Increased volatility`,
        keyTakeaways: [
          "Forex trades 24/5, creating unique opportunities",
          "Understanding session overlaps improves timing",
          "Major players move markets - follow the smart money",
          "Liquidity varies dramatically by time and pair"
        ],
      },
      {
        id: "forex-2",
        title: "Major, Minor, and Exotic Pairs",
        content: `Successful forex trading requires understanding the characteristics and behavior patterns of different currency pair categories.

Major Pairs (85% of volume):
- EUR/USD: Most liquid, tightest spreads
- GBP/USD: "Cable" - volatile with news
- USD/JPY: Risk sentiment barometer
- USD/CHF: Safe haven dynamics
- AUD/USD: Commodity currency
- USD/CAD: Oil correlation
- NZD/USD: Carry trade favorite

Minor Pairs (Cross currencies):
- EUR/GBP: European dynamics
- EUR/JPY: Popular carry trade
- GBP/JPY: "Beast" - extreme volatility
- AUD/JPY: Risk-on indicator

Exotic Pairs:
- USD/TRY, USD/ZAR: High yields, high risk
- Wide spreads, lower liquidity
- Susceptible to political events
- Best for experienced traders only

Correlation Analysis:
- Positive: EUR/USD and GBP/USD (0.85)
- Negative: EUR/USD and USD/CHF (-0.95)
- Commodity correlations: AUD/USD with gold
- Risk correlations: JPY strength in crisis`,
        keyTakeaways: [
          "Start with majors for tighter spreads and liquidity",
          "Each pair has unique personality and drivers",
          "Correlation awareness prevents overexposure",
          "News impacts vary by pair characteristics"
        ],
      }
    ],
    quizzes: [
      {
        id: "forex-quiz-1",
        question: "When is the forex market typically most liquid and volatile?",
        options: [
          "During the Asian session only",
          "On weekends",
          "During the London/New York session overlap",
          "Only during US market hours"
        ],
        correctAnswer: 2,
        explanation: "The London/New York overlap (8 AM - 12 PM EST) sees the highest trading volume and volatility as both major financial centers are active simultaneously, creating optimal trading conditions.",
        difficulty: "beginner"
      },
      {
        id: "forex-quiz-2",
        question: "Which currency pair is known as 'Cable'?",
        options: [
          "EUR/USD",
          "GBP/USD",
          "USD/JPY",
          "AUD/USD"
        ],
        correctAnswer: 1,
        explanation: "GBP/USD is nicknamed 'Cable' from the transatlantic cable used to transmit exchange rates between London and New York in the 1800s. It remains one of the most traded and volatile major pairs.",
        difficulty: "beginner"
      }
    ]
  },
  {
    id: "psychology-mastery",
    title: "Trading Psychology Mastery",
    description: "Develop the mental edge that separates profitable traders from the rest through proven psychological techniques.",
    category: "intermediate",
    icon: "Brain",
    duration: "6 weeks",
    enrolled: 9870,
    rating: 4.9,
    lessons: [
      {
        id: "psych-master-1",
        title: "Overcoming Mental Trading Traps",
        content: `Cognitive biases are systematic errors in thinking that affect trading decisions. Recognizing and counteracting these biases is crucial for consistent profitability.

Major Trading Biases:

Confirmation Bias:
- Seeking information that confirms existing beliefs
- Ignoring contradictory evidence
- Solution: Actively seek disconfirming data
- Keep a devil's advocate journal

Anchoring Bias:
- Over-relying on first piece of information
- Getting "married" to entry prices
- Solution: Focus on current market conditions
- Use alerts instead of watching positions

Recency Bias:
- Overweighting recent events
- Fear after losses, overconfidence after wins
- Solution: Maintain long-term perspective
- Review extended performance periods

Disposition Effect:
- Holding losers too long, cutting winners short
- Emotional attachment to positions
- Solution: Predetermined exit rules
- Treat each trade independently

Hindsight Bias:
- Believing past events were predictable
- "I knew that would happen"
- Solution: Document real-time predictions
- Record reasoning before outcomes`,
        keyTakeaways: [
          "Biases affect everyone - awareness is the first step",
          "Systematic rules counter emotional decisions",
          "Regular bias audits improve decision-making",
          "External accountability helps maintain objectivity"
        ],
      },
      {
        id: "psych-master-2",
        title: "The Flow State in Trading",
        content: `Achieving flow state - complete absorption in trading with peak performance - separates elite traders from average ones. Learn to consistently access this optimal psychological state.

Characteristics of Trading Flow:
- Complete focus on markets
- Time distortion (hours feel like minutes)
- Effortless decision-making
- Absence of self-consciousness
- Instant pattern recognition

Creating Flow Conditions:

1. Skill-Challenge Balance
   - Trade appropriate position sizes
   - Match strategy complexity to experience
   - Gradually increase difficulty

2. Clear Goals & Feedback
   - Specific daily/weekly targets
   - Real-time P&L tracking
   - Performance metrics dashboard

3. Optimal Environment
   - Dedicated trading space
   - Multiple monitors setup
   - Elimination of distractions
   - Consistent routine

4. Physical Preparation
   - Regular exercise routine
   - Proper nutrition timing
   - Adequate sleep (7-8 hours)
   - Stress management practices

Flow Triggers:
- Pre-market preparation ritual
- Breathing exercises
- Visualization techniques
- Progressive complexity increase`,
        keyTakeaways: [
          "Flow state is trainable, not random",
          "Environment design dramatically impacts performance",
          "Physical health directly affects mental performance",
          "Consistency in routine promotes flow access"
        ],
      }
    ],
    quizzes: [
      {
        id: "psych-quiz-1",
        question: "What is the 'disposition effect' in trading psychology?",
        options: [
          "The tendency to trade based on mood",
          "Holding losing trades too long while cutting winners short",
          "Following other traders' positions",
          "Trading larger sizes after wins"
        ],
        correctAnswer: 1,
        explanation: "The disposition effect describes traders' tendency to hold losing positions hoping for recovery while quickly taking profits on winners, often resulting in poor risk/reward outcomes.",
        difficulty: "intermediate"
      },
      {
        id: "psych-quiz-2",
        question: "Which factor is NOT essential for achieving flow state in trading?",
        options: [
          "Balance between skill level and challenge",
          "Clear goals and immediate feedback",
          "Trading with maximum leverage",
          "Distraction-free environment"
        ],
        correctAnswer: 2,
        explanation: "Flow state requires balanced challenge, clear goals, and focused environment. Maximum leverage actually increases stress and prevents flow by creating excessive emotional pressure.",
        difficulty: "intermediate"
      }
    ]
  },
  {
    id: "market-analysis",
    title: "Fundamental Market Analysis",
    description: "Learn to analyze economic indicators, central bank policies, and global macro events that drive market movements.",
    category: "intermediate",
    icon: "Globe",
    duration: "8 weeks",
    enrolled: 10450,
    rating: 4.6,
    lessons: [
      {
        id: "fundamental-1",
        title: "Key Economic Data and Market Impact",
        content: `Understanding economic indicators is crucial for predicting market movements and timing trades around high-impact events. Each indicator provides insights into economic health and future policy decisions.

Tier 1 Indicators (Maximum Impact):

Non-Farm Payrolls (NFP):
- Released: First Friday of month, 8:30 AM EST
- Measures: Job creation excluding farming
- Impact: Immediate volatility in USD, indices
- Trading: Fade initial spike, trade second move

Federal Reserve Decisions:
- FOMC meetings: 8 times yearly
- Interest rate decisions and forward guidance
- Powell press conferences move markets
- Dot plot reveals future rate expectations

CPI/Inflation Data:
- Consumer Price Index: Monthly inflation gauge
- Core CPI excludes food/energy
- Drives Fed policy decisions
- Persistent inflation = hawkish policy

GDP Releases:
- Quarterly economic growth measure
- Advance, preliminary, final readings
- Major revisions can shock markets
- Leading indicator for policy changes

Tier 2 Indicators:
- Retail Sales: Consumer spending health
- PMI/ISM: Manufacturing/service sector health
- Housing Data: Leading economic indicator
- Consumer Confidence: Sentiment gauge

Trading Economic Events:
1. Pre-event positioning based on consensus
2. Immediate reaction to surprise data
3. Fade overreactions after initial move
4. Watch for revision impacts`,
        keyTakeaways: [
          "Major indicators create tradeable volatility",
          "Consensus vs actual determines market reaction",
          "Central bank interpretation matters most",
          "Economic calendar planning is essential"
        ],
      },
      {
        id: "fundamental-2",
        title: "Understanding Monetary Policy Impact",
        content: `Central banks are the most powerful market movers. Understanding their mandates, tools, and communication styles is essential for successful fundamental trading.

Major Central Banks:

Federal Reserve (Fed):
- Dual mandate: Employment and inflation
- Tools: Fed funds rate, QE, forward guidance
- FOMC minutes reveal internal debates
- Dot plot shows rate projections

European Central Bank (ECB):
- Primary mandate: Price stability (2% inflation)
- Negative rates and asset purchases
- Lagarde's communication style matters
- Fragmentation risks affect policy

Bank of Japan (BOJ):
- Yield curve control unique approach
- Decades of deflation fighting
- Intervention in currency markets
- Ultra-loose policy divergence

Bank of England (BOE):
- Similar to Fed dual mandate
- Brexit complications
- Quarterly inflation reports
- Bailey's hawkish/dovish shifts

Policy Tools and Effects:
1. Interest Rates
   - Higher rates strengthen currency
   - Impact on carry trades
   - Bond yield implications

2. Quantitative Easing/Tightening
   - Asset purchase programs
   - Balance sheet expansion/reduction
   - Long-term yield effects

3. Forward Guidance
   - Managing market expectations
   - "Considerable time" language
   - Data dependency emphasis`,
        keyTakeaways: [
          "Central banks move markets more than any other factor",
          "Policy divergence creates major trends",
          "Communication analysis is as important as actions",
          "Always trade in direction of central bank policy"
        ],
      }
    ],
    quizzes: [
      {
        id: "fundamental-quiz-1",
        question: "Which economic indicator typically causes the most immediate market volatility when released?",
        options: [
          "Housing starts",
          "Consumer confidence",
          "Non-Farm Payrolls (NFP)",
          "Trade balance"
        ],
        correctAnswer: 2,
        explanation: "Non-Farm Payrolls, released on the first Friday of each month, consistently causes the highest immediate volatility across forex, indices, and bonds due to its direct impact on Fed policy decisions.",
        difficulty: "beginner"
      },
      {
        id: "fundamental-quiz-2",
        question: "What is the Federal Reserve's dual mandate?",
        options: [
          "Control inflation and regulate banks",
          "Maximum employment and price stability",
          "Economic growth and trade balance",
          "Currency stability and low interest rates"
        ],
        correctAnswer: 1,
        explanation: "The Federal Reserve's dual mandate, established by Congress, is to achieve maximum employment and price stability (controlling inflation), which guides all monetary policy decisions.",
        difficulty: "intermediate"
      }
    ]
  },
  {
    id: "quantitative-analysis",
    title: "Quantitative Trading Analysis",
    description: "Master statistical analysis, backtesting, and quantitative methods used by professional trading firms.",
    category: "advanced",
    icon: "Calculator",
    duration: "12 weeks",
    enrolled: 3240,
    rating: 4.8,
    lessons: [
      {
        id: "quant-1",
        title: "Probability and Statistics for Trading",
        content: `Quantitative trading relies on rigorous statistical analysis to identify and exploit market inefficiencies. Understanding statistical concepts is fundamental to developing robust trading strategies.

Essential Statistical Concepts:

Probability Distributions:
- Normal Distribution: Assumes returns are normally distributed (often violated)
- Log-Normal: Better for price modeling
- Student's t-distribution: Accounts for fat tails
- Levy distributions: Extreme event modeling

Statistical Tests:
1. Stationarity Testing
   - Augmented Dickey-Fuller (ADF)
   - KPSS test
   - Essential for time series analysis
   
2. Correlation Analysis
   - Pearson: Linear relationships
   - Spearman: Non-linear monotonic
   - Rolling correlations for regime changes
   
3. Hypothesis Testing
   - T-tests for strategy performance
   - Chi-square for independence
   - P-values and significance levels

Risk Metrics:
- VaR (Value at Risk): Maximum expected loss
- CVaR (Conditional VaR): Tail risk measure
- Sharpe Ratio: Risk-adjusted returns
- Sortino Ratio: Downside risk focus
- Calmar Ratio: Return vs drawdown

Time Series Analysis:
- Autocorrelation: Serial dependence
- ARIMA models: Forecasting
- GARCH: Volatility modeling
- Cointegration: Pairs trading`,
        keyTakeaways: [
          "Markets often violate normal distribution assumptions",
          "Multiple hypothesis testing requires adjustment",
          "Out-of-sample testing prevents false discoveries",
          "Risk metrics must align with strategy goals"
        ],
      },
      {
        id: "quant-2",
        title: "Building Robust Backtesting Systems",
        content: `Professional-grade backtesting goes far beyond simple historical simulation. It requires careful attention to biases, realistic assumptions, and proper validation techniques.

Common Backtesting Pitfalls:

1. Look-Ahead Bias
   - Using future information in past decisions
   - Solution: Point-in-time data
   - Careful with restatements and revisions

2. Survivorship Bias
   - Only analyzing currently active securities
   - Delisted stocks affect results
   - Solution: Survivorship-bias-free data

3. Overfitting
   - Too many parameters for data
   - In-sample over-optimization
   - Solution: Out-of-sample testing, cross-validation

Realistic Execution Modeling:
- Slippage: Difference between signal and fill
- Market impact: Large orders move price
- Bid-ask spreads: Varies by liquidity
- Commissions: Include all trading costs
- Margin costs: Borrowing expenses

Advanced Techniques:
1. Walk-Forward Optimization
   - Rolling window parameter selection
   - Adapts to changing markets
   - Tests parameter stability

2. Monte Carlo Methods
   - Randomize trade order
   - Bootstrap returns
   - Confidence intervals for metrics

3. Regime Analysis
   - Different parameters for market conditions
   - Volatility regimes
   - Trend vs range identification

Performance Evaluation:
- CAGR vs volatility trade-offs
- Maximum drawdown analysis
- Recovery time metrics
- Rolling performance windows`,
        keyTakeaways: [
          "Transaction costs can eliminate paper profits",
          "Always reserve data for out-of-sample testing",
          "Simple strategies often outperform in live trading",
          "Robustness beats optimization every time"
        ],
      }
    ],
    quizzes: [
      {
        id: "quant-quiz-1",
        question: "What is survivorship bias in backtesting?",
        options: [
          "Only profitable traders survive long-term",
          "Testing only on securities that still exist today",
          "Strategies that survived previous testing",
          "Using only surviving economic indicators"
        ],
        correctAnswer: 1,
        explanation: "Survivorship bias occurs when backtests only include securities that still exist today, ignoring delisted or bankrupt companies. This creates unrealistically positive results since failed companies are excluded from the analysis.",
        difficulty: "advanced"
      },
      {
        id: "quant-quiz-2",
        question: "Which risk metric specifically focuses on downside volatility?",
        options: [
          "Sharpe Ratio",
          "Sortino Ratio",
          "Beta",
          "Standard Deviation"
        ],
        correctAnswer: 1,
        explanation: "The Sortino Ratio modifies the Sharpe Ratio by only considering downside volatility (negative returns), recognizing that traders are primarily concerned with losses rather than overall volatility.",
        difficulty: "intermediate"
      }
    ]
  },
  {
    id: "institutional-trading",
    title: "Institutional Trading Strategies",
    description: "Learn how banks, hedge funds, and prop firms trade, including order flow analysis and market microstructure.",
    category: "advanced",
    icon: "Building",
    duration: "10 weeks",
    enrolled: 2890,
    rating: 4.9,
    lessons: [
      {
        id: "inst-1",
        title: "Reading Institutional Order Flow",
        content: `Understanding how institutional traders operate and reading their order flow provides retail traders with significant edge. Large players leave footprints that can be identified and followed.

Institutional Trading Characteristics:

Size and Execution:
- Cannot dump large positions at once
- Use icebergs and hidden orders
- Algorithm execution over time
- VWAP/TWAP targeting

Order Types Used:
1. Iceberg Orders
   - Show small size, hide large quantity
   - Refresh at same price level
   - Indicates accumulation/distribution

2. Dark Pool Activity
   - Off-exchange large blocks
   - Printed to tape after execution
   - Watch for unusual volume spikes

3. Sweep Orders
   - Take multiple price levels quickly
   - Urgency indicates strong conviction
   - Often precedes major moves

Identifying Institutional Activity:

Volume Profile Analysis:
- High volume nodes show acceptance
- Low volume areas are vulnerable
- Point of Control (POC) acts as magnet
- Value Area (VA) contains 70% of volume

Time and Sales Reading:
- Large blocks at bid/ask
- Consistent buying/selling pressure
- Absorption: Large orders don't move price
- Exhaustion: No follow-through

Delta Analysis:
- Cumulative volume delta divergence
- Buying/selling aggression measurement
- Institutional vs retail participation`,
        keyTakeaways: [
          "Institutions must telegraph their intentions",
          "Volume precedes price in institutional trading",
          "Absorption and exhaustion signal reversals",
          "Follow smart money, don't fight it"
        ],
      },
      {
        id: "inst-2",
        title: "How Market Makers Operate",
        content: `Market makers provide liquidity and profit from bid-ask spreads while managing inventory risk. Understanding their behavior helps predict short-term price movements.

Market Maker Business Model:

Core Functions:
- Provide two-sided quotes continuously
- Profit from bid-ask spread
- Manage inventory risk
- Obligation to maintain orderly markets

Risk Management:
1. Delta Neutral Hedging
   - Offset directional risk
   - Use options for protection
   - Dynamic hedge adjustment

2. Inventory Management
   - Skew quotes to reduce position
   - Widen spreads when risky
   - Cross-hedge with correlated assets

3. Information Advantage
   - See order flow before others
   - Customer positioning knowledge
   - Interdealer communication

Market Maker Patterns:

Stop Hunts:
- Push price to trigger stops
- Collect liquidity for large orders
- Often reverse after stops hit
- Common at round numbers

Liquidity Provision:
- Tighten spreads in calm markets
- Widen dramatically in volatility
- Step away during news events
- Return after initial volatility

Pin Risk (Options):
- Keep price near strike at expiry
- Maximum pain theory
- Gamma hedging drives pinning
- Predictable on expiration days`,
        keyTakeaways: [
          "Market makers aren't your enemy - they need traders",
          "Spread widening signals upcoming volatility",
          "Stop placement should account for hunts",
          "Options expiry creates predictable flows"
        ],
      }
    ],
    quizzes: [
      {
        id: "inst-quiz-1",
        question: "What does 'absorption' indicate in order flow analysis?",
        options: [
          "Market makers are absent",
          "Large orders are being filled without moving price significantly",
          "All orders are being rejected",
          "The market is closed"
        ],
        correctAnswer: 1,
        explanation: "Absorption occurs when large sell orders hit the bid (or buy orders hit the ask) but price doesn't drop (or rise) as expected, indicating strong buying (or selling) interest absorbing the pressure - often institutional accumulation or distribution.",
        difficulty: "advanced"
      },
      {
        id: "inst-quiz-2",
        question: "Why do market makers often push price to round numbers?",
        options: [
          "Round numbers are lucky",
          "To trigger stop losses and collect liquidity",
          "Regulatory requirements",
          "Technical analysis rules"
        ],
        correctAnswer: 1,
        explanation: "Market makers know retail traders often place stops at round numbers. By pushing price to these levels, they can trigger stops, creating liquidity they need to fill large institutional orders.",
        difficulty: "intermediate"
      }
    ]
  }
];

// Export comprehensive market data
export const marketData = {
  cryptocurrencies: [
    { symbol: "BTC", name: "Bitcoin", price: 42150.23, change24h: 2.34, marketCap: 823567000000, volume24h: 28450000000 },
    { symbol: "ETH", name: "Ethereum", price: 2234.56, change24h: 3.12, marketCap: 268450000000, volume24h: 15670000000 },
    { symbol: "BNB", name: "Binance Coin", price: 312.45, change24h: -0.89, marketCap: 48234000000, volume24h: 1234000000 },
    { symbol: "SOL", name: "Solana", price: 98.76, change24h: 5.43, marketCap: 42876000000, volume24h: 2345000000 },
    { symbol: "ADA", name: "Cardano", price: 0.5432, change24h: 1.23, marketCap: 19234000000, volume24h: 876000000 },
    { symbol: "AVAX", name: "Avalanche", price: 36.78, change24h: 4.56, marketCap: 13456000000, volume24h: 567000000 },
    { symbol: "DOT", name: "Polkadot", price: 7.89, change24h: 2.34, marketCap: 10234000000, volume24h: 432000000 },
    { symbol: "MATIC", name: "Polygon", price: 0.8765, change24h: -1.23, marketCap: 8123000000, volume24h: 345000000 },
    { symbol: "LINK", name: "Chainlink", price: 14.56, change24h: 3.45, marketCap: 8567000000, volume24h: 456000000 },
    { symbol: "UNI", name: "Uniswap", price: 6.78, change24h: 2.12, marketCap: 5123000000, volume24h: 234000000 }
  ],
  forex: [
    { pair: "EUR/USD", bid: 1.0856, ask: 1.0858, change: 0.12, spread: 2, dailyHigh: 1.0890, dailyLow: 1.0820 },
    { pair: "GBP/USD", bid: 1.2634, ask: 1.2636, change: -0.34, spread: 2, dailyHigh: 1.2680, dailyLow: 1.2590 },
    { pair: "USD/JPY", bid: 148.92, ask: 148.94, change: 0.56, spread: 2, dailyHigh: 149.20, dailyLow: 148.30 },
    { pair: "USD/CHF", bid: 0.8976, ask: 0.8978, change: -0.23, spread: 2, dailyHigh: 0.9010, dailyLow: 0.8950 },
    { pair: "AUD/USD", bid: 0.6543, ask: 0.6545, change: 0.89, spread: 2, dailyHigh: 0.6580, dailyLow: 0.6500 },
    { pair: "USD/CAD", bid: 1.3421, ask: 1.3423, change: 0.15, spread: 2, dailyHigh: 1.3450, dailyLow: 1.3380 },
    { pair: "NZD/USD", bid: 0.6123, ask: 0.6125, change: 0.45, spread: 2, dailyHigh: 0.6150, dailyLow: 0.6090 },
    { pair: "EUR/GBP", bid: 0.8592, ask: 0.8594, change: -0.18, spread: 2, dailyHigh: 0.8620, dailyLow: 0.8570 }
  ],
  stocks: [
    { symbol: "AAPL", name: "Apple Inc.", price: 182.34, change: 1.23, volume: 58234000, marketCap: 2834000000000, pe: 29.5 },
    { symbol: "MSFT", name: "Microsoft", price: 378.92, change: 2.45, volume: 34567000, marketCap: 2812000000000, pe: 32.1 },
    { symbol: "GOOGL", name: "Alphabet", price: 142.56, change: -0.89, volume: 28934000, marketCap: 1789000000000, pe: 24.3 },
    { symbol: "AMZN", name: "Amazon", price: 156.78, change: 3.12, volume: 45678000, marketCap: 1623000000000, pe: 45.6 },
    { symbol: "NVDA", name: "NVIDIA", price: 486.92, change: 5.67, volume: 67890000, marketCap: 1203000000000, pe: 67.8 },
    { symbol: "META", name: "Meta", price: 356.23, change: 4.23, volume: 23456000, marketCap: 912000000000, pe: 28.9 },
    { symbol: "TSLA", name: "Tesla", price: 234.56, change: -2.34, volume: 89012000, marketCap: 745000000000, pe: 56.7 },
    { symbol: "BRK-B", name: "Berkshire", price: 367.89, change: 0.89, volume: 3456000, marketCap: 789000000000, pe: 21.2 }
  ],
  commodities: [
    { symbol: "GC", name: "Gold", price: 2042.30, change: 0.45, unit: "USD/oz", contract: "COMEX" },
    { symbol: "SI", name: "Silver", price: 23.45, change: 1.23, unit: "USD/oz", contract: "COMEX" },
    { symbol: "CL", name: "Crude Oil", price: 73.45, change: -1.89, unit: "USD/barrel", contract: "NYMEX" },
    { symbol: "NG", name: "Natural Gas", price: 2.567, change: 3.45, unit: "USD/MMBtu", contract: "NYMEX" },
    { symbol: "ZC", name: "Corn", price: 478.50, change: 0.67, unit: "USc/bushel", contract: "CBOT" },
    { symbol: "ZW", name: "Wheat", price: 598.25, change: -0.34, unit: "USc/bushel", contract: "CBOT" },
    { symbol: "ZS", name: "Soybeans", price: 1234.75, change: 1.12, unit: "USc/bushel", contract: "CBOT" },
    { symbol: "HG", name: "Copper", price: 3.8765, change: 2.34, unit: "USD/lb", contract: "COMEX" }
  ]
};

// Export comprehensive strategies
export const comprehensiveStrategies = [
  {
    id: "1",
    name: "AI Momentum Scanner",
    description: "Machine learning algorithm that identifies momentum shifts across multiple timeframes using neural networks",
    category: "AI/ML",
    tags: ["AI", "Momentum", "Multi-timeframe", "Stocks", "Crypto"],
    performance: {
      totalReturn: 287.5,
      sharpeRatio: 2.34,
      maxDrawdown: 12.3,
      winRate: 68.5,
      profitFactor: 2.89,
      avgWin: 3.45,
      avgLoss: 1.19,
      tradesPerMonth: 45
    },
    riskLevel: "Medium",
    timeframe: "15m-4h",
    markets: ["Stocks", "Crypto", "Forex"],
    minimumCapital: 10000,
    stars: 4532,
    users: 1289,
    created: "2024-01-15",
    updated: "2024-03-10",
    author: {
      name: "QuantumTrader",
      verified: true,
      totalStrategies: 12,
      followers: 3456
    }
  },
  {
    id: "2",
    name: "Arbitrage Master Pro",
    description: "Cross-exchange arbitrage bot that exploits price differences between major cryptocurrency exchanges with sub-second execution",
    category: "Arbitrage",
    tags: ["Arbitrage", "Crypto", "HFT", "DeFi", "Multi-exchange"],
    performance: {
      totalReturn: 156.8,
      sharpeRatio: 4.56,
      maxDrawdown: 3.2,
      winRate: 92.3,
      profitFactor: 8.92,
      avgWin: 0.45,
      avgLoss: 0.23,
      tradesPerMonth: 3250
    },
    riskLevel: "Low",
    timeframe: "Tick",
    markets: ["Crypto"],
    minimumCapital: 50000,
    stars: 6789,
    users: 892,
    created: "2023-08-22",
    updated: "2024-03-12",
    author: {
      name: "ArbitrageKing",
      verified: true,
      totalStrategies: 5,
      followers: 5678
    }
  },
  {
    id: "3",
    name: "Smart Grid DCA Bot",
    description: "Advanced grid trading system with dynamic level adjustment and dollar-cost averaging integration for volatile markets",
    category: "Grid Trading",
    tags: ["Grid", "DCA", "Crypto", "Automated", "Volatility"],
    performance: {
      totalReturn: 89.4,
      sharpeRatio: 1.78,
      maxDrawdown: 18.5,
      winRate: 73.2,
      profitFactor: 1.95,
      avgWin: 1.23,
      avgLoss: 0.87,
      tradesPerMonth: 180
    },
    riskLevel: "Medium",
    timeframe: "1h",
    markets: ["Crypto", "Forex"],
    minimumCapital: 5000,
    stars: 3421,
    users: 2145,
    created: "2023-11-30",
    updated: "2024-03-08",
    author: {
      name: "GridMaster",
      verified: true,
      totalStrategies: 8,
      followers: 4321
    }
  },
  {
    id: "4",
    name: "Options Theta Harvester",
    description: "Sells options premium using iron condors and credit spreads with advanced Greeks management and dynamic hedging",
    category: "Options",
    tags: ["Options", "Theta", "Income", "Stocks", "Advanced"],
    performance: {
      totalReturn: 42.3,
      sharpeRatio: 3.21,
      maxDrawdown: 8.7,
      winRate: 84.5,
      profitFactor: 3.45,
      avgWin: 245,
      avgLoss: 189,
      tradesPerMonth: 25
    },
    riskLevel: "Low-Medium",
    timeframe: "Daily",
    markets: ["Stocks", "ETFs"],
    minimumCapital: 25000,
    stars: 5123,
    users: 1876,
    created: "2023-06-15",
    updated: "2024-03-11",
    author: {
      name: "ThetaGang",
      verified: true,
      totalStrategies: 15,
      followers: 8901
    }
  },
  {
    id: "5",
    name: "Forex Correlation Matrix",
    description: "Exploits currency pair correlations with dynamic position sizing based on correlation strength and volatility",
    category: "Forex",
    tags: ["Forex", "Correlation", "Pairs", "Statistical", "Multi-currency"],
    performance: {
      totalReturn: 134.7,
      sharpeRatio: 2.87,
      maxDrawdown: 14.2,
      winRate: 71.8,
      profitFactor: 2.34,
      avgWin: 87,
      avgLoss: 45,
      tradesPerMonth: 65
    },
    riskLevel: "Medium",
    timeframe: "4h",
    markets: ["Forex"],
    minimumCapital: 15000,
    stars: 2987,
    users: 987,
    created: "2023-09-12",
    updated: "2024-03-09",
    author: {
      name: "FXCorrelation",
      verified: true,
      totalStrategies: 7,
      followers: 3456
    }
  },
  {
    id: "6",
    name: "Sentiment Wave Rider",
    description: "Combines social media sentiment analysis with technical indicators to catch trending moves early",
    category: "Sentiment",
    tags: ["Sentiment", "AI", "Social", "Crypto", "Stocks"],
    performance: {
      totalReturn: 234.5,
      sharpeRatio: 1.92,
      maxDrawdown: 23.4,
      winRate: 62.3,
      profitFactor: 2.12,
      avgWin: 5.67,
      avgLoss: 2.34,
      tradesPerMonth: 38
    },
    riskLevel: "High",
    timeframe: "1h-1d",
    markets: ["Crypto", "Stocks"],
    minimumCapital: 8000,
    stars: 4123,
    users: 1543,
    created: "2023-12-20",
    updated: "2024-03-10",
    author: {
      name: "SentimentTrader",
      verified: true,
      totalStrategies: 4,
      followers: 2345
    }
  },
  {
    id: "7",
    name: "Liquidity Pool Optimizer",
    description: "DeFi strategy that automatically rebalances between liquidity pools for optimal yield farming returns",
    category: "DeFi",
    tags: ["DeFi", "Yield", "Liquidity", "Automated", "Crypto"],
    performance: {
      totalReturn: 178.9,
      sharpeRatio: 2.45,
      maxDrawdown: 19.8,
      winRate: 0, // APY based
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      tradesPerMonth: 0,
      apy: 45.6
    },
    riskLevel: "Medium-High",
    timeframe: "N/A",
    markets: ["DeFi"],
    minimumCapital: 20000,
    stars: 3654,
    users: 876,
    created: "2023-10-05",
    updated: "2024-03-11",
    author: {
      name: "DeFiWhale",
      verified: true,
      totalStrategies: 9,
      followers: 4567
    }
  },
  {
    id: "8",
    name: "Mean Reversion Sniper",
    description: "Statistical arbitrage strategy using Bollinger Bands and RSI divergence to trade oversold/overbought conditions",
    category: "Mean Reversion",
    tags: ["Mean Reversion", "Statistical", "Stocks", "Technical", "Swing"],
    performance: {
      totalReturn: 98.7,
      sharpeRatio: 2.98,
      maxDrawdown: 11.2,
      winRate: 78.9,
      profitFactor: 2.67,
      avgWin: 2.34,
      avgLoss: 1.12,
      tradesPerMonth: 52
    },
    riskLevel: "Low-Medium",
    timeframe: "1h-4h",
    markets: ["Stocks", "ETFs"],
    minimumCapital: 12000,
    stars: 4876,
    users: 2234,
    created: "2023-07-18",
    updated: "2024-03-08",
    author: {
      name: "StatArb",
      verified: true,
      totalStrategies: 11,
      followers: 5678
    }
  },
  {
    id: "9",
    name: "Breakout Hunter Elite",
    description: "Identifies and trades high-probability breakouts using volume profile analysis and multi-timeframe confirmation",
    category: "Breakout",
    tags: ["Breakout", "Volume", "Momentum", "All Markets", "Technical"],
    performance: {
      totalReturn: 167.3,
      sharpeRatio: 2.12,
      maxDrawdown: 16.7,
      winRate: 64.5,
      profitFactor: 2.34,
      avgWin: 4.56,
      avgLoss: 1.89,
      tradesPerMonth: 28
    },
    riskLevel: "Medium",
    timeframe: "30m-4h",
    markets: ["Stocks", "Crypto", "Forex"],
    minimumCapital: 10000,
    stars: 5432,
    users: 3210,
    created: "2023-05-22",
    updated: "2024-03-12",
    author: {
      name: "BreakoutPro",
      verified: true,
      totalStrategies: 6,
      followers: 6789
    }
  },
  {
    id: "10",
    name: "News Catalyst Trader",
    description: "AI-powered news analysis system that trades market reactions to breaking news and earnings announcements",
    category: "News Trading",
    tags: ["News", "AI", "Catalyst", "Stocks", "Fast Execution"],
    performance: {
      totalReturn: 312.4,
      sharpeRatio: 1.67,
      maxDrawdown: 28.3,
      winRate: 58.2,
      profitFactor: 1.89,
      avgWin: 8.92,
      avgLoss: 4.23,
      tradesPerMonth: 15
    },
    riskLevel: "High",
    timeframe: "1m-15m",
    markets: ["Stocks"],
    minimumCapital: 30000,
    stars: 2876,
    users: 567,
    created: "2024-01-10",
    updated: "2024-03-11",
    author: {
      name: "NewsTrader",
      verified: true,
      totalStrategies: 3,
      followers: 2345
    }
  },
  {
    id: "11",
    name: "Fibonacci Retracement Pro",
    description: "Advanced Fibonacci trading system with automatic level detection and confluence zone identification",
    category: "Technical",
    tags: ["Fibonacci", "Technical", "Retracement", "All Markets", "Swing"],
    performance: {
      totalReturn: 124.6,
      sharpeRatio: 2.56,
      maxDrawdown: 13.4,
      winRate: 72.3,
      profitFactor: 2.78,
      avgWin: 3.21,
      avgLoss: 1.43,
      tradesPerMonth: 35
    },
    riskLevel: "Medium",
    timeframe: "1h-1d",
    markets: ["Forex", "Stocks", "Crypto"],
    minimumCapital: 8000,
    stars: 3987,
    users: 1654,
    created: "2023-08-14",
    updated: "2024-03-09",
    author: {
      name: "FibMaster",
      verified: true,
      totalStrategies: 5,
      followers: 3210
    }
  },
  {
    id: "12",
    name: "Crypto Whale Tracker",
    description: "Monitors large wallet movements and exchange flows to follow smart money in cryptocurrency markets",
    category: "On-Chain",
    tags: ["Crypto", "On-chain", "Whale", "Smart Money", "Analytics"],
    performance: {
      totalReturn: 423.7,
      sharpeRatio: 1.89,
      maxDrawdown: 31.2,
      winRate: 61.8,
      profitFactor: 2.01,
      avgWin: 12.34,
      avgLoss: 5.67,
      tradesPerMonth: 12
    },
    riskLevel: "High",
    timeframe: "4h-1d",
    markets: ["Crypto"],
    minimumCapital: 15000,
    stars: 6234,
    users: 2109,
    created: "2023-11-25",
    updated: "2024-03-12",
    author: {
      name: "WhaleWatcher",
      verified: true,
      totalStrategies: 4,
      followers: 7890
    }
  },
  {
    id: "13",
    name: "Elliott Wave Automator",
    description: "Sophisticated Elliott Wave pattern recognition with Fibonacci ratios for high-probability wave trading",
    category: "Technical",
    tags: ["Elliott Wave", "Technical", "Pattern", "Advanced", "All Markets"],
    performance: {
      totalReturn: 145.8,
      sharpeRatio: 2.23,
      maxDrawdown: 17.8,
      winRate: 67.4,
      profitFactor: 2.45,
      avgWin: 5.43,
      avgLoss: 2.76,
      tradesPerMonth: 18
    },
    riskLevel: "Medium-High",
    timeframe: "4h-1d",
    markets: ["Forex", "Stocks", "Commodities"],
    minimumCapital: 20000,
    stars: 3123,
    users: 876,
    created: "2023-09-30",
    updated: "2024-03-10",
    author: {
      name: "WaveRider",
      verified: true,
      totalStrategies: 7,
      followers: 4321
    }
  },
  {
    id: "14",
    name: "Market Profile Scalper",
    description: "Uses market profile and volume analysis to identify high-probability scalping opportunities at key levels",
    category: "Scalping",
    tags: ["Scalping", "Volume Profile", "Market Profile", "Futures", "Intraday"],
    performance: {
      totalReturn: 189.3,
      sharpeRatio: 3.45,
      maxDrawdown: 9.2,
      winRate: 82.1,
      profitFactor: 3.12,
      avgWin: 0.78,
      avgLoss: 0.45,
      tradesPerMonth: 420
    },
    riskLevel: "Medium",
    timeframe: "1m-5m",
    markets: ["Futures", "Forex"],
    minimumCapital: 25000,
    stars: 4567,
    users: 1234,
    created: "2023-12-15",
    updated: "2024-03-11",
    author: {
      name: "ScalpKing",
      verified: true,
      totalStrategies: 9,
      followers: 5432
    }
  },
  {
    id: "15",
    name: "Seasonal Pattern Trader",
    description: "Exploits recurring seasonal patterns in commodities and stocks with backtested historical data",
    category: "Seasonal",
    tags: ["Seasonal", "Commodities", "Stocks", "Long-term", "Statistical"],
    performance: {
      totalReturn: 76.4,
      sharpeRatio: 2.87,
      maxDrawdown: 12.1,
      winRate: 74.3,
      profitFactor: 3.21,
      avgWin: 8.92,
      avgLoss: 3.45,
      tradesPerMonth: 4
    },
    riskLevel: "Low",
    timeframe: "Daily-Weekly",
    markets: ["Commodities", "Stocks"],
    minimumCapital: 15000,
    stars: 2345,
    users: 987,
    created: "2023-06-20",
    updated: "2024-03-08",
    author: {
      name: "SeasonalPro",
      verified: true,
      totalStrategies: 6,
      followers: 2876
    }
  }
]; 