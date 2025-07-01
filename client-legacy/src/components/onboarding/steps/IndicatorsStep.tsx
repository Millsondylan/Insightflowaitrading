import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, BarChart3, Target } from 'lucide-react';

interface IndicatorsStepProps {
  selectedIndicators: string[];
  onIndicatorsChange: (indicators: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const AVAILABLE_INDICATORS = [
  { id: 'sma', name: 'Simple Moving Average', category: 'trend' },
  { id: 'ema', name: 'Exponential Moving Average', category: 'trend' },
  { id: 'rsi', name: 'RSI', category: 'momentum' },
  { id: 'macd', name: 'MACD', category: 'momentum' },
  { id: 'bollinger', name: 'Bollinger Bands', category: 'volatility' },
  { id: 'stochastic', name: 'Stochastic', category: 'momentum' },
  { id: 'fibonacci', name: 'Fibonacci Retracement', category: 'support_resistance' },
  { id: 'volume', name: 'Volume', category: 'volume' },
];

const IndicatorsStep: React.FC<IndicatorsStepProps> = ({
  selectedIndicators,
  onIndicatorsChange,
  onNext,
  onBack
}) => {
  const toggleIndicator = (indicatorId: string) => {
    if (selectedIndicators.includes(indicatorId)) {
      onIndicatorsChange(selectedIndicators.filter((id: string) => id !== indicatorId));
    } else {
      onIndicatorsChange([...selectedIndicators, indicatorId]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'momentum': return <Activity className="w-4 h-4" />;
      case 'volatility': return <BarChart3 className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const groupedIndicators = AVAILABLE_INDICATORS.reduce((acc: Record<string, typeof AVAILABLE_INDICATORS>, ind: typeof AVAILABLE_INDICATORS[0]) => {
    if (!acc[ind.category]) acc[ind.category] = [];
    acc[ind.category].push(ind);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Select Your Preferred Indicators</h2>
        <p className="text-gray-400">Choose the technical indicators you use or want to learn about</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedIndicators).map(([category, indicators]) => (
          <Card key={category} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white capitalize">
                {getCategoryIcon(category)}
                {category.replace('_', ' & ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {indicators.map((ind: typeof AVAILABLE_INDICATORS[0]) => (
                  <Badge
                    key={ind.id}
                    variant={selectedIndicators.includes(ind.id) ? "default" : "outline"}
                    className={`p-3 cursor-pointer text-center justify-center transition-all ${
                      selectedIndicators.includes(ind.id)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    }`}
                    onClick={() => toggleIndicator(ind.id)}
                  >
                    {ind.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedIndicators.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default IndicatorsStep;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
