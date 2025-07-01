import { useState, useEffect, createContext, useContext, FC, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';

// Define our own types since we no longer use Supabase types
interface User {
  id: number;
  username: string;
  email?: string;
}

interface Session {
  user: User;
}

interface UserProfile {
  id?: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
}

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

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const result = await supabase.getCurrentUser();
        
        if (result.success && result.user) {
          const user = result.user;
          setSession({ user });
          setProfile(result.profile || null);
        } else {
          setSession(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setError(error as Error);
        setSession(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean, error?: Error }> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await supabase.login(email, password);
      
      if (result.success && result.user) {
        const user = result.user;
        setSession({ user });
        setProfile(result.profile || null);
        return { success: true };
      } else {
        setError(new Error(result.error || 'Login failed'));
        return { success: false, error: new Error(result.error || 'Login failed') };
      }
    } catch (error) {
      const err = error as Error;
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, metadata?: object): Promise<{ success: boolean, error?: Error }> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await supabase.register(email, password);
      
      if (result.success && result.user) {
        const user = result.user;
        setSession({ user });
        setProfile(result.profile || null);
        return { success: true };
      } else {
        setError(new Error(result.error || 'Signup failed'));
        return { success: false, error: new Error(result.error || 'Signup failed') };
      }
    } catch (error) {
      const err = error as Error;
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.logout();
      setSession(null);
      setProfile(null);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean, error?: Error }> => {
    // Mock implementation for now
    console.log('Password reset requested for:', email);
    return { success: true };
  };

  const user = session?.user || null;
  const isSubscribed = false; // Mock for now
  const isTrial = false; // Mock for now
  const hasProAccess = false; // Mock for now

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;