// TODO: implement portfolio performance dashboard
import React from 'react';

interface PortfolioDashboardProps {
  userId?: string;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ userId }) => {
  const [stats, setStats] = React.useState({
    totalValue: 125000,
    dayChange: 2.5,
    weekChange: 5.8,
    monthChange: -1.2,
    winRate: 68,
    profitFactor: 1.85,
    sharpeRatio: 1.42
  });

  return (
    <div >
      <Card style={{ padding: "24px" }}>
        <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Portfolio Overview</h2>
        <div >
          <div >
            <p >Total Value</p>
            <p style={{ fontWeight: "700", display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>💰</span>
              {stats.totalValue.toLocaleString()}
            </p>
          </div>
          <div >
            <p >Day Change</p>
            <p className={`text-2xl font-bold flex items-center gap-2 ${stats.dayChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.dayChange > 0 ? <span style={{fontSize: '16px'}}>📈</span> : <span style={{fontSize: '16px'}}>📉</span>}
              {stats.dayChange > 0 ? '+' : ''}{stats.dayChange}%
            </p>
          </div>
          <div >
            <p >Win Rate</p>
            <div >
              <p style={{ fontWeight: "700" }}>{stats.winRate}%</p>
              <Progress value={stats.winRate}  />
            </div>
          </div>
          <div >
            <p >Sharpe Ratio</p>
            <p style={{ fontWeight: "700", display: "flex", alignItems: "center" }}>
              <Activity  />
              {stats.sharpeRatio}
            </p>
          </div>
        </div>
      </Card>

      <Card style={{ padding: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>Performance Metrics</h3>
        <div >
          <div>
            <p >Week Performance</p>
            <p className={`font-bold ${stats.weekChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.weekChange > 0 ? '+' : ''}{stats.weekChange}%
            </p>
          </div>
          <div>
            <p >Month Performance</p>
            <p className={`font-bold ${stats.monthChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.monthChange > 0 ? '+' : ''}{stats.monthChange}%
            </p>
          </div>
          <div>
            <p >Profit Factor</p>
            <p style={{ fontWeight: "700" }}>{stats.profitFactor}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}; 