import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  ExperienceLevel, 
  TradingStyle, 
  MarketType, 
  Timeframe, 
  RiskProfile 
} from '@/types/profile';

export default function CompletionStep() {
  const { getValues } = useFormContext();
  const formData = getValues();
  
  const experienceLabels: Record<ExperienceLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    pro: 'Pro'
  };
  
  const riskLabels: Record<RiskProfile, string> = {
    conservative: 'Conservative',
    moderate: 'Moderate',
    aggressive: 'Aggressive'
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-4">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4"/>
        <h2 className="text-2xl font-bold text-center">Your Profile is Ready!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
          We've personalized your trading experience based on your preferences
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-medium mb-2">Your Trading Profile</h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Experience:</span>
              <div className="font-medium">
                {formData.experience ? experienceLabels[formData.experience] : 'Not specified'}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">Risk Profile:</span>
              <div className="font-medium">
                {formData.risk_profile ? riskLabels[formData.risk_profile] : 'Not specified'}
              </div>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-500 dark:text-gray-400">Trading Style:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.style?.length > 0 ? (
                  formData.style.map((style: TradingStyle) => (
                    <Badge key={style} variant="secondary">{style}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 italic">None selected</span>
                )}
              </div>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-500 dark:text-gray-400">Markets:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.favorite_markets?.length > 0 ? (
                  formData.favorite_markets.map((market: MarketType) => (
                    <Badge key={market} variant="secondary">{market}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 italic">None selected</span>
                )}
              </div>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-500 dark:text-gray-400">Timeframes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.favorite_timeframes?.length > 0 ? (
                  formData.favorite_timeframes.map((timeframe: Timeframe) => (
                    <Badge key={timeframe} variant="secondary">{timeframe}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 italic">None selected</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
          <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">
            What happens next?
          </h3>
          <ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
            <li>• Your dashboard will be customized based on your preferences</li>
            <li>• AI recommendations will be tailored to your trading style</li>
            <li>• Charts will default to your preferred timeframes and markets</li>
            <li>• You can update your preferences anytime in Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 