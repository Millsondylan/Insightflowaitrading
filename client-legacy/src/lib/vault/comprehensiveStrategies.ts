export interface StrategyAuthor {
  name: string;
  verified: boolean;
  totalStrategies: number;
  followers: number;
  rating: number;
  joinDate: string;
}

export interface StrategyPerformance {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  tradesPerMonth: number;
  avgHoldTime?: string;
  successRate?: number;
  riskRewardRatio?: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  performance: StrategyPerformance;
  riskLevel: 'Low' | 'Low-Medium' | 'Medium' | 'Medium-High' | 'High' | 'Very High';
  timeframe: string;
  markets: string[];
  minimumCapital: number;
  stars: number;
  users: number;
  created: string;
  updated: string;
  author: StrategyAuthor;
  features?: string[];
  requirements?: string[];
}

export const comprehensiveStrategies: Strategy[] = [
  {
    id: "1",
    name: "AI Momentum Scanner Pro",
    description: "Advanced machine learning algorithm that identifies momentum shifts across multiple timeframes using neural networks and sentiment analysis. Combines technical indicators with market microstructure data for high-accuracy predictions.",
    category: "AI/ML",
    tags: ["AI", "Momentum", "Multi-timeframe", "Stocks", "Crypto", "Machine Learning", "Neural Networks"],
    performance: {
      totalReturn: 287.5,
      sharpeRatio: 2.34,
      maxDrawdown: 12.3,
      winRate: 68.5,
      profitFactor: 2.89,
      avgWin: 3.45,
      avgLoss: 1.19,
      tradesPerMonth: 45,
      avgHoldTime: "2-4 days",
      successRate: 71.2,
      riskRewardRatio: 2.9
    },
    riskLevel: "Medium",
    timeframe: "15m-4h",
    markets: ["Stocks", "Crypto", "Forex", "Futures"],
    minimumCapital: 10000,
    stars: 4532,
    users: 1289,
    created: "2024-01-15",
    updated: "2024-03-10",
    author: {
      name: "QuantumTrader",
      verified: true,
      totalStrategies: 12,
      followers: 3456,
      rating: 4.8,
      joinDate: "2022-03-20"
    },
    features: [
      "Real-time sentiment analysis",
      "Multi-market scanning",
      "Adaptive position sizing",
      "Risk management automation"
    ],
    requirements: [
      "API access to data feeds",
      "VPS for 24/7 operation",
      "Basic programming knowledge"
    ]
  },
  {
    id: "2",
    name: "Cross-Exchange Arbitrage Master",
    description: "Sophisticated arbitrage system exploiting price discrepancies between major cryptocurrency exchanges with sub-second execution. Features smart routing, fee optimization, and automatic hedging.",
    category: "Arbitrage",
    tags: ["Arbitrage", "Crypto", "HFT", "DeFi", "Multi-exchange", "Low Latency"],
    performance: {
      totalReturn: 156.8,
      sharpeRatio: 4.56,
      maxDrawdown: 3.2,
      winRate: 92.3,
      profitFactor: 8.92,
      avgWin: 0.45,
      avgLoss: 0.23,
      tradesPerMonth: 3250,
      avgHoldTime: "< 1 minute",
      successRate: 94.1,
      riskRewardRatio: 1.96
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
      followers: 5678,
      rating: 4.9,
      joinDate: "2021-11-15"
    },
    features: [
      "Multi-exchange connectivity",
      "Smart order routing",
      "Fee calculation engine",
      "Latency monitoring"
    ]
  },
  {
    id: "3",
    name: "Smart Grid DCA Evolution",
    description: "Next-generation grid trading system with AI-powered level adjustment and dynamic dollar-cost averaging. Adapts to market volatility and trend strength automatically.",
    category: "Grid Trading",
    tags: ["Grid", "DCA", "Crypto", "Automated", "Volatility", "AI-Enhanced"],
    performance: {
      totalReturn: 89.4,
      sharpeRatio: 1.78,
      maxDrawdown: 18.5,
      winRate: 73.2,
      profitFactor: 1.95,
      avgWin: 1.23,
      avgLoss: 0.87,
      tradesPerMonth: 180,
      avgHoldTime: "6-12 hours",
      successRate: 75.8,
      riskRewardRatio: 1.41
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
      followers: 4321,
      rating: 4.7,
      joinDate: "2022-06-10"
    }
  },
  {
    id: "4",
    name: "Theta Harvester Elite",
    description: "Professional options premium selling strategy using iron condors, credit spreads, and butterflies with advanced Greeks management and dynamic hedging algorithms.",
    category: "Options",
    tags: ["Options", "Theta", "Income", "Stocks", "Advanced", "Greeks", "Premium Selling"],
    performance: {
      totalReturn: 42.3,
      sharpeRatio: 3.21,
      maxDrawdown: 8.7,
      winRate: 84.5,
      profitFactor: 3.45,
      avgWin: 245,
      avgLoss: 189,
      tradesPerMonth: 25,
      avgHoldTime: "15-30 days",
      successRate: 86.2,
      riskRewardRatio: 1.3
    },
    riskLevel: "Low-Medium",
    timeframe: "Daily",
    markets: ["Stocks", "ETFs", "Indices"],
    minimumCapital: 25000,
    stars: 5123,
    users: 1876,
    created: "2023-06-15",
    updated: "2024-03-11",
    author: {
      name: "ThetaGang",
      verified: true,
      totalStrategies: 15,
      followers: 8901,
      rating: 4.9,
      joinDate: "2020-09-05"
    },
    features: [
      "Greeks optimization",
      "Volatility forecasting",
      "Risk graph visualization",
      "Auto-adjustment rules"
    ]
  },
  {
    id: "5",
    name: "Forex Correlation Matrix Pro",
    description: "Exploits currency pair correlations with dynamic position sizing based on correlation strength, volatility, and central bank policies. Features real-time correlation monitoring.",
    category: "Forex",
    tags: ["Forex", "Correlation", "Pairs", "Statistical", "Multi-currency", "Central Banks"],
    performance: {
      totalReturn: 134.7,
      sharpeRatio: 2.87,
      maxDrawdown: 14.2,
      winRate: 71.8,
      profitFactor: 2.34,
      avgWin: 87,
      avgLoss: 45,
      tradesPerMonth: 65,
      avgHoldTime: "1-3 days",
      successRate: 73.4,
      riskRewardRatio: 1.93
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
      followers: 3456,
      rating: 4.6,
      joinDate: "2021-12-20"
    }
  },
  {
    id: "6",
    name: "Social Sentiment Wave Rider",
    description: "Combines social media sentiment analysis, news flow, and technical indicators to catch trending moves early. Uses NLP and machine learning for sentiment scoring.",
    category: "Sentiment",
    tags: ["Sentiment", "AI", "Social", "Crypto", "Stocks", "NLP", "News Trading"],
    performance: {
      totalReturn: 234.5,
      sharpeRatio: 1.92,
      maxDrawdown: 23.4,
      winRate: 62.3,
      profitFactor: 2.12,
      avgWin: 5.67,
      avgLoss: 2.34,
      tradesPerMonth: 38,
      avgHoldTime: "2-7 days",
      successRate: 64.7,
      riskRewardRatio: 2.42
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
      followers: 2345,
      rating: 4.5,
      joinDate: "2022-08-15"
    }
  },
  {
    id: "7",
    name: "DeFi Yield Optimizer Plus",
    description: "Automated DeFi strategy that dynamically rebalances between liquidity pools, lending protocols, and yield farms for optimal returns. Includes impermanent loss protection.",
    category: "DeFi",
    tags: ["DeFi", "Yield", "Liquidity", "Automated", "Crypto", "Yield Farming", "APY"],
    performance: {
      totalReturn: 178.9,
      sharpeRatio: 2.45,
      maxDrawdown: 19.8,
      winRate: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      tradesPerMonth: 0,
      avgHoldTime: "Variable",
      successRate: 0,
      riskRewardRatio: 0
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
      followers: 4567,
      rating: 4.7,
      joinDate: "2021-07-30"
    }
  },
  {
    id: "8",
    name: "Statistical Mean Reversion Elite",
    description: "Advanced mean reversion strategy using Bollinger Bands, RSI divergence, and statistical analysis to trade oversold/overbought conditions with machine learning filters.",
    category: "Mean Reversion",
    tags: ["Mean Reversion", "Statistical", "Stocks", "Technical", "Swing", "ML-Enhanced"],
    performance: {
      totalReturn: 98.7,
      sharpeRatio: 2.98,
      maxDrawdown: 11.2,
      winRate: 78.9,
      profitFactor: 2.67,
      avgWin: 2.34,
      avgLoss: 1.12,
      tradesPerMonth: 52,
      avgHoldTime: "1-4 days",
      successRate: 80.3,
      riskRewardRatio: 2.09
    },
    riskLevel: "Low-Medium",
    timeframe: "1h-4h",
    markets: ["Stocks", "ETFs", "Forex"],
    minimumCapital: 12000,
    stars: 4876,
    users: 2234,
    created: "2023-07-18",
    updated: "2024-03-08",
    author: {
      name: "StatArb",
      verified: true,
      totalStrategies: 11,
      followers: 5678,
      rating: 4.8,
      joinDate: "2021-03-10"
    }
  },
  {
    id: "9",
    name: "Volume Breakout Hunter Pro",
    description: "Identifies and trades high-probability breakouts using advanced volume profile analysis, order flow, and multi-timeframe confirmation. Features automated stop-loss management.",
    category: "Breakout",
    tags: ["Breakout", "Volume", "Momentum", "All Markets", "Technical", "Order Flow"],
    performance: {
      totalReturn: 167.3,
      sharpeRatio: 2.12,
      maxDrawdown: 16.7,
      winRate: 64.5,
      profitFactor: 2.34,
      avgWin: 4.56,
      avgLoss: 1.89,
      tradesPerMonth: 28,
      avgHoldTime: "2-5 days",
      successRate: 66.8,
      riskRewardRatio: 2.41
    },
    riskLevel: "Medium",
    timeframe: "30m-4h",
    markets: ["Stocks", "Crypto", "Forex", "Commodities"],
    minimumCapital: 10000,
    stars: 5432,
    users: 3210,
    created: "2023-05-22",
    updated: "2024-03-12",
    author: {
      name: "BreakoutPro",
      verified: true,
      totalStrategies: 6,
      followers: 6789,
      rating: 4.7,
      joinDate: "2021-10-25"
    }
  },
  {
    id: "10",
    name: "AI News Catalyst Trader",
    description: "Real-time news analysis system using NLP to trade market reactions to breaking news, earnings, and economic data. Features sentiment scoring and impact prediction.",
    category: "News Trading",
    tags: ["News", "AI", "Catalyst", "Stocks", "Fast Execution", "NLP", "Real-time"],
    performance: {
      totalReturn: 312.4,
      sharpeRatio: 1.67,
      maxDrawdown: 28.3,
      winRate: 58.2,
      profitFactor: 1.89,
      avgWin: 8.92,
      avgLoss: 4.23,
      tradesPerMonth: 15,
      avgHoldTime: "Minutes to hours",
      successRate: 61.5,
      riskRewardRatio: 2.11
    },
    riskLevel: "High",
    timeframe: "1m-15m",
    markets: ["Stocks", "Forex", "Crypto"],
    minimumCapital: 30000,
    stars: 2876,
    users: 567,
    created: "2024-01-10",
    updated: "2024-03-11",
    author: {
      name: "NewsTrader",
      verified: true,
      totalStrategies: 3,
      followers: 2345,
      rating: 4.4,
      joinDate: "2022-11-05"
    }
  },
  {
    id: "11",
    name: "Fibonacci Confluence Master",
    description: "Advanced Fibonacci trading system combining retracements, extensions, and time zones with automatic level detection and confluence zone identification.",
    category: "Technical",
    tags: ["Fibonacci", "Technical", "Retracement", "All Markets", "Swing", "Confluence"],
    performance: {
      totalReturn: 124.6,
      sharpeRatio: 2.56,
      maxDrawdown: 13.4,
      winRate: 72.3,
      profitFactor: 2.78,
      avgWin: 3.21,
      avgLoss: 1.43,
      tradesPerMonth: 35,
      avgHoldTime: "1-7 days",
      successRate: 74.6,
      riskRewardRatio: 2.25
    },
    riskLevel: "Medium",
    timeframe: "1h-1d",
    markets: ["Forex", "Stocks", "Crypto", "Indices"],
    minimumCapital: 8000,
    stars: 3987,
    users: 1654,
    created: "2023-08-14",
    updated: "2024-03-09",
    author: {
      name: "FibMaster",
      verified: true,
      totalStrategies: 5,
      followers: 3210,
      rating: 4.6,
      joinDate: "2021-05-20"
    }
  },
  {
    id: "12",
    name: "Crypto Whale Tracker Pro",
    description: "Advanced on-chain analytics system monitoring large wallet movements, exchange flows, and whale accumulation patterns to predict major market moves.",
    category: "On-Chain",
    tags: ["Crypto", "On-chain", "Whale", "Smart Money", "Analytics", "Blockchain"],
    performance: {
      totalReturn: 423.7,
      sharpeRatio: 1.89,
      maxDrawdown: 31.2,
      winRate: 61.8,
      profitFactor: 2.01,
      avgWin: 12.34,
      avgLoss: 5.67,
      tradesPerMonth: 12,
      avgHoldTime: "3-14 days",
      successRate: 64.2,
      riskRewardRatio: 2.18
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
      followers: 7890,
      rating: 4.8,
      joinDate: "2021-02-15"
    }
  },
  {
    id: "13",
    name: "Elliott Wave AI Predictor",
    description: "Sophisticated Elliott Wave pattern recognition system enhanced with AI for wave counting and Fibonacci ratio validation. Includes automatic invalidation levels.",
    category: "Technical",
    tags: ["Elliott Wave", "Technical", "Pattern", "Advanced", "All Markets", "AI-Enhanced"],
    performance: {
      totalReturn: 145.8,
      sharpeRatio: 2.23,
      maxDrawdown: 17.8,
      winRate: 67.4,
      profitFactor: 2.45,
      avgWin: 5.43,
      avgLoss: 2.76,
      tradesPerMonth: 18,
      avgHoldTime: "3-10 days",
      successRate: 69.8,
      riskRewardRatio: 1.97
    },
    riskLevel: "Medium-High",
    timeframe: "4h-1d",
    markets: ["Forex", "Stocks", "Commodities", "Indices"],
    minimumCapital: 20000,
    stars: 3123,
    users: 876,
    created: "2023-09-30",
    updated: "2024-03-10",
    author: {
      name: "WaveRider",
      verified: true,
      totalStrategies: 7,
      followers: 4321,
      rating: 4.5,
      joinDate: "2021-08-10"
    }
  },
  {
    id: "14",
    name: "Market Profile Scalper Ultra",
    description: "High-frequency scalping system using market profile, volume analysis, and order flow to identify high-probability scalping opportunities at key levels.",
    category: "Scalping",
    tags: ["Scalping", "Volume Profile", "Market Profile", "Futures", "Intraday", "Order Flow"],
    performance: {
      totalReturn: 189.3,
      sharpeRatio: 3.45,
      maxDrawdown: 9.2,
      winRate: 82.1,
      profitFactor: 3.12,
      avgWin: 0.78,
      avgLoss: 0.45,
      tradesPerMonth: 420,
      avgHoldTime: "1-15 minutes",
      successRate: 83.7,
      riskRewardRatio: 1.73
    },
    riskLevel: "Medium",
    timeframe: "1m-5m",
    markets: ["Futures", "Forex", "Crypto"],
    minimumCapital: 25000,
    stars: 4567,
    users: 1234,
    created: "2023-12-15",
    updated: "2024-03-11",
    author: {
      name: "ScalpKing",
      verified: true,
      totalStrategies: 9,
      followers: 5432,
      rating: 4.9,
      joinDate: "2020-11-30"
    }
  },
  {
    id: "15",
    name: "Seasonal Pattern Trader Pro",
    description: "Data-driven seasonal trading system exploiting recurring patterns in commodities, stocks, and currencies with 20+ years of backtested data.",
    category: "Seasonal",
    tags: ["Seasonal", "Commodities", "Stocks", "Long-term", "Statistical", "Data-driven"],
    performance: {
      totalReturn: 76.4,
      sharpeRatio: 2.87,
      maxDrawdown: 12.1,
      winRate: 74.3,
      profitFactor: 3.21,
      avgWin: 8.92,
      avgLoss: 3.45,
      tradesPerMonth: 4,
      avgHoldTime: "2-8 weeks",
      successRate: 76.5,
      riskRewardRatio: 2.59
    },
    riskLevel: "Low",
    timeframe: "Daily-Weekly",
    markets: ["Commodities", "Stocks", "Forex"],
    minimumCapital: 15000,
    stars: 2345,
    users: 987,
    created: "2023-06-20",
    updated: "2024-03-08",
    author: {
      name: "SeasonalPro",
      verified: true,
      totalStrategies: 6,
      followers: 2876,
      rating: 4.7,
      joinDate: "2021-01-15"
    }
  },
  {
    id: "16",
    name: "Pairs Trading Algorithm",
    description: "Statistical arbitrage strategy trading mean-reverting spreads between correlated assets. Features cointegration testing and dynamic hedge ratio calculation.",
    category: "Statistical Arbitrage",
    tags: ["Pairs Trading", "Statistical", "Arbitrage", "Market Neutral", "Stocks", "Quantitative"],
    performance: {
      totalReturn: 67.8,
      sharpeRatio: 3.12,
      maxDrawdown: 7.8,
      winRate: 76.4,
      profitFactor: 2.89,
      avgWin: 1.67,
      avgLoss: 0.89,
      tradesPerMonth: 85,
      avgHoldTime: "1-5 days",
      successRate: 78.1,
      riskRewardRatio: 1.88
    },
    riskLevel: "Low-Medium",
    timeframe: "30m-4h",
    markets: ["Stocks", "ETFs", "Futures"],
    minimumCapital: 30000,
    stars: 3789,
    users: 1123,
    created: "2023-07-25",
    updated: "2024-03-10",
    author: {
      name: "PairsTrader",
      verified: true,
      totalStrategies: 8,
      followers: 3987,
      rating: 4.8,
      joinDate: "2021-04-20"
    }
  },
  {
    id: "17",
    name: "Crypto Market Making Bot",
    description: "Professional market making algorithm providing liquidity on crypto exchanges while capturing bid-ask spreads. Features inventory management and risk controls.",
    category: "Market Making",
    tags: ["Market Making", "Crypto", "HFT", "Liquidity", "Automated", "Exchange"],
    performance: {
      totalReturn: 92.3,
      sharpeRatio: 4.23,
      maxDrawdown: 5.6,
      winRate: 89.2,
      profitFactor: 5.67,
      avgWin: 0.12,
      avgLoss: 0.08,
      tradesPerMonth: 8500,
      avgHoldTime: "Seconds",
      successRate: 91.3,
      riskRewardRatio: 1.5
    },
    riskLevel: "Low",
    timeframe: "Tick",
    markets: ["Crypto"],
    minimumCapital: 100000,
    stars: 4123,
    users: 432,
    created: "2023-09-05",
    updated: "2024-03-12",
    author: {
      name: "MarketMaker",
      verified: true,
      totalStrategies: 3,
      followers: 2134,
      rating: 4.9,
      joinDate: "2020-12-10"
    }
  },
  {
    id: "18",
    name: "Multi-Asset Trend Following",
    description: "Diversified trend following system trading stocks, commodities, currencies, and bonds. Uses proprietary trend strength indicators and dynamic position sizing.",
    category: "Trend Following",
    tags: ["Trend Following", "Multi-Asset", "CTA", "Diversified", "Systematic", "Long-term"],
    performance: {
      totalReturn: 156.7,
      sharpeRatio: 1.45,
      maxDrawdown: 21.3,
      winRate: 42.3,
      profitFactor: 2.34,
      avgWin: 12.56,
      avgLoss: 3.45,
      tradesPerMonth: 22,
      avgHoldTime: "2-12 weeks",
      successRate: 45.6,
      riskRewardRatio: 3.64
    },
    riskLevel: "Medium",
    timeframe: "Daily",
    markets: ["Stocks", "Commodities", "Forex", "Bonds"],
    minimumCapital: 50000,
    stars: 5678,
    users: 2345,
    created: "2023-04-15",
    updated: "2024-03-09",
    author: {
      name: "TrendMaster",
      verified: true,
      totalStrategies: 10,
      followers: 6543,
      rating: 4.7,
      joinDate: "2020-08-25"
    }
  },
  {
    id: "19",
    name: "Options Volatility Trader",
    description: "Advanced volatility trading strategy using straddles, strangles, and volatility arbitrage. Features IV rank analysis and event-driven trading.",
    category: "Options",
    tags: ["Options", "Volatility", "Straddles", "IV", "Earnings", "Advanced"],
    performance: {
      totalReturn: 198.4,
      sharpeRatio: 2.01,
      maxDrawdown: 19.7,
      winRate: 63.8,
      profitFactor: 2.23,
      avgWin: 567,
      avgLoss: 234,
      tradesPerMonth: 18,
      avgHoldTime: "5-20 days",
      successRate: 66.2,
      riskRewardRatio: 2.42
    },
    riskLevel: "Medium-High",
    timeframe: "Daily",
    markets: ["Stocks", "ETFs", "Indices"],
    minimumCapital: 35000,
    stars: 3456,
    users: 987,
    created: "2023-08-30",
    updated: "2024-03-11",
    author: {
      name: "VolTrader",
      verified: true,
      totalStrategies: 7,
      followers: 4123,
      rating: 4.6,
      joinDate: "2021-06-15"
    }
  },
  {
    id: "20",
    name: "Quantitative Momentum Portfolio",
    description: "Factor-based systematic strategy selecting high momentum stocks with quality filters. Includes sector rotation and risk parity weighting.",
    category: "Quantitative",
    tags: ["Quantitative", "Momentum", "Factor", "Portfolio", "Stocks", "Systematic"],
    performance: {
      totalReturn: 134.2,
      sharpeRatio: 1.78,
      maxDrawdown: 18.9,
      winRate: 56.7,
      profitFactor: 1.89,
      avgWin: 6.78,
      avgLoss: 3.12,
      tradesPerMonth: 45,
      avgHoldTime: "1-3 months",
      successRate: 59.4,
      riskRewardRatio: 2.17
    },
    riskLevel: "Medium",
    timeframe: "Daily",
    markets: ["Stocks"],
    minimumCapital: 40000,
    stars: 4890,
    users: 1678,
    created: "2023-05-10",
    updated: "2024-03-10",
    author: {
      name: "QuantPro",
      verified: true,
      totalStrategies: 12,
      followers: 5890,
      rating: 4.8,
      joinDate: "2020-10-05"
    }
  }
];

