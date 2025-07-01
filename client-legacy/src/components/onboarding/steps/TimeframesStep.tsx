import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Calendar, Timer } from 'lucide-react';

interface TimeframesStepProps {
  selectedTimeframes: string[];
  onTimeframesChange: (timeframes: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const TIMEFRAME_CATEGORIES = [
  {
    name: 'Scalping',
    icon: <Zap className="w-5 h-5" />,
    timeframes: ['1m', '5m', '15m'],
    description: 'Very short-term trades'
  },
  {
    name: 'Day Trading',
    icon: <Clock className="w-5 h-5" />,
    timeframes: ['30m', '1h', '4h'],
    description: 'Intraday trading'
  },
  {
    name: 'Swing Trading',
    icon: <Timer className="w-5 h-5" />,
    timeframes: ['1d', '2d', '3d'],
    description: 'Short to medium term'
  },
  {
    name: 'Position Trading',
    icon: <Calendar className="w-5 h-5" />,
    timeframes: ['1w', '1M'],
    description: 'Long-term positions'
  }
];

const TimeframesStep: React.FC<TimeframesStepProps> = ({
  selectedTimeframes,
  onTimeframesChange,
  onNext,
  onBack
}) => {
  const toggleTimeframe = (timeframe: string) => {
    if (selectedTimeframes.includes(timeframe)) {
      onTimeframesChange(selectedTimeframes.filter((tf: string) => tf !== timeframe));
    } else {
      onTimeframesChange([...selectedTimeframes, timeframe]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Select Your Timeframes</h2>
        <p className="text-gray-400">Choose the timeframes you prefer for trading</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIMEFRAME_CATEGORIES.map((category) => (
          <Card key={category.name} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                {category.icon}
                <div>
                  <div>{category.name}</div>
                  <div className="text-sm text-gray-400 font-normal">{category.description}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.timeframes.map((timeframe) => (
                  <Badge
                    key={timeframe}
                    variant={selectedTimeframes.includes(timeframe) ? "default" : "outline"}
                    className={`p-3 cursor-pointer text-center justify-center transition-all ${
                      selectedTimeframes.includes(timeframe)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    }`}
                    onClick={() => toggleTimeframe(timeframe)}
                  >
                    {timeframe}
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
          disabled={selectedTimeframes.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TimeframesStep;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
