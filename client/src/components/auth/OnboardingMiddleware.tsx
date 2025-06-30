import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingMiddlewareProps {
  children: React.ReactNode;
}

const OnboardingMiddleware = ({ children }: OnboardingMiddlewareProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Don't check if still loading auth or no user
      if (loading || !user) return;
      
      // Don't redirect if already on onboarding, auth, or public pages
      if (['/onboarding', '/auth', '/register', '/verify', '/', '/about', '/privacy', '/terms', '/pricing'].includes(location.pathname)) {
        return;
      }

      try {
        // Check if user has completed onboarding
        const { data: userProfile, error } = await (supabase as any)
          .from('user_profile')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        // If no profile exists or onboarding is not completed, redirect to onboarding
        if (error?.code === 'PGRST116' || !userProfile?.onboarding_completed) {
          console.log('User needs onboarding, redirecting...');
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
};

export default OnboardingMiddleware; 