
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Zap, Target, Brain, LineChart } from 'lucide-react';

interface TradingStyleStepProps {
  selectedStyles: string[];
  onStylesChange: (styles: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const TRADING_STYLES = [
  {
    id: 'scalping',
    name: 'Scalping',
    icon: <Zap className="w-6 h-6" />,
    description: 'Quick trades for small profits',
    characteristics: ['Very short holding times', 'High frequency', 'Small profits per trade']
  },
  {
    id: 'day_trading',
    name: 'Day Trading',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Intraday position trading',
    characteristics: ['Positions closed same day', 'Technical analysis focused', 'Active monitoring']
  },
  {
    id: 'swing_trading',
    name: 'Swing Trading',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Medium-term trend following',
    characteristics: ['Days to weeks holding', 'Technical + fundamental', 'Less time intensive']
  },
  {
    id: 'position_trading',
    name: 'Position Trading',
    icon: <LineChart className="w-6 h-6" />,
    description: 'Long-term investments',
    characteristics: ['Weeks to months holding', 'Fundamental analysis', 'Minimal daily monitoring']
  },
  {
    id: 'algorithmic',
    name: 'Algorithmic',
    icon: <Brain className="w-6 h-6" />,
    description: 'Automated trading systems',
    characteristics: ['Systematic approach', 'Backtested strategies', 'Emotion-free execution']
  },
  {
    id: 'news_trading',
    name: 'News Trading',
    icon: <Target className="w-6 h-6" />,
    description: 'Event-driven trading',
    characteristics: ['Economic events', 'Quick reactions', 'High volatility periods']
  }
];

const TradingStyleStep: React.FC<TradingStyleStepProps> = ({
  selectedStyles,
  onStylesChange,
  onNext,
  onBack
}) => {
  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      onStylesChange(selectedStyles.filter((id: string) => id !== styleId));
    } else {
      onStylesChange([...selectedStyles, styleId]);
    }
  };

  const isStyleSelected = (styleId: string) => selectedStyles.includes(styleId);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Select Your Trading Style</h2>
        <p className="text-gray-400">Choose the trading approaches that match your preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRADING_STYLES.map((style) => (
          <Card 
            key={style.id} 
            className={`cursor-pointer transition-all border-2 ${
              isStyleSelected(style.id)
                ? 'bg-blue-900/30 border-blue-500'
                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => toggleStyle(style.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className={`p-2 rounded-lg ${
                  isStyleSelected(style.id) ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  {style.icon}
                </div>
                <div>
                  <div className="font-semibold">{style.name}</div>
                  <div className="text-sm text-gray-400 font-normal">{style.description}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {style.characteristics.map((char: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {char}
                  </div>
                ))}
              </div>
              <Badge 
                className={`mt-3 w-full justify-center ${
                  isStyleSelected(style.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {isStyleSelected(style.id) ? 'Selected' : 'Select'}
              </Badge>
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
          disabled={selectedStyles.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TradingStyleStep;
