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
    <div className="space-y-6">
      <Card className="theme-card p-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <span style={{fontSize: '16px'}}>💰</span>
              {stats.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Day Change</p>
            <p className={`text-2xl font-bold flex items-center gap-2 ${stats.dayChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.dayChange > 0 ? <span style={{fontSize: '16px'}}>📈</span> : <span style={{fontSize: '16px'}}>📉</span>}
              {stats.dayChange > 0 ? '+' : ''}{stats.dayChange}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.winRate}%</p>
              <Progress value={stats.winRate} className="h-2" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {stats.sharpeRatio}
            </p>
          </div>
        </div>
      </Card>

      <Card className="theme-card p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Week Performance</p>
            <p className={`font-bold ${stats.weekChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.weekChange > 0 ? '+' : ''}{stats.weekChange}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Month Performance</p>
            <p className={`font-bold ${stats.monthChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.monthChange > 0 ? '+' : ''}{stats.monthChange}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit Factor</p>
            <p className="font-bold">{stats.profitFactor}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}; 