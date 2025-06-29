// TODO: implement portfolio performance dashboard
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface PortfolioDashboardProps {
  userId?: string;
}

export const PortfolioDashboard: React.FC<portfoliodashboardprops  > = ({ userId }) => {
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
      <card  >
        <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <dollarsign  >
              {stats.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Day Change</p>
            <p className={`text-2xl font-bold flex items-center gap-2 ${stats.dayChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.dayChange > 0 ? <trendingup  > : <trendingdown  >}
              {stats.dayChange > 0 ? '+' : ''}{stats.dayChange}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.winRate}%</p>
              <progress  >
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <activity  >
              {stats.sharpeRatio}
            </p>
          </div>
        </div>
      </Card>

      <card  >
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
