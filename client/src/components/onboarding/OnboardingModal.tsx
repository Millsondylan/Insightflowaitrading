import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight, ArrowLeft, User, Target, TrendingUp, Settings, CheckCircle } from 'lucide-react';

interface OnboardingData {
  experience: 'beginner' | 'intermediate' | 'expert';
  favorite_markets: string[];
  favorite_timeframes: string[];
  trading_style: string[];
  ai_goals: string[];
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
}

interface OnboardingModalProps {
  forceOpen?: boolean;
  onComplete?: () => void;
}

const OnboardingModal = ({ forceOpen = false, onComplete }: OnboardingModalProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    experience: 'beginner',
    favorite_markets: [],
    favorite_timeframes: [],
    trading_style: [],
    ai_goals: [],
    risk_profile: 'moderate'
  });

  const totalSteps = 5;
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
        // First check if user_profile exists, if not create one
        const { data: userProfile, error } = await (supabase as any)
          .from('user_profile')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking onboarding status:', error);
          return;
        }

        // If no profile exists or onboarding is not completed, show onboarding
        if (!userProfile || !userProfile.onboarding_completed) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkOnboardingStatus();
  }, [user, forceOpen]);

  const experienceOptions = [
    { value: 'beginner', label: 'Beginner', description: 'New to trading, want to learn the basics' },
    { value: 'intermediate', label: 'Intermediate', description: 'Have some experience, looking to improve' },
    { value: 'expert', label: 'Expert', description: 'Experienced trader, want advanced tools' }
  ];

  const marketOptions = [
    'Forex (EUR/USD, GBP/USD)', 'Crypto (BTC, ETH)', 'Stocks (SPY, AAPL)', 
    'Commodities (Gold, Oil)', 'Indices (S&P 500, NASDAQ)', 'Bonds'
  ];

  const timeframeOptions = [
    'M1 (1 Minute)', 'M5 (5 Minutes)', 'M15 (15 Minutes)', 'M30 (30 Minutes)',
    'H1 (1 Hour)', 'H4 (4 Hours)', 'D1 (Daily)', 'W1 (Weekly)'
  ];

  const styleOptions = [
    'Scalping', 'Day Trading', 'Swing Trading', 'Position Trading',
    'Algorithmic', 'News Trading', 'Technical Analysis', 'Fundamental Analysis'
  ];

  const aiGoalOptions = [
    'Backtest Strategies', 'Generate Trade Ideas', 'Journal Analysis',
    'Market Education', 'Risk Management', 'Real-time Alerts'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Save onboarding data to user_profile
      const { error: profileError } = await (supabase as any)
        .from('user_profile')
        .upsert({
          user_id: user.id,
          experience: onboardingData.experience,
          favorite_markets: onboardingData.favorite_markets,
          favorite_timeframes: onboardingData.favorite_timeframes,
          style: onboardingData.trading_style,
          risk_profile: onboardingData.risk_profile,
          wants_ai_trading: onboardingData.ai_goals.includes('Generate Trade Ideas'),
          wants_voice_coach: onboardingData.ai_goals.includes('Market Education'),
          wants_alerts: onboardingData.ai_goals.includes('Real-time Alerts'),
          onboarding_completed: true
        });

      if (profileError) throw profileError;

      // Grant free trial subscription
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      const { error: profileUpdateError } = await (supabase as any)
        .from('profiles')
        .update({
          subscription_tier: 'trial',
          base_trial_end: trialEndDate.toISOString()
        })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      // Save user preferences
      const { error: preferencesError } = await (supabase as any)
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          trading_style: onboardingData.trading_style[0] || 'swing',
          favorite_indicators: ['EMA', 'RSI'], // Default indicators
          language: 'en',
          theme: 'dark'
        });

      if (preferencesError) throw preferencesError;

      toast({
        title: "Welcome to InsightFlow AI! 🎉",
        description: "Your account has been set up with a 14-day free trial.",
        duration: 5000,
      });

      setIsOpen(false);
      
      // Call onComplete callback if provided, otherwise navigate to dashboard
      if (onComplete) {
        onComplete();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (value: string, field: keyof OnboardingData) => {
    setOnboardingData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

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
                    onboardingData.experience === option.value 
                      ? 'bg-blue-600/20 border-blue-400' 
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setOnboardingData(prev => ({ ...prev, experience: option.value as any }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{option.label}</h4>
                        <p className="text-sm text-gray-400">{option.description}</p>
                      </div>
                      {onboardingData.experience === option.value && (
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
              <TrendingUp className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Markets</h2>
              <p className="text-gray-400">Select the markets you're interested in trading</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {marketOptions.map((market) => (
                <Button
                  key={market}
                  variant={onboardingData.favorite_markets.includes(market) ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => toggleSelection(market, 'favorite_markets')}
                >
                  {market}
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Trading Preferences</h2>
              <p className="text-gray-400">Tell us about your trading style and timeframes</p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Preferred Timeframes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {timeframeOptions.map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={onboardingData.favorite_timeframes.includes(timeframe) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSelection(timeframe, 'favorite_timeframes')}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Trading Style</h3>
                <div className="grid grid-cols-2 gap-2">
                  {styleOptions.map((style) => (
                    <Button
                      key={style}
                      variant={onboardingData.trading_style.includes(style) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSelection(style, 'trading_style')}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="mx-auto h-12 w-12 text-orange-400 mb-4" />
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
                      className="justify-start"
                      onClick={() => toggleSelection(goal, 'ai_goals')}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Risk Profile</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['conservative', 'moderate', 'aggressive'].map((risk) => (
                    <Button
                      key={risk}
                      variant={onboardingData.risk_profile === risk ? "default" : "outline"}
                      className="capitalize"
                      onClick={() => setOnboardingData(prev => ({ ...prev, risk_profile: risk as any }))}
                    >
                      {risk}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">You're All Set! 🎉</h2>
              <p className="text-gray-400">Review your preferences and start your free trial</p>
            </div>
            <div className="space-y-4">
              <Card className="bg-green-600/10 border-green-400/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Free Trial Activated</h3>
                  <p className="text-sm text-gray-300">You'll get 14 days of full access to all premium features</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-white">Experience</h4>
                  <Badge variant="secondary" className="mt-1">{onboardingData.experience}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Risk Profile</h4>
                  <Badge variant="secondary" className="mt-1">{onboardingData.risk_profile}</Badge>
                </div>
                <div className="col-span-2">
                  <h4 className="font-semibold text-white">Markets</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {onboardingData.favorite_markets.slice(0, 3).map(market => (
                      <Badge key={market} variant="outline" className="text-xs">{market.split(' ')[0]}</Badge>
                    ))}
                    {onboardingData.favorite_markets.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{onboardingData.favorite_markets.length - 3} more</Badge>
                    )}
                  </div>
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
                  (currentStep === 1 && !onboardingData.experience) ||
                  (currentStep === 2 && onboardingData.favorite_markets.length === 0) ||
                  (currentStep === 3 && onboardingData.favorite_timeframes.length === 0) ||
                  (currentStep === 4 && onboardingData.ai_goals.length === 0)
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