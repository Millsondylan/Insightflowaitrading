import React, { createContext, useContext, useState } from 'react';

interface OnboardingContextType {
  profile: any;
  isLoading: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  updateProfile: (data: any) => Promise<any>;
  completeOnboarding: (data: any) => Promise<any>;
  refreshProfile: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const updateProfile = async (data: any): Promise<any> => {
    console.log('Mock updateProfile:', data);
    return null;
  };

  const completeOnboarding = async (data: any): Promise<any> => {
    console.log('Mock completeOnboarding:', data);
    setShowOnboarding(false);
    return null;
  };

  const refreshProfile = async (): Promise<void> => {
    console.log('Mock refreshProfile');
  };

  return (
    <OnboardingContext.Provider
      value={{
        profile,
        isLoading,
        showOnboarding,
        setShowOnboarding,
        updateProfile,
        completeOnboarding,
        refreshProfile
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;