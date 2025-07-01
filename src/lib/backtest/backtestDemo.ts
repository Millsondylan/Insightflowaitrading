
import { 
  runBacktest, 
  calculateMaxDrawdown, 
  calculateSharpeRatio, 
  getTradeStatistics,
  type Candle,
  type StrategyOutput 
} from './runStrategyBacktest';

// Generate sample candle data
function generateSampleCandles(count: number = 1000): Candle[] {
  const candles: Candle[] = [];
  let basePrice = 100;
  const startTime = Date.now() - count * 3600000; // 1 hour per candle
  
  for (let i = 0; i < count; i++) {
    // Create some price movement with trends and volatility
    const trend = Math.sin(i / 50) * 5; // Long-term trend
    const noise = (Math.random() - 0.5) * 2; // Short-term noise
    const volatility = Math.sin(i / 10) * 0.5 + 1; // Varying volatility
    
    basePrice = basePrice + trend * 0.1 + noise * volatility;
    basePrice = Math.max(basePrice, 50); // Minimum price floor
    
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const close = basePrice + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    
    // Volume spikes on big moves
    const priceMove = Math.abs(close - open) / open;
    const baseVolume = 1000000;
    const volume = baseVolume * (1 + priceMove * 10) * (0.8 + Math.random() * 0.4);
    
    candles.push({
      open,
      high,
      low,
      close,
      volume,
      time: startTime + i * 3600000
    });
  }
  
  return candles;
}

// Test different strategies
const testStrategies: StrategyOutput[] = [
  {
    title: "Momentum Breakout Strategy",
    rules: [
      "Enter on 1H candle close above breakout with volume spike",
      "Confirm breakout with RSI > 60",
      "Set stop-loss below consolidation low"
    ],
    checklist: [
      "Resistance level marked",
      "Volume validated",
      "News event cleared"
    ]
  },
  {
    title: "RSI Oversold Bounce",
    rules: [
      "Enter when RSI < 30",
      "Confirm with bullish candle pattern",
      "Exit when RSI > 70"
    ],
    checklist: [
      "RSI divergence checked",
      "Support level identified"
    ]
  },
  {
    title: "EMA Crossover System",
    rules: [
      "Enter when EMA20 crosses above EMA50",
      "Confirm with increasing volume",
      "Exit on opposite crossover"
    ],
    checklist: [
      "Trend direction confirmed",
      "Volume analysis complete"
    ]
  }
];

// Run backtest demo
export function runBacktestDemo() {
  console.log("🚀 Strategy Backtest Demo\n");
  console.log("Generating sample data: 1000 candles (hourly)");
  
  const candles = generateSampleCandles(1000);
  console.log(`Generated ${candles.length} candles from ${new Date(candles[0].time).toLocaleDateString()} to ${new Date(candles[candles.length - 1].time).toLocaleDateString()}\n`);
  
  // Test each strategy
  testStrategies.forEach(strategy => {
    console.log("─".repeat(60));
    console.log(`📊 Testing: ${strategy.title}`);
    console.log("─".repeat(60));
    
    // Run backtest
    const result = runBacktest(candles, strategy);
    
    // Get additional statistics
    const maxDrawdown = calculateMaxDrawdown(result.trades);
    const sharpeRatio = calculateSharpeRatio(result.trades);
    const stats = getTradeStatistics(result);
    
    // Display results
    console.log("\n📈 Backtest Results:");
    console.log(`   Total Trades: ${result.totalTrades}`);
    console.log(`   Win Rate: ${result.winRate.toFixed(2)}%`);
    console.log(`   Total PnL: ${(result.totalPnL * 100).toFixed(2)}%`);
    console.log(`   Max Drawdown: ${maxDrawdown.toFixed(2)}%`);
    console.log(`   Sharpe Ratio: ${sharpeRatio.toFixed(2)}`);
    
    console.log("\n📊 Trade Statistics:");
    console.log(`   Average Win: ${stats.avgWin.toFixed(2)}%`);
    console.log(`   Average Loss: ${stats.avgLoss.toFixed(2)}%`);
    console.log(`   Profit Factor: ${stats.profitFactor.toFixed(2)}`);
    console.log(`   Max Consecutive Wins: ${stats.maxConsecutiveWins}`);
    console.log(`   Max Consecutive Losses: ${stats.maxConsecutiveLosses}`);
    console.log(`   Avg Trade Duration: ${stats.avgTradeDuration.toFixed(1)} candles`);
    
    // Show sample trades
    if (result.trades.length > 0) {
      console.log("\n📋 Sample Trades (first 5):");
      result.trades.slice(0, 5).forEach((trade, i) => {
        const entryTime = new Date(candles[trade.entryIndex].time);
        const exitTime = new Date(candles[trade.exitIndex].time);
        console.log(`   Trade ${i + 1}: ${trade.outcome === "win" ? "✅" : "❌"} ` +
          `Entry: $${trade.entryPrice.toFixed(2)} → Exit: $${trade.exitPrice.toFixed(2)} ` +
          `(${(trade.pnl * 100).toFixed(2)}%) ` +
          `Duration: ${trade.exitIndex - trade.entryIndex} candles`
        );
      });
    }
    
    console.log("\n");
  });
  
  // Summary comparison
  console.log("📊 Strategy Comparison Summary");
  console.log("─".repeat(60));
  
  const results = testStrategies.map(strategy => {
    const result = runBacktest(candles, strategy);
    return {
      name: strategy.title,
      winRate: result.winRate,
      totalPnL: result.totalPnL * 100,
      trades: result.totalTrades,
      sharpe: calculateSharpeRatio(result.trades)
    };
  });
  
  // Sort by total PnL
  results.sort((a, b) => b.totalPnL - a.totalPnL);
  
  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result.name}`);
    console.log(`   Win Rate: ${result.winRate.toFixed(2)}% | PnL: ${result.totalPnL.toFixed(2)}% | Sharpe: ${result.sharpe.toFixed(2)}`);
  });
}

// Export function to format backtest results for display
export function formatBacktestResults(result: any, candles: Candle[]) {
  const stats = getTradeStatistics(result);
  const maxDrawdown = calculateMaxDrawdown(result.trades);
  const sharpeRatio = calculateSharpeRatio(result.trades);
  
  return {
    summary: {
      totalTrades: result.totalTrades,
      winRate: `${result.winRate.toFixed(2)}%`,
      totalPnL: `${(result.totalPnL * 100).toFixed(2)}%`,
      maxDrawdown: `${maxDrawdown.toFixed(2)}%`,
      sharpeRatio: sharpeRatio.toFixed(2)
    },
    statistics: {
      avgWin: `${stats.avgWin.toFixed(2)}%`,
      avgLoss: `${stats.avgLoss.toFixed(2)}%`,
      profitFactor: stats.profitFactor.toFixed(2),
      maxConsecutiveWins: stats.maxConsecutiveWins,
      maxConsecutiveLosses: stats.maxConsecutiveLosses,
      avgTradeDuration: `${stats.avgTradeDuration.toFixed(1)} candles`
    },
    trades: result.trades.map((trade: any) => ({
      outcome: trade.outcome,
      entry: {
        price: trade.entryPrice,
        time: new Date(candles[trade.entryIndex].time).toLocaleString()
      },
      exit: {
        price: trade.exitPrice,
        time: new Date(candles[trade.exitIndex].time).toLocaleString()
      },
      pnl: `${(trade.pnl * 100).toFixed(2)}%`,
      duration: trade.exitIndex - trade.entryIndex
    }))
  };
}
