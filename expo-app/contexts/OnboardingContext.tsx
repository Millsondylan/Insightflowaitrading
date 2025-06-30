import React, { createContext, useContext, ReactNode } from 'react';
import { useOnboardingStore } from '@/store/onboarding';

interface OnboardingContextProps {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;
  experienceLevel: string;
  setExperienceLevel: (level: string) => void;
  favoritePairs: string[];
  setFavoritePairs: (pairs: string[]) => void;
  preferredTimeframes: string[];
  setPreferredTimeframes: (timeframes: string[]) => void;
  riskSettings: {
    defaultRiskPercent: number;
    maxRiskPerTrade: number;
  };
  setRiskSettings: (settings: any) => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export const OnboardingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Use the onboarding store directly
  const {
    hasSeenWelcome,
    setHasSeenWelcome,
    experienceLevel,
    setExperienceLevel,
    favoritePairs,
    setFavoritePairs,
    preferredTimeframes,
    setPreferredTimeframes,
    riskSettings,
    setRiskSettings,
  } = useOnboardingStore();

  return (
    <OnboardingContext.Provider
      value={{
        hasSeenWelcome,
        setHasSeenWelcome,
        experienceLevel,
        setExperienceLevel,
        favoritePairs,
        setFavoritePairs,
        preferredTimeframes,
        setPreferredTimeframes,
        riskSettings,
        setRiskSettings,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 