import React, { useMemo } from 'react';
import { PnLCurve } from './PnLCurve';

type Trade = {
  id: string;
  symbol: string;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  rr: number;
  strategyId?: string;
};

type Props = {
  trades: Trade[];
};

const KPICard = ({ label, value, prefix = '', suffix = '' }: { label: string, value: string | number, prefix?: string, suffix?: string }) => (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <p className="text-sm text-white/60">{label}</p>
        <p className="text-2xl font-bold text-white">
            {prefix}{value}{suffix}
        </p>
    </div>
);

export const PortfolioDashboard = ({ trades }: Props) => {
  const stats = useMemo(() => {
    if (trades.length === 0) {
      return { winRate: 0, totalPnl: 0, avgRr: 0 };
    }
    const totalPnl = trades.reduce((acc, trade) => acc + trade.pnl, 0);
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const winRate = (winningTrades / trades.length) * 100;
    const totalRr = trades.reduce((acc, t) => acc + t.rr, 0);
    const avgRr = totalRr / trades.length;
    
    return {
      winRate: winRate.toFixed(1),
      totalPnl: totalPnl.toFixed(2),
      avgRr: avgRr.toFixed(2),
    };
  }, [trades]);

  return (
    <div className="theme-portfolio p-4 md:p-6 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white">Portfolio Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <kpicard label="Total PnL" prefix="$" >
        <kpicard label="Win Rate" suffix="%" >
        <kpicard label="Avg R:R" >
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white/90 mb-4">PnL Curve</h2>
        <pnlcurve  >
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white/90 mb-4">Trade History</h2>
        <div className="overflow-x-auto bg-white/5 rounded-lg">
            <table className="w-full text-left">
                <thead className="bg-white/10 text-white/80 text-sm">
                    <tr>
                        <th className="p-4">Symbol</th>
                        <th className="p-4">PnL</th>
                        <th className="p-4">R:R</th>
                        <th className="p-4 hidden md:table-cell">Strategy</th>
                        <th className="p-4 hidden md:table-cell">Timestamp</th>
                    </tr>
                </thead>
                <tbody className="text-white/80 text-sm">
                    {trades.map(trade => (
                        <tr key={trade.id} className="border-b border-white/10 hover:bg-white/10">
                            <td className="p-4">{trade.symbol}</td>
                            <td className={`p-4 ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${trade.pnl.toFixed(2)}
                            </td>
                            <td className="p-4">{trade.rr.toFixed(2)}</td>
                            <td className="p-4 hidden md:table-cell">{trade.strategyId || 'N/A'}</td>
                            <td className="p-4 hidden md:table-cell">{new Date(trade.exitTime).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
