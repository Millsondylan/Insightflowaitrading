import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface TradeQualityMetrics {
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  totalTrades: number;
}

interface TradeQualityWidgetProps {
  metrics?: TradeQualityMetrics;
}

const TradeQualityWidget: React.FC<TradeQualityWidgetProps> = ({ 
  metrics = {
    winRate: 65,
    avgWin: 2.5,
    avgLoss: -1.2,
    profitFactor: 2.1,
    totalTrades: 24
  }
}) => {
  const getQualityColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-400';
    if (winRate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityLabel = (winRate: number) => {
    if (winRate >= 70) return 'Excellent';
    if (winRate >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-cyan-400" />
          Trade Quality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">Win Rate</span>
          <span className={`font-semibold ${getQualityColor(metrics.winRate)}`}>
            {metrics.winRate}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">Quality</span>
          <span className={`text-sm ${getQualityColor(metrics.winRate)}`}>
            {getQualityLabel(metrics.winRate)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{metrics.avgWin}%</span>
            </div>
            <p className="text-white/50 text-xs mt-1">Avg Win</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-400">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">{metrics.avgLoss}%</span>
            </div>
            <p className="text-white/50 text-xs mt-1">Avg Loss</p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Profit Factor</span>
            <span className="text-white font-medium">{metrics.profitFactor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Total Trades</span>
            <span className="text-white font-medium">{metrics.totalTrades}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeQualityWidget; 