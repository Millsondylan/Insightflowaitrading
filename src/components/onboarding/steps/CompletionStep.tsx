import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, TrendingUp, Clock, BarChart3, Target } from 'lucide-react';

type ExperienceLevel = 'beginner' | 'intermediate' | 'pro';
type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

interface CompletionStepProps {
  experience: ExperienceLevel;
  selectedStyles: string[];
  selectedMarkets: string[];
  selectedTimeframes: string[];
  selectedIndicators: string[];
  favoriteSymbols: string[];
  riskProfile: RiskProfile;
  onComplete: () => void;
  onBack: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({
  experience,
  selectedStyles,
  selectedMarkets,
  selectedTimeframes,
  selectedIndicators,
  favoriteSymbols,
  riskProfile,
  onComplete,
  onBack
}) => {
  const experienceLabels: Record<ExperienceLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    pro: 'Professional'
  };

  const riskLabels: Record<RiskProfile, string> = {
    conservative: 'Conservative',
    moderate: 'Moderate',
    aggressive: 'Aggressive'
  };

  const getExperienceLabel = (exp: ExperienceLevel) => experienceLabels[exp] || 'Unknown';
  const getRiskLabel = (risk: RiskProfile) => riskLabels[risk] || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Profile Complete!</h2>
        <p className="text-gray-400">Review your trading profile before we get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              Experience & Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Experience Level:</span>
              <Badge className="bg-blue-600 text-white">
                {getExperienceLabel(experience)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Risk Profile:</span>
              <Badge className="bg-purple-600 text-white">
                {getRiskLabel(riskProfile)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5" />
              Trading Styles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedStyles.map((style) => (
                <Badge key={style} variant="outline" className="bg-gray-700 text-gray-300">
                  {style.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5" />
              Markets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedMarkets.map((market) => (
                <Badge key={market} variant="outline" className="bg-gray-700 text-gray-300">
                  {market.charAt(0).toUpperCase() + market.slice(1)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5" />
              Timeframes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedTimeframes.map((timeframe) => (
                <Badge key={timeframe} variant="outline" className="bg-gray-700 text-gray-300">
                  {timeframe}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {favoriteSymbols.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5" />
              Favorite Symbols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {favoriteSymbols.map((symbol) => (
                <Badge key={symbol} className="bg-green-600 text-white">
                  {symbol}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
