import { createBrowserClient } from '@supabase/ssr';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
// Use lazy initialization to prevent server-side errors
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

const createSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Skip client creation on server-side
    return null;
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase configuration missing: URL or Key not provided');
    return null;
  }
  
  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

export const supabase = (() => {
  if (supabaseClient === null) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
})();

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Helper function to get configuration status
export const getSupabaseConfigStatus = () => {
  return {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey,
    configured: isSupabaseConfigured()
  };
}; 