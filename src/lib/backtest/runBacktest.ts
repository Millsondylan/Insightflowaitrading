import { OHLCV } from './sampleData';

export interface Trade {
  entryTime: number;
  entryPrice: number;
  exitTime: number;
  exitPrice: number;
  pnl: number;
  pnlPercentage: number;
}

export interface BacktestStats {
  totalTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdown: number;
  totalReturn: number;
}

export interface BacktestResult {
  trades: Trade[];
  stats: BacktestStats;
}

type ConditionFunction = (candle: OHLCV, index: number, candles: OHLCV[]) => boolean;

interface RunBacktestParams {
  candles: OHLCV[];
  entryFn: ConditionFunction;
  exitFn: ConditionFunction;
  maxDrawdownAllowed?: number;
}

export const runBacktest = ({
  candles,
  entryFn,
  exitFn,
  maxDrawdownAllowed = 1, // 100% drawdown allowed by default
}: RunBacktestParams): BacktestResult => {
  const trades: Trade[] = [];
  let inPosition = false;
  let entryPrice = 0;
  let entryTime = 0;

  let peakEquity = 1;
  let maxDrawdown = 0;

  for (let i = 1; i < candles.length; i++) {
    const candle = candles[i];
    
    if (!inPosition && entryFn(candle, i, candles)) {
      inPosition = true;
      entryPrice = candle.close;
      entryTime = candle.time;
    } else if (inPosition) {
      const pnlPercentage = (candle.close - entryPrice) / entryPrice;
      const currentEquity = 1 + trades.reduce((sum, trade) => sum + trade.pnlPercentage, 0) + pnlPercentage;
      
      peakEquity = Math.max(peakEquity, currentEquity);
      const drawdown = (peakEquity - currentEquity) / peakEquity;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
      
      const stopLossHit = maxDrawdownAllowed && drawdown >= maxDrawdownAllowed;

      if (exitFn(candle, i, candles) || stopLossHit) {
        const exitPrice = candle.close;
        const pnl = exitPrice - entryPrice;
        
        trades.push({
          entryTime,
          entryPrice,
          exitTime: candle.time,
          exitPrice,
          pnl,
          pnlPercentage,
        });
        
        inPosition = false;
      }
    }
  }

  // Calculate stats
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.pnl > 0);
  const losingTrades = trades.filter(t => t.pnl <= 0);
  
  const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0;
  
  const totalWinAmount = winningTrades.reduce((sum, t) => sum + t.pnlPercentage, 0);
  const avgWin = winningTrades.length > 0 ? totalWinAmount / winningTrades.length : 0;
  
  const totalLossAmount = losingTrades.reduce((sum, t) => sum + t.pnlPercentage, 0);
  const avgLoss = losingTrades.length > 0 ? totalLossAmount / losingTrades.length : 0;
  
  const totalReturn = trades.reduce((sum, t) => sum + t.pnlPercentage, 0);

  return {
    trades,
    stats: {
      totalTrades,
      winRate,
      avgWin,
      avgLoss,
      maxDrawdown,
      totalReturn,
    },
  };
}; 