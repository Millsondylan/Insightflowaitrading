// Type definitions
export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number; // UNIX timestamp
};

export type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
  warning?: string;
};

export type SimulatedTrade = {
  entryIndex: number;
  exitIndex: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  outcome: "win" | "loss";
};

export type BacktestResult = {
  winRate: number;
  totalPnL: number;
  trades: SimulatedTrade[];
  totalTrades: number;
};

// Helper function to calculate moving average
function calculateSMA(candles: Candle[], period: number, endIndex: number): number | null {
  if (endIndex < period - 1) return null;
  
  let sum = 0;
  for (let i = endIndex - period + 1; i <= endIndex; i++) {
    sum += candles[i].close;
  }
  return sum / period;
}

// Helper function to detect volume spike
function isVolumeSpike(candles: Candle[], index: number, multiplier: number = 1.5): boolean {
  if (index < 20) return false; // Need history for average
  
  // Calculate average volume over last 20 candles
  let avgVolume = 0;
  for (let i = index - 20; i < index; i++) {
    avgVolume += candles[i].volume;
  }
  avgVolume /= 20;
  
  return candles[index].volume > avgVolume * multiplier;
}

// Simple rule parser for backtest conditions
function checkEntryCondition(
  candles: Candle[], 
  index: number, 
  rules: string[]
): boolean {
  if (index < 1) return false;
  
  const currentCandle = candles[index];
  const prevCandle = candles[index - 1];
  const rulesText = rules.join(' ').toLowerCase();
  
  // Breakout detection
  if (rulesText.includes('breakout') || rulesText.includes('close above')) {
    const isBreakout = currentCandle.close > prevCandle.high;
    const hasVolume = rulesText.includes('volume') ? isVolumeSpike(candles, index) : true;
    
    if (isBreakout && hasVolume) {
      return true;
    }
  }
  
  // RSI condition simulation (simplified)
  if (rulesText.includes('rsi')) {
    // Simulate RSI with price momentum
    const momentum = (currentCandle.close - candles[Math.max(0, index - 14)].close) / candles[Math.max(0, index - 14)].close;
    
    if (rulesText.includes('> 60') && momentum > 0.05) {
      return true;
    }
    if (rulesText.includes('< 30') && momentum < -0.05) {
      return true;
    }
  }
  
  // EMA crossover detection
  if (rulesText.includes('ema') || rulesText.includes('cross')) {
    const ema20 = calculateSMA(candles, 20, index); // Using SMA as proxy
    const ema50 = calculateSMA(candles, 50, index);
    
    if (ema20 && ema50) {
      const prevEma20 = calculateSMA(candles, 20, index - 1);
      const prevEma50 = calculateSMA(candles, 50, index - 1);
      
      if (prevEma20 && prevEma50) {
        // Check for crossover
        if (prevEma20 <= prevEma50 && ema20 > ema50) {
          return true;
        }
      }
    }
  }
  
  // Default: simple breakout
  return currentCandle.close > prevCandle.high && currentCandle.volume > prevCandle.volume * 1.2;
}

