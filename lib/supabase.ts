import { createClient } from '@supabase/supabase-js';

// Get environment variables for Vite (not Next.js)
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

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

// Create Supabase client or mock client for development
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('🔧 Supabase configuration missing - using mock client for development');
    console.warn('📝 Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
    
    // Return a mock client for development that follows Supabase API
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (callback: any) => {
          // Mock auth state change - avoid deadlocks as per Supabase docs
          setTimeout(() => callback('SIGNED_OUT', null), 100);
          return { data: { subscription: { unsubscribe: () => {} } } };
        }
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        delete: () => Promise.resolve({ data: [], error: null }),
        upsert: () => Promise.resolve({ data: [], error: null })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          download: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      },
      realtime: {
        channel: () => ({
          on: () => ({ subscribe: () => {}, unsubscribe: () => {} }),
          subscribe: () => {},
          unsubscribe: () => {}
        })
      }
    } as any;
  }

  try {
    console.log('✅ Initializing Supabase client with URL:', supabaseUrl);
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    throw error;
  }
};

// Export the Supabase client
export const supabase = createSupabaseClient();

// Export type for TypeScript
export type SupabaseClient = typeof supabase; 