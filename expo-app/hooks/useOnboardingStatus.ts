import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth';

export function useOnboardingStatus() {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuthStore();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setOnboardingCompleted(false);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const status = await AsyncStorage.getItem(`onboarding-completed-${user.id}`);
        setOnboardingCompleted(status === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkOnboardingStatus();
  }, [user]);
  
  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      await AsyncStorage.setItem(`onboarding-completed-${user.id}`, 'true');
      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };
  
  const resetOnboarding = async () => {
    if (!user) return;
    
    try {
      await AsyncStorage.removeItem(`onboarding-completed-${user.id}`);
      setOnboardingCompleted(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };
  
  return {
    onboardingCompleted,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
} 