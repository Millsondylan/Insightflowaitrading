
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalUsers: number;
  strategyBuilds: number;
  journalsSaved: number;
  chartsUploaded: number;
}

/**
 * Fetches dashboard statistics from Supabase.
 * @returns A promise that resolves to an object containing dashboard stats.
 */
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) throw usersError;

    // Fetch total strategy builds
    const { count: strategyBuilds, error: strategiesError } = await supabase
      .from('trading_strategies')
      .select('*', { count: 'exact', head: true });
      
    if (strategiesError) throw strategiesError;

    // Fetch total journal entries using correct column name
    const { count: journalsSaved, error: journalsError } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true });

    if (journalsError) throw journalsError;

    // Fetch total charts uploaded (count journal entries with a chartUrl) using correct column name
    const { count: chartsUploaded, error: chartsError } = await supabase
      .from('journal_entries')
      .select('id', { count: 'exact' })
      .not('charturl', 'is', null);

    if (chartsError) throw chartsError;

    return {
      totalUsers: totalUsers || 0,
      strategyBuilds: strategyBuilds || 0,
      journalsSaved: journalsSaved || 0,
      chartsUploaded: chartsUploaded || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return zeroed stats on error to prevent UI crash
    return {
      totalUsers: 0,
      strategyBuilds: 0,
      journalsSaved: 0,
      chartsUploaded: 0,
    };
  }
};
