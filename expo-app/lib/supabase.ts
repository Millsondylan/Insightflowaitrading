import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, AppStateStatus } from 'react-native';

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key in environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Monitor for app state changes to refresh token when app returns from background
AppState.addEventListener('change', (state: AppStateStatus) => {
  if (state === 'active') {
    supabase.auth.refreshSession();
  }
});

// Expose for debugging in development
if (__DEV__) {
  (global as any).supabase = supabase;
}

// Helper functions to get user and session from storage
export const getUserFromStorage = async () => {
  const userString = await AsyncStorage.getItem('supabase.auth.user');
  return userString ? JSON.parse(userString) : null;
};

export const getSessionFromStorage = async () => {
  const sessionString = await AsyncStorage.getItem('supabase.auth.session');
  return sessionString ? JSON.parse(sessionString) : null;
}; 