import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      set({ 
        session: data.session,
        user: data.user,
        loading: false
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign in',
        loading: false
      });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      set({
        session: data.session,
        user: data.user,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign up',
        loading: false
      });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({
        session: null,
        user: null,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign out',
        loading: false
      });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to reset password',
        loading: false
      });
    }
  }
}));

// Initialize auth state by listening to auth changes
export const initializeAuth = async () => {
  const { data } = await supabase.auth.getSession();
  useAuthStore.setState({ 
    session: data.session,
    user: data.session?.user || null,
    loading: false
  });

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    useAuthStore.setState({ 
      session,
      user: session?.user || null
    });
  });
}; 