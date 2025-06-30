import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, ArrowLeft, User, Target, Clock, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface OnboardingData {
  experience_level: 'beginner' | 'intermediate' | 'expert';
  favorite_markets: string[];
  preferred_timeframes: string[];
  ai_goals: string[];
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
}

interface OnboardingModalProps {
  forceOpen?: boolean;
  onComplete?: () => void;
}

const OnboardingModal = ({ forceOpen = false, onComplete }: OnboardingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    experience_level: 'beginner',
    favorite_markets: [],
    preferred_timeframes: [],
    ai_goals: [],
    risk_profile: 'moderate'
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Check if user needs onboarding (only if not forced open)
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    
    const checkOnboardingStatus = async () => {
      if (!user) return;

      try {
        // Check if user_preferences exists with onboarding_completed
        const { data: userPrefs, error } = await supabase
          .from('user_preferences')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking onboarding status:', error);
          return;
        }

        // If no preferences exist or onboarding is not completed, show onboarding
        if (!userPrefs || !userPrefs.onboarding_completed) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkOnboardingStatus();
  }, [user, forceOpen]);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const toggleSelection = (value: string, field: keyof OnboardingData) => {
    setOnboardingData(prev => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleComplete = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    setIsLoading(true);
    try {
      // Save user preferences to Supabase
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          experience_level: onboardingData.experience_level,
          favorite_markets: onboardingData.favorite_markets,
          preferred_timeframes: onboardingData.preferred_timeframes,
          ai_goals: onboardingData.ai_goals,
          risk_profile: onboardingData.risk_profile,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (prefsError) {
        throw prefsError;
      }

      // Close the modal
      setIsOpen(false);
      
      // Show success message
      toast({
        title: "Onboarding Complete!",
        description: "Your preferences have been saved and your free trial has been activated.",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
      
      // Call the onComplete callback if provided
      onComplete?.();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const experienceOptions = [
    { value: 'beginner', label: 'Beginner', description: 'New to trading, want to learn the basics' },
    { value: 'intermediate', label: 'Intermediate', description: 'Have some experience, looking to improve' },
    { value: 'expert', label: 'Expert', description: 'Experienced trader, want advanced tools' }
  ];

  const marketOptions = [
    'BTC/USD', 'ETH/USD', 'SOL/USD', 'EUR/USD', 'GBP/USD', 
    'USD/JPY', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'
  ];

  const timeframeOptions = [
    'M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'
  ];

  const aiGoalOptions = [
    'Generate trade ideas', 'Backtest strategies', 
    'Journal analysis', 'Market education', 'Risk management'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to InsightFlow AI</h2>
              <p className="text-gray-400">Let's personalize your trading experience</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">What's your trading experience?</h3>
              {experienceOptions.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-colors ${
                    onboardingData.experience_level === option.value 
                      ? 'bg-blue-600/20 border-blue-400' 
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setOnboardingData(prev => ({ ...prev, experience_level: option.value as any }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{option.label}</h4>
                        <p className="text-sm text-gray-400">{option.description}</p>
                      </div>
                      {onboardingData.experience_level === option.value && (
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Favorite Markets</h2>
              <p className="text-gray-400">Choose markets you're interested in trading</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {marketOptions.map((market) => (
                  <Button
                    key={market}
                    variant={onboardingData.favorite_markets.includes(market) ? "default" : "outline"}
                    className={`${
                      onboardingData.favorite_markets.includes(market)
                        ? "bg-green-600/20 border-green-400 text-green-50"
                        : "bg-black/20 text-gray-300"
                    }`}
                    onClick={() => toggleSelection(market, 'favorite_markets')}
                  >
                    {market}
                    {onboardingData.favorite_markets.includes(market) && (
                      <CheckCircle className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Select at least one market to continue. You can add more markets later.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Timeframes</h2>
              <p className="text-gray-400">Select the chart timeframes you prefer to trade</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {timeframeOptions.map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={onboardingData.preferred_timeframes.includes(timeframe) ? "default" : "outline"}
                    className={`${
                      onboardingData.preferred_timeframes.includes(timeframe)
                        ? "bg-purple-600/20 border-purple-400 text-purple-50"
                        : "bg-black/20 text-gray-300"
                    }`}
                    onClick={() => toggleSelection(timeframe, 'preferred_timeframes')}
                  >
                    {timeframe}
                    {onboardingData.preferred_timeframes.includes(timeframe) && (
                      <CheckCircle className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Select at least one timeframe to continue. You can change your preferences later.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="mx-auto h-12 w-12 text-orange-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">AI Goals & Risk Profile</h2>
              <p className="text-gray-400">How would you like AI to help you trade?</p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">AI Assistance Goals</h3>
                <div className="grid grid-cols-1 gap-2">
                  {aiGoalOptions.map((goal) => (
                    <Button
                      key={goal}
                      variant={onboardingData.ai_goals.includes(goal) ? "default" : "outline"}
                      className={`justify-start ${
                        onboardingData.ai_goals.includes(goal)
                          ? "bg-orange-600/20 border-orange-400 text-orange-50"
                          : "bg-black/20 text-gray-300"
                      }`}
                      onClick={() => toggleSelection(goal, 'ai_goals')}
                    >
                      {goal}
                      {onboardingData.ai_goals.includes(goal) && (
                        <CheckCircle className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  These are optional but help us personalize your experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Risk Profile</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['conservative', 'moderate', 'aggressive'].map((risk) => (
                    <Button
                      key={risk}
                      variant={onboardingData.risk_profile === risk ? "default" : "outline"}
                      className={`capitalize ${
                        onboardingData.risk_profile === risk
                          ? "bg-blue-600/20 border-blue-400 text-blue-50"
                          : "bg-black/20 text-gray-300"
                      }`}
                      onClick={() => setOnboardingData(prev => ({ ...prev, risk_profile: risk as any }))}
                    >
                      {risk}
                      {onboardingData.risk_profile === risk && (
                        <CheckCircle className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl bg-black/90 border-white/20 text-white p-0">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
                variant="outline"
                onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !onboardingData.experience_level) ||
                  (currentStep === 2 && onboardingData.favorite_markets.length === 0) ||
                  (currentStep === 3 && onboardingData.preferred_timeframes.length === 0)
                }
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Setting up...' : 'Complete Setup'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
            </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal; 