import { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/hooks/use-auth';

/**
 * Hook to gate access to protected pages until onboarding is complete
 * @returns {boolean} Whether the user should be shown the onboarding modal
 */
export function useOnboardingGate(): boolean {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, showOnboarding, setShowOnboarding } = useOnboarding();
  
  // Check if onboarding is needed and show modal if it is
  useEffect(() => {
    if (authLoading || profileLoading) {
      return;
    }
    
    if (user && profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [user, profile, authLoading, profileLoading, setShowOnboarding]);
  
  return showOnboarding;
}

export default useOnboardingGate; 