// Strategy categories for filtering
export const strategyCategories = [
  "AI/ML",
  "Arbitrage", 
  "Grid Trading",
  "Options",
  "Forex",
  "Sentiment",
  "DeFi",
  "Mean Reversion",
  "Breakout",
  "News Trading",
  "Technical",
  "On-Chain",
  "Scalping",
  "Seasonal",
  "Statistical Arbitrage",
  "Market Making",
  "Trend Following",
  "Quantitative"
];

// Risk levels for filtering
export const riskLevels = [
  "Low",
  "Low-Medium",
  "Medium",
  "Medium-High",
  "High",
  "Very High"
];

// Market types for filtering
export const marketTypes = [
  "Stocks",
  "Crypto",
  "Forex",
  "Options",
  "Futures",
  "ETFs",
  "Bonds",
  "Commodities",
  "Indices",
  "DeFi"
];

// Helper function to filter strategies
export function filterStrategies(
  strategies: Strategy[],
  filters: {
    category?: string;
    riskLevel?: string;
    market?: string;
    minReturn?: number;
    maxDrawdown?: number;
    minWinRate?: number;
  }
): Strategy[] {
  return strategies.filter(strategy => {
    if (filters.category && strategy.category !== filters.category) return false;
    if (filters.riskLevel && strategy.riskLevel !== filters.riskLevel) return false;
    if (filters.market && !strategy.markets.includes(filters.market)) return false;
    if (filters.minReturn && strategy.performance.totalReturn < filters.minReturn) return false;
    if (filters.maxDrawdown && strategy.performance.maxDrawdown > filters.maxDrawdown) return false;
    if (filters.minWinRate && strategy.performance.winRate < filters.minWinRate) return false;
    return true;
  });
}

// Helper function to sort strategies
export function sortStrategies(
  strategies: Strategy[],
  sortBy: 'returns' | 'sharpe' | 'drawdown' | 'winRate' | 'users' | 'stars' = 'returns',
  order: 'asc' | 'desc' = 'desc'
): Strategy[] {
  const sorted = [...strategies].sort((a, b) => {
    let compareValue = 0;
    switch (sortBy) {
      case 'returns':
        compareValue = a.performance.totalReturn - b.performance.totalReturn;
        break;
      case 'sharpe':
        compareValue = a.performance.sharpeRatio - b.performance.sharpeRatio;
        break;
      case 'drawdown':
        compareValue = a.performance.maxDrawdown - b.performance.maxDrawdown;
        break;
      case 'winRate':
        compareValue = a.performance.winRate - b.performance.winRate;
        break;
      case 'users':
        compareValue = a.users - b.users;
        break;
      case 'stars':
        compareValue = a.stars - b.stars;
        break;
    }
    return order === 'desc' ? -compareValue : compareValue;
  });
  return sorted;
} 