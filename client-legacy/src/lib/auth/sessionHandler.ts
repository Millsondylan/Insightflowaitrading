import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
}

// Minimal Next.js-compatible Request type for environments without next/server
type NextRequest = Request & {
  cookies: {
    get(name: string): { value: string } | undefined;
  };
};

interface ProfileRow { subscription_tier?: string | null }

/**
 * Gets the authenticated user from a request
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get Supabase authentication cookie from the request
    const authCookie = req.cookies.get('sb-auth-token')?.value;
    
    if (!authCookie) {
      return null;
    }

    // Create a server-side Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    const supabaseServer = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${authCookie}`,
          },
        },
      }
    );

    // Get the user's session
    const { data, error } = await supabaseServer.auth.getUser();
    
    if (error || !data.user) {
      return null;
    }

    // Get additional user profile information
    const { data: profileData } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single<ProfileRow>();

    const tier = profileData?.subscription_tier ?? 'free';

    return {
      id: data.user.id,
      email: data.user.email || '',
      role: tier,
    };
  } catch (error) {
    console.error('Error authenticating request:', error);
    return null;
  }
}

/**
 * Checks if a user has admin privileges
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.subscription_tier === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
} 