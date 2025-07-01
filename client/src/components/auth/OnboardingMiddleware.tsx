import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface OnboardingMiddlewareProps {
  children: React.ReactNode;
}

const OnboardingMiddleware = ({ children }: OnboardingMiddlewareProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Don't check if still loading auth
      if (loading) return;
      
      // If no user and on protected route, redirect to auth
      if (!user) {
        const protectedRoutes = [
          '/dashboard', '/strategy', '/journal', '/academy', '/wallet', 
          '/admin', '/profile', '/settings', '/market-setup', '/setup-finder',
          '/best-setups', '/markets', '/chat', '/voice', '/portfolio'
        ];
        
        if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
          navigate('/auth', { state: { from: location } });
          return;
        }
        return;
      }
      
      // Don't redirect if already on onboarding, auth, or public pages
      const publicRoutes = ['/onboarding', '/auth', '/register', '/verify', '/', '/about', '/privacy', '/terms', '/pricing'];
      if (publicRoutes.includes(location.pathname)) {
        return;
      }

      setIsCheckingOnboarding(true);

      try {
        // Check if user has completed onboarding
        const { data: userProfile, error } = await supabase
          .from('user_profile')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        // If no profile exists or onboarding is not completed, redirect to onboarding
        if (error?.code === 'PGRST116' || !(userProfile as any)?.onboarding_completed) {
          console.log('User needs onboarding, redirecting...');
          navigate('/onboarding', { replace: true });
        } else if (location.pathname === '/' || location.pathname === '/index') {
          // If user is authenticated and onboarding is complete, redirect to dashboard
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, assume onboarding is needed
        navigate('/onboarding', { replace: true });
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user, loading, location.pathname, navigate]);

  // Show loading spinner while checking onboarding status
  if (loading || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white/80">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingMiddleware; 