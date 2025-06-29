import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  address: string;
  created_at: string;
  subscription_tier: string | null;
  role: string;
  base_trial_end: string | null;
  subscription_end: string | null;
  email: string;
  full_name: string | null;
}

export interface FetchUsersOptions {
  page?: number;
  perPage?: number;
  role?: string;
  search?: string;
  sortBy?: 'created_at' | 'subscription_tier' | 'role';
  sortOrder?: 'asc' | 'desc';
}

export async function fetchUsers({
  page = 1,
  perPage = 10,
  role,
  search,
  sortBy = 'created_at',
  sortOrder = 'desc'
}: FetchUsersOptions = {}): Promise<{
  users: User[];
  totalCount: number;
  pageCount: number;
}> {
  try {
    // Calculate range for pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    
    // Start building the query
    let query = supabase
      .from('profiles')
      .select('id, email, created_at, subscription_tier, full_name, base_trial_end, subscription_end', 
        { count: 'exact' });
    
    // Apply filters
    if (role) {
      if (role === 'Admin') {
        // Special case for admin role check
        // In a real implementation, we would need to properly identify admins
        // For now, we'll use a simple mock approach
        query = query.eq('id', '0x1abc...');
      } else if (role === 'Expired') {
        // For expired users, check if subscription_end is in the past
        query = query.lt('subscription_end', new Date().toISOString());
      } else if (role === 'Trial') {
        // For trial users, check they're within trial period
        query = query.gt('base_trial_end', new Date().toISOString())
          .is('subscription_tier', null);
      } else if (role === 'User') {
        // Regular users have an active subscription
        query = query.not('subscription_tier', 'is', null)
          .gt('subscription_end', new Date().toISOString());
      }
    }

    // Apply search filter
    if (search && search.trim() !== '') {
      query = query.ilike('id', `%${search.trim()}%`);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error('Error fetching users:', error);
      return { users: [], totalCount: 0, pageCount: 0 };
    }

    // Transform the data to expected format
    const users = data.map(user => ({
      id: user.id,
      address: user.id, // In this system, ID is the wallet address
      created_at: user.created_at,
      subscription_tier: user.subscription_tier,
      email: user.email,
      full_name: user.full_name,
      base_trial_end: user.base_trial_end,
      subscription_end: user.subscription_end,
      // Determine role
      role: determineUserRole(user)
    }));

    return {
      users,
      totalCount: count || 0,
      pageCount: Math.ceil((count || 0) / perPage)
    };
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    return { users: [], totalCount: 0, pageCount: 0 };
  }
}

function determineUserRole(user: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): string {
  const now = new Date().toISOString();
  
  // For demo purposes, consider the first user an admin
  // In production, we would check against a proper admin flag/role
  if (user.id === '0x1abc...') return 'Admin';
  
  // Check if user is on trial
  if (user.base_trial_end && user.base_trial_end > now && !user.subscription_tier) {
    return 'Trial';
  }
  
  // Check if subscription is expired
  if (user.subscription_end && user.subscription_end < now) {
    return 'Expired';
  }
  
  // User has an active subscription
  if (user.subscription_tier) {
    return 'User';
  }
  
  // Default fallback
  return 'Expired';
} 