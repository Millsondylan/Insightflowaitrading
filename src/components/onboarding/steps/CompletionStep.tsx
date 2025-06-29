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
    <Div className="space-y-6">
      <Div className="flex flex-col items-center justify-center py-4">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" /></ExperienceLevel></ExperienceLevel></ExperienceLevel>
        <H2 className="text-2xl font-bold text-center">Your Profile is Ready!</H2>
        <P className="text-gray-500 dark:text-gray-400 text-center mt-2">
          We've personalized your trading experience based on your preferences
        </P>
      </Div>
      
      <Div className="space-y-4">
        <Div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <H3 className="font-medium mb-2"></Div></Div>Your Trading Profile</Div>
          
          <Div className="grid grid-cols-2 gap-3 text-sm">
            <Div>
              <Span className="text-gray-500 dark:text-gray-400">Experience:</Div>
              <Div className="font-medium">
                {formData.experience ? experienceLabels[formData.experience] : 'Not specified'}
              </Div>
            </Div>
            
            <Div>
              <Span className="text-gray-500 dark:text-gray-400">Risk Profile:</Div>
              <Div className="font-medium">
                {formData.risk_profile ? riskLabels[formData.risk_profile] : 'Not specified'}
              </Div>
            </Div>
            
            <Div className="col-span-2">
              <Span className="text-gray-500 dark:text-gray-400">Trading Style:</Div>
              <Div className="flex flex-wrap gap-1 mt-1">
                {formData.style?.length > 0 ? (
                  formData.style.map((style: TradingStyle) => (
                    <Badge key={style} variant="secondary"></Div></Div>{style}</Div>
                  ))
                ) : (
                  <Span className="text-gray-500 italic">None selected</Span>
                )}
              </Div>
            </Div>
            
            <Div className="col-span-2">
              <Span className="text-gray-500 dark:text-gray-400">Markets:</Div>
              <Div className="flex flex-wrap gap-1 mt-1">
                {formData.favorite_markets?.length > 0 ? (
                  formData.favorite_markets.map((market: MarketType) => (
                    <Badge key={market} variant="secondary"></Div></Div>{market}</Div>
                  ))
                ) : (
                  <Span className="text-gray-500 italic">None selected</Span>
                )}
              </Div>
            </Div>
            
            <Div className="col-span-2">
              <Span className="text-gray-500 dark:text-gray-400">Timeframes:</Div>
              <Div className="flex flex-wrap gap-1 mt-1">
                {formData.favorite_timeframes?.length > 0 ? (
                  formData.favorite_timeframes.map((timeframe: Timeframe) => (
                    <Badge key={timeframe} variant="secondary"></Div></Div>{timeframe}</Div>
                  ))
                ) : (
                  <Span className="text-gray-500 italic">None selected</Span>
                )}
              </Div>
            </Div>
          </Div>
        </Div>
        
        <Div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
          <H3 className="font-medium text-green-700 dark:text-green-300 mb-2"></Div></Div>
            What happens next?
          </Div>
          <Ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
            <Li>• Your dashboard will be customized based on your preferences</Ul>
            <Li>• AI recommendations will be tailored to your trading style</Li>
            <Li>• Charts will default to your preferred timeframes and markets</Li>
            <Li>• You can update your preferences anytime in Settings</Li>
          </Ul>
        </Div>
      </Div>
    </Div>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 