
import { OHLCV } from './sampleData';

export interface ChartSeries {
  data: Array<{
    time: number;
    equity: number;
    drawdown: number;
    trades?: number;
  }>;
}

export const toChartSeries = (candles: OHLCV[], trades: any[]): ChartSeries => {
  const initialBalance = 10000;
  let currentBalance = initialBalance;
  let maxBalance = initialBalance;
  
  const data = candles.map((candle, index) => {
    // Simple calculation for demonstration
    const tradeAtThisTime = trades.find(trade => 
      trade.entryIndex === index || trade.exitIndex === index
    );
    
    if (tradeAtThisTime) {
      currentBalance += tradeAtThisTime.pnl || 0;
      maxBalance = Math.max(maxBalance, currentBalance);
    }
    
    const drawdown = maxBalance > 0 ? ((maxBalance - currentBalance) / maxBalance) * 100 : 0;
    
    return {
      time: candle.timestamp,
      equity: currentBalance,
      drawdown: -drawdown, // Negative because drawdown is typically shown as negative
      trades: tradeAtThisTime ? 1 : 0
    };
  });

  return { data };
};