// Main backtest function
export function runBacktest(
  candles: Candle[],
  strategy: StrategyOutput
): BacktestResult {
  const trades: SimulatedTrade[] = [];
  let inPosition = false;
  let entryPrice = 0;
  let entryIndex = 0;
  
  // Configuration
  const TAKE_PROFIT_PERCENT = 0.015; // 1.5%
  const STOP_LOSS_PERCENT = 0.01;    // 1%
  
  // Step through candles
  for (let i = 1; i < candles.length; i++) {
    const currentCandle = candles[i];
    
    if (!inPosition) {
      // Check entry conditions
      if (checkEntryCondition(candles, i, strategy.rules)) {
        inPosition = true;
        entryPrice = currentCandle.close;
        entryIndex = i;
      }
    } else {
      // Check exit conditions
      const priceChange = (currentCandle.close - entryPrice) / entryPrice;
      
      // Take profit
      if (priceChange >= TAKE_PROFIT_PERCENT) {
        const trade: SimulatedTrade = {
          entryIndex,
          exitIndex: i,
          entryPrice,
          exitPrice: currentCandle.close,
          pnl: priceChange,
          outcome: "win"
        };
        trades.push(trade);
        inPosition = false;
        
      // Stop loss
      } else if (priceChange <= -STOP_LOSS_PERCENT) {
        const trade: SimulatedTrade = {
          entryIndex,
          exitIndex: i,
          entryPrice,
          exitPrice: currentCandle.close,
          pnl: priceChange,
          outcome: "loss"
        };
        trades.push(trade);
        inPosition = false;
        
      // Check if we hit stop loss during candle
      } else if ((currentCandle.low - entryPrice) / entryPrice <= -STOP_LOSS_PERCENT) {
        const stopPrice = entryPrice * (1 - STOP_LOSS_PERCENT);
        const trade: SimulatedTrade = {
          entryIndex,
          exitIndex: i,
          entryPrice,
          exitPrice: stopPrice,
          pnl: -STOP_LOSS_PERCENT,
          outcome: "loss"
        };
        trades.push(trade);
        inPosition = false;
        
      // Check if we hit take profit during candle
      } else if ((currentCandle.high - entryPrice) / entryPrice >= TAKE_PROFIT_PERCENT) {
        const targetPrice = entryPrice * (1 + TAKE_PROFIT_PERCENT);
        const trade: SimulatedTrade = {
          entryIndex,
          exitIndex: i,
          entryPrice,
          exitPrice: targetPrice,
          pnl: TAKE_PROFIT_PERCENT,
          outcome: "win"
        };
        trades.push(trade);
        inPosition = false;
      }
    }
  }
  
  // Close any open position at the end
  if (inPosition && candles.length > 0) {
    const lastCandle = candles[candles.length - 1];
    const priceChange = (lastCandle.close - entryPrice) / entryPrice;
    
    const trade: SimulatedTrade = {
      entryIndex,
      exitIndex: candles.length - 1,
      entryPrice,
      exitPrice: lastCandle.close,
      pnl: priceChange,
      outcome: priceChange >= 0 ? "win" : "loss"
    };
    trades.push(trade);
  }
  
  // Calculate results
  const wins = trades.filter(t => t.outcome === "win").length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  
  return {
    winRate,
    totalPnL,
    trades,
    totalTrades
  };
}

// Additional analysis functions
export function calculateMaxDrawdown(trades: SimulatedTrade[]): number {
  if (trades.length === 0) return 0;
  
  let peak = 0;
  let maxDrawdown = 0;
  let runningPnL = 0;
  
  for (const trade of trades) {
    runningPnL += trade.pnl;
    if (runningPnL > peak) {
      peak = runningPnL;
    }
    const drawdown = (peak - runningPnL) / (1 + peak);
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown * 100; // Return as percentage
}

export function calculateSharpeRatio(trades: SimulatedTrade[]): number {
  if (trades.length < 2) return 0;
  
  const returns = trades.map(t => t.pnl);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  // Assuming 252 trading days per year for annualization
  const annualizedReturn = avgReturn * Math.sqrt(252);
  const annualizedStdDev = stdDev * Math.sqrt(252);
  
  return annualizedReturn / annualizedStdDev;
}

export function getTradeStatistics(result: BacktestResult) {
  const { trades } = result;
  
  if (trades.length === 0) {
    return {
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
      avgTradeDuration: 0
    };
  }
  
  const wins = trades.filter(t => t.outcome === "win");
  const losses = trades.filter(t => t.outcome === "loss");
  
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0;
  
  const totalWins = wins.reduce((sum, t) => sum + t.pnl, 0);
  const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
  
  // Calculate consecutive wins/losses
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  
  for (const trade of trades) {
    if (trade.outcome === "win") {
      currentWinStreak++;
      currentLossStreak = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
    }
  }
  
  const avgTradeDuration = trades.reduce((sum, t) => sum + (t.exitIndex - t.entryIndex), 0) / trades.length;
  
  return {
    avgWin: avgWin * 100, // Convert to percentage
    avgLoss: avgLoss * 100,
    profitFactor,
    maxConsecutiveWins,
    maxConsecutiveLosses,
    avgTradeDuration
  };
} 