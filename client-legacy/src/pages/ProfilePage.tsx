import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingFormData } from '@/types/profile';
import { onboardingSchema } from '@/lib/validations/onboarding-schema';

// Import step components
import ExperienceLevelStep from '@/components/onboarding/steps/ExperienceLevelStep';
import TradingStyleStep from '@/components/onboarding/steps/TradingStyleStep';
import MarketsStep from '@/components/onboarding/steps/MarketsStep';
import TimeframesStep from '@/components/onboarding/steps/TimeframesStep';
import IndicatorsStep from '@/components/onboarding/steps/IndicatorsStep';
import RiskProfileStep from '@/components/onboarding/steps/RiskProfileStep';
import AIPreferencesStep from '@/components/onboarding/steps/AIPreferencesStep';

export default function ProfilePage() {
  const { profile, updateProfile, isLoading: profileLoading } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
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
  
  // Update form values when profile loads
  useEffect(() => {
    if (profile && !profileLoading) {
      methods.reset({
        experience: profile.experience || undefined,
        struggles: profile.struggles || '',
        style: profile.style || [],
        favorite_markets: profile.favorite_markets || [],
        favorite_symbols: profile.favorite_symbols || [],
        favorite_timeframes: profile.favorite_timeframes || [],
        indicators: profile.indicators || [],
        risk_profile: profile.risk_profile || undefined,
        wants_ai_trading: profile.wants_ai_trading,
        wants_voice_coach: profile.wants_voice_coach,
        wants_alerts: profile.wants_alerts,
      });
    }
  }, [profile, profileLoading, methods]);
  
  // Handle form submission
  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
      
      toast({
        title: "Profile updated",
        description: "Your trading preferences have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Trading Profile | InsightFlow AI</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Trading Profile</h1>
          
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Tabs defaultValue="experience" className="w-full">
                <div className="mb-6 overflow-auto pb-2">
                  <TabsList className="inline-flex min-w-max">
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="style">Trading Style</TabsTrigger>
                    <TabsTrigger value="markets">Markets</TabsTrigger>
                    <TabsTrigger value="timeframes">Timeframes</TabsTrigger>
                    <TabsTrigger value="indicators">Indicators</TabsTrigger>
                    <TabsTrigger value="risk">Risk Profile</TabsTrigger>
                    <TabsTrigger value="ai">AI Preferences</TabsTrigger>
                  </TabsList>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Preferences</CardTitle>
                    <CardDescription>
                      Customize your trading profile to get personalized recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <TabsContent value="experience" className="mt-0">
                      <ExperienceLevelStep />
                    </TabsContent>
                    
                    <TabsContent value="style" className="mt-0">
                      <TradingStyleStep />
                    </TabsContent>
                    
                    <TabsContent value="markets" className="mt-0">
                      <MarketsStep />
                    </TabsContent>
                    
                    <TabsContent value="timeframes" className="mt-0">
                      <TimeframesStep />
                    </TabsContent>
                    
                    <TabsContent value="indicators" className="mt-0">
                      <IndicatorsStep />
                    </TabsContent>
                    
                    <TabsContent value="risk" className="mt-0">
                      <RiskProfileStep />
                    </TabsContent>
                    
                    <TabsContent value="ai" className="mt-0">
                      <AIPreferencesStep />
                    </TabsContent>
                  </CardContent>
                </Card>
                
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4"/>
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </Tabs>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 