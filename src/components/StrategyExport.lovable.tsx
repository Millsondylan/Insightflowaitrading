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
    <div className="rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow-md space-y-4">
        <h3 className="text-lg font-bold text-white">Export Results</h3>
        <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 bg-white/10 hover:bg-cyan-600/80 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-300"
              title="Download full backtest result as a JSON file"
            >
              🧾 Export JSON
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-white/10 hover:bg-green-600/80 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-300"
              title="Download trade list as a CSV file"
            >
              📊 Export CSV
            </button>
        </div>
    </div>
  );
};

export default StrategyExport; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
