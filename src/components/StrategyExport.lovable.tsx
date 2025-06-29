import React from 'react';

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

const StrategyExport = ({ result }: Props) => {
  if (!result || result.trades.length === 0) {
    return null;
  }

  const downloadFile = (content: string, filename: string, type: string = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(result, null, 2);
    downloadFile(jsonContent, "strategy-backtest.json", "application/json");
  };

  const handleExportCSV = () => {
    const header = "Entry Index,Exit Index,Entry Price,Exit Price,PNL,Outcome";
    const rows = result.trades.map(trade => 
      [
        trade.entryIndex,
        trade.exitIndex,
        trade.entryPrice,
        trade.exitPrice,
        trade.pnl,
        trade.outcome
      ].join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    downloadFile(csvContent, "strategy-trades.csv", "text/csv");
  };

  return (
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
        <h3 style={{ fontWeight: "700", color: "white" }}>Export Results</h3>
        <div style={{ display: "flex" }}>
            <button
              onClick={handleExportJSON}
              style={{ display: "flex", alignItems: "center", color: "white", paddingLeft: "16px", paddingRight: "16px" }}
              title="Download full backtest result as a JSON file"
            >
              🧾 Export JSON
            </button>

            <button
              onClick={handleExportCSV}
              style={{ display: "flex", alignItems: "center", color: "white", paddingLeft: "16px", paddingRight: "16px" }}
              title="Download trade list as a CSV file"
            >
              📊 Export CSV
            </button>
        </div>
    </div>
  );
};

export default StrategyExport; 