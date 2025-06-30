import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface FavoritePair {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface FavoritePairWidgetProps {
  pairs?: FavoritePair[];
}

const FavoritePairWidget: React.FC<FavoritePairWidgetProps> = ({ 
  pairs = [
    { symbol: 'EUR/USD', currentPrice: 1.0850, change: 0.0025, changePercent: 0.23, volume: 125000 },
    { symbol: 'GBP/USD', currentPrice: 1.2650, change: -0.0015, changePercent: -0.12, volume: 98000 },
    { symbol: 'USD/JPY', currentPrice: 148.50, change: 0.75, changePercent: 0.51, volume: 156000 }
  ]
}) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-cyan-400" />
          Favorite Pairs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pairs.map((pair) => (
          <div key={pair.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm">{pair.symbol}</h4>
              <p className="text-white/60 text-xs mt-1">
                Vol: {pair.volume.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-white font-medium text-sm">
                {pair.currentPrice.toFixed(4)}
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                pair.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {pair.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FavoritePairWidget; 