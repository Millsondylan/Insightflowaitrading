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
    <div style={{ padding: "16px", border: "1px solid #374151" }}>
        <p >{label}</p>
        <p style={{ fontWeight: "700", color: "white" }}>
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
    <div style={{ padding: "16px", marginTop: "32px" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>Portfolio Dashboard</h1>
      
      <div >
        <KPICard label="Total PnL" value={stats.totalPnl} prefix="$" />
        <KPICard label="Win Rate" value={stats.winRate} suffix="%" />
        <KPICard label="Avg R:R" value={stats.avgRr} />
      </div>

      <div>
        <h2 style={{ marginBottom: "16px" }}>PnL Curve</h2>
        <PnLCurve trades={trades} />
      </div>

      <div>
        <h2 style={{ marginBottom: "16px" }}>Trade History</h2>
        <div >
            <table style={{ width: "100%" }}>
                <thead >
                    <tr>
                        <th style={{ padding: "16px" }}>Symbol</th>
                        <th style={{ padding: "16px" }}>PnL</th>
                        <th style={{ padding: "16px" }}>R:R</th>
                        <th style={{ padding: "16px" }}>Strategy</th>
                        <th style={{ padding: "16px" }}>Timestamp</th>
                    </tr>
                </thead>
                <tbody >
                    {trades.map(trade => (
                        <tr key={trade.id} >
                            <td style={{ padding: "16px" }}>{trade.symbol}</td>
                            <td className={`p-4 ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${trade.pnl.toFixed(2)}
                            </td>
                            <td style={{ padding: "16px" }}>{trade.rr.toFixed(2)}</td>
                            <td style={{ padding: "16px" }}>{trade.strategyId || 'N/A'}</td>
                            <td style={{ padding: "16px" }}>{new Date(trade.exitTime).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}; 