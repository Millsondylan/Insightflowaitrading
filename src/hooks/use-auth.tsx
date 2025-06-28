import { useState, useEffect, createContext, useContext, FC, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';

type UserProfile = Tables<'profiles'>;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  isTrial: boolean;
  hasProAccess: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isSubscribed: false,
  isTrial: false,
  hasProAccess: false,
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);

        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          setProfile(profileData);

          const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
          if (adminError) {
            console.warn('Could not verify admin status:', adminError.message);
            setIsAdmin(false);
          } else {
            setIsAdmin(adminData);
          }
        }
      } catch (error) {
        console.error('Error fetching session or profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Re-fetch profile when auth state changes (login/logout)
      fetchSessionAndProfile();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const isSubscribed = profile?.subscription_tier === 'pro' && !!profile.subscription_end && new Date(profile.subscription_end) > new Date();

  const trialEndDate = profile?.trial_extended_until 
    ? new Date(profile.trial_extended_until)
    : (profile?.base_trial_end ? new Date(profile.base_trial_end) : null);
  const isTrial = !!trialEndDate && trialEndDate > new Date();

  const hasProAccess = isSubscribed || isTrial;

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isAdmin,
    isSubscribed,
    isTrial,
    hasProAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 