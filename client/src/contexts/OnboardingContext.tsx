import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, defaultUserProfile } from '@/types/profile';
import { useAuth } from '@/hooks/use-auth';
import { profileService } from '@/lib/profile/profileService';

interface OnboardingContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile | null>;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<UserProfile | null>;
  refreshProfile: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Fetch user profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const userProfile = await profileService.getOrInitProfile(user.id);
        setProfile(userProfile);
        
        // Show onboarding modal if onboarding is not completed
        if (!userProfile.onboarding_completed) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile | null> => {
    if (!user || !profile) return null;

    try {
      const updatedProfile = await profileService.updateProfile(user.id, data);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  };

  const completeOnboarding = async (data: Partial<UserProfile>): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      const updatedProfile = await profileService.updateProfile(user.id, {
        ...data,
        onboarding_completed: true
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        setShowOnboarding(false);
      }
      
      return updatedProfile;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return null;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userProfile = await profileService.getProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsLoading(false);
    }
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 