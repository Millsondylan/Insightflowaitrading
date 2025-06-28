type Trade = {
  pnl: number;
  rr: number;
};

export function calculateStats(trades: Trade[]): {
  winRate: number;
  totalPnL: number;
  avgRR: number;
} {
  // Return zeros if no trades
  if (trades.length === 0) {
    return {
      winRate: 0,
      totalPnL: 0,
      avgRR: 0,
    };
  }

  // Calculate total PnL
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);

  // Calculate win rate (percentage of profitable trades)
  const winningTrades = trades.filter(trade => trade.pnl > 0).length;
  const winRate = (winningTrades / trades.length) * 100;

  // Calculate average risk-to-reward ratio
  const totalRR = trades.reduce((sum, trade) => sum + trade.rr, 0);
  const avgRR = totalRR / trades.length;

  return {
    winRate: Math.round(winRate * 100) / 100, // Round to 2 decimals
    totalPnL: Math.round(totalPnL * 100) / 100, // Round to 2 decimals
    avgRR: Math.round(avgRR * 100) / 100, // Round to 2 decimals
  };
} 