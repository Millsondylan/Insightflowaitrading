import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

type SimulatedTrade = {
  entryIndex: number;
  exitIndex: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  outcome: "win" | "loss";
};

type BacktestResult = {
  winRate: number;
  totalPnL: number;
  totalTrades: number;
  trades: SimulatedTrade[];
};

type Props = {
  result: BacktestResult;
};

const BacktestResultDisplay = ({ result }: Props) => {
  const { trades, winRate, totalPnL, totalTrades } = result;

  const winRateRef = useRef<HTMLHeadingElement>(null);
  const pnlRef = useRef<HTMLHeadingElement>(null);
  const totalTradesRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const winRateNode = winRateRef.current;
    if (winRateNode) {
      const controls = animate(0, winRate, {
        duration: 1,
        onUpdate(value) {
          winRateNode.textContent = `${value.toFixed(2)}%`;
        },
      });
      return () => controls.stop();
    }
  }, [winRate]);

  useEffect(() => {
    const pnlNode = pnlRef.current;
    if (pnlNode) {
      const controls = animate(0, totalPnL, {
        duration: 1,
        onUpdate(value) {
          pnlNode.textContent = `$${value.toFixed(2)}`;
        },
      });
      return () => controls.stop();
    }
  }, [totalPnL]);

  useEffect(() => {
    const totalTradesNode = totalTradesRef.current;
    if (totalTradesNode) {
        const controls = animate(0, totalTrades, {
            duration: 1,
            onUpdate(value) {
                totalTradesNode.textContent = Math.round(value).toString();
            }
        });
        return () => controls.stop();
    }
  }, [totalTrades]);

  if (trades.length === 0) {
    return (
      <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
        <p >
          No trades found. Adjust your strategy or timeframe.
        </p>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
      <div >
        <div style={{ borderRadius: "0.75rem", padding: "16px", border: "1px solid #374151", color: "white" }}>
          <p >Win Rate</p>
          <h2 ref={winRateRef} style={{ fontWeight: "700" }}>{winRate.toFixed(2)}%</h2>
        </div>

        <div style={{ borderRadius: "0.75rem", padding: "16px", border: "1px solid #374151", color: "white" }}>
          <p >Total PnL</p>
          <h2 ref={pnlRef} className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>${totalPnL.toFixed(2)}</h2>
        </div>

        <div style={{ borderRadius: "0.75rem", padding: "16px", border: "1px solid #374151", color: "white" }}>
          <p >Total Trades</p>
          <h2 ref={totalTradesRef} style={{ fontWeight: "700" }}>{totalTrades}</h2>
        </div>
      </div>

      <div >
        <table style={{ width: "100%" }}>
          <thead >
            <tr>
              <th >Entry Price</th>
              <th >Exit Price</th>
              <th >PnL ($)</th>
              <th >Outcome</th>
              <th >Entry Idx</th>
              <th >Exit Idx</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <tr key={i} className={`transition-colors duration-300 ${t.outcome === 'win' ? 'bg-green-900/30 hover:bg-green-900/50' : 'bg-red-900/30 hover:bg-red-900/50'}`}>
                <td >${t.entryPrice.toFixed(2)}</td>
                <td >${t.exitPrice.toFixed(2)}</td>
                <td className={`p-2 font-semibold ${t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${t.pnl.toFixed(2)}
                </td>
                <td >
                  {t.outcome === 'win' ? '✅ Win' : '❌ Loss'}
                </td>
                <td >{t.entryIndex}</td>
                <td >{t.exitIndex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BacktestResultDisplay; 