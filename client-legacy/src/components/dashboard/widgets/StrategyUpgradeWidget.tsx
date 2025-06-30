import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Target } from 'lucide-react';

interface StrategyUpgrade {
  id: string;
  title: string;
  description: string;
  improvement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

interface StrategyUpgradeWidgetProps {
  upgrades?: StrategyUpgrade[];
}

const StrategyUpgradeWidget: React.FC<StrategyUpgradeWidgetProps> = ({ 
  upgrades = [
    {
      id: '1',
      title: 'Add Volume Confirmation',
      description: 'Include volume analysis in your entry criteria',
      improvement: '+15% win rate',
      difficulty: 'easy',
      estimatedTime: '30 min'
    },
    {
      id: '2',
      title: 'Implement Trailing Stops',
      description: 'Use dynamic stop losses to protect profits',
      improvement: '+8% profit factor',
      difficulty: 'medium',
      estimatedTime: '1 hour'
    }
  ]
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-cyan-400" />
          Strategy Upgrades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upgrades.map((upgrade) => (
          <div key={upgrade.id} className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-medium text-sm">{upgrade.title}</h4>
              <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(upgrade.difficulty)} bg-white/10`}>
                {upgrade.difficulty}
              </span>
            </div>
            <p className="text-white/60 text-xs mb-2">{upgrade.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                {upgrade.improvement}
              </div>
              <div className="flex items-center gap-1 text-white/40 text-xs">
                <Target className="h-3 w-3" />
                {upgrade.estimatedTime}
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
              Apply Upgrade
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StrategyUpgradeWidget; 