import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingFormData } from '@/types/profile';
import { onboardingSchema } from '@/lib/validations/onboarding-schema';

// Import step components
import ExperienceLevelStep from './steps/ExperienceLevelStep';
import TradingStyleStep from './steps/TradingStyleStep';
import MarketsStep from './steps/MarketsStep';
import TimeframesStep from './steps/TimeframesStep';
import IndicatorsStep from './steps/IndicatorsStep';
import RiskProfileStep from './steps/RiskProfileStep';
import AIPreferencesStep from './steps/AIPreferencesStep';
import CompletionStep from './steps/CompletionStep';

type Step = {
  id: string;
  title: string;
  component: React.ReactNode;
  optional?: boolean;
};

export default function OnboardingModal() {
  const { showOnboarding, setShowOnboarding, completeOnboarding } = useOnboarding();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up form with React Hook Form and Zod validation
  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      experience: undefined,
      struggles: '',
      style: [],
      favorite_markets: [],
      favorite_symbols: [],
      favorite_timeframes: [],
      indicators: [],
      risk_profile: undefined,
      wants_ai_trading: false,
      wants_voice_coach: false,
      wants_alerts: false,
    },
    mode: 'onChange',
  });
  
  // Define steps
  const steps: Step[] = [
    {
      id: 'experience',
      title: 'Experience Level',
      component: <ExperienceLevelStep />,
    },
    {
      id: 'style',
      title: 'Trading Style',
      component: <TradingStyleStep />,
    },
    {
      id: 'markets',
      title: 'Preferred Markets',
      component: <MarketsStep />,
    },
    {
      id: 'timeframes',
      title: 'Favorite Timeframes',
      component: <TimeframesStep />,
    },
    {
      id: 'indicators',
      title: 'Technical Indicators',
      component: <IndicatorsStep />,
    },
    {
      id: 'risk',
      title: 'Risk Profile',
      component: <RiskProfileStep />,
    },
    {
      id: 'ai',
      title: 'AI Preferences',
      component: <AIPreferencesStep />,
      optional: true,
    },
    {
      id: 'completion',
      title: 'All Set!',
      component: <CompletionStep />,
    },
  ];
  
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isCompletionStep = currentStep.id === 'completion';
  
  // Handle next step
  const handleNext = async () => {
    const fields = getFieldsForCurrentStep();
    
    // Validate current step fields
    const isValid = await methods.trigger(fields as any);
    
    if (!isValid && !currentStep.optional) {
      return;
    }
    
    if (isLastStep) {
      await handleSubmit();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    setCurrentStepIndex((prev) => prev - 1);
  };
  
  // Get fields for current step validation
  const getFieldsForCurrentStep = (): (keyof OnboardingFormData)[] => {
    switch (currentStep.id) {
      case 'experience':
        return ['experience', 'struggles'];
      case 'style':
        return ['style'];
      case 'markets':
        return ['favorite_markets', 'favorite_symbols'];
      case 'timeframes':
        return ['favorite_timeframes'];
      case 'indicators':
        return ['indicators'];
      case 'risk':
        return ['risk_profile'];
      case 'ai':
        return ['wants_ai_trading', 'wants_voice_coach', 'wants_alerts'];
      default:
        return [];
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const data = methods.getValues();
      await completeOnboarding(data);
    } catch (error) {
      console.error('Error submitting onboarding form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle closing the modal (only allow if not required)
  const handleClose = () => {
    // Don't allow closing if onboarding is required
    setShowOnboarding(false);
  };
  
  return (
    <Dialog open={showOnboarding} onOpenChange={handleClose} />
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" />
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center" />
            {currentStep.title}
          </OnboardingFormData>
          
          {/* Progress indicator */}
          <Div className="w-full flex justify-center mt-4">
            <Div className="flex space-x-2">
              {steps.map((step, index) => (
                <Div                   key={step.id}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </Div>
          </div />
        
        <FormProvider {...methods} />
          <Form className="space-y-6 py-4">
            {/* Current step content */}
            <Div className="min-h-[300px]">
              {currentStep.component}
            </FormProvider>
            
            {/* Navigation buttons */}
            <Div className="flex justify-between pt-4 border-t border-gray-200">
              <Button type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep || isSubmitting}
  >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Div>
              
              <Button type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className={isCompletionStep ? 'bg-green-600 hover:bg-green-700' : ''}
  >
                {isSubmitting ? (
                  <Span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </Button>
                ) : isCompletionStep ? (
                  <Span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </Span>
                ) : (
                  <Span className="flex items-center">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" /></Span></Span></Span></Span></Span></Span>
                  </Span>
                )}
              </Button>
            </div />
        </FormProvider />
    </Dialog>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 