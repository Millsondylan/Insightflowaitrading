import { useState, useEffect, createContext, useContext, FC, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import { useAuditLog } from '@/lib/monitoring/auditLogger';

type UserProfile = Tables<'profiles'>;

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  isTrial: boolean;
  hasProAccess: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<{ success: boolean, error?: Error }>;
  signup: (email: string, password: string, metadata?: object) => Promise<{ success: boolean, error?: Error }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean, error?: Error }>;
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
  error: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  resetPassword: async () => ({ success: false }),
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { logEvent } = useAuditLog();

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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setSession(data.session);
      
      if (data.user) {
        logEvent('UserLogin', { userId: data.user.id, email: data.user.email });
      }
      
      return { success: true };
    } catch (err) {
      const error = err as Error;
      setError(error);
      logEvent('LoginFailed', { error: error.message });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, metadata = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        logEvent('UserSignup', { userId: data.user.id, email: data.user.email });
      }
      
      return { success: true };
    } catch (err) {
      const error = err as Error;
      setError(error);
      logEvent('SignupFailed', { error: error.message });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (session?.user) {
        logEvent('UserLogout', { userId: session.user.id });
      }
      
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (err) {
      const error = err as Error;
      setError(error);
      logEvent('LogoutFailed', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
      
      logEvent('PasswordResetRequested', { email });
      return { success: true };
    } catch (err) {
      const error = err as Error;
      setError(error);
      logEvent('PasswordResetFailed', { error: error.message, email });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isAdmin,
    isSubscribed,
    isTrial,
    hasProAccess,
    error,
    login,
    signup,
    logout,
    resetPassword,
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 