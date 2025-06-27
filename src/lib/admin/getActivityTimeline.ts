import { supabase } from '@/integrations/supabase/client';

export type ActivityType = 'journal' | 'strategy' | 'reflection' | 'user';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  label: string;
  timestamp: string;
  userId?: string | null;
  path?: string;
  metadata?: Record<string, any>;
}

/**
 * Fetches a timeline of recent user activities from Supabase.
 * @param limit The number of events to fetch.
 * @returns A promise that resolves to an array of activity events.
 */
export const getActivityTimeline = async (limit = 20): Promise<ActivityEvent[]> => {
  try {
    // Fetch recent journal entries
    const { data: journals, error: journalsError } = await supabase
      .from('journal_entries')
      .select('id, title, createdAt, userId')
      .order('createdAt', { ascending: false })
      .limit(limit);

    if (journalsError) throw journalsError;

    // Fetch recent strategy builds
    const { data: strategies, error: strategiesError } = await supabase
      .from('trading_strategies')
      .select('id, name, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (strategiesError) throw strategiesError;
    
    // Fetch new user signups
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (usersError) throw usersError;

    // Map journals to the common activity event format
    const journalEvents: ActivityEvent[] = journals.map(j => ({
      id: `journal-${j.id}`,
      type: 'journal',
      label: `Saved new journal entry: "${j.title}"`,
      timestamp: j.createdAt,
      userId: j.userId,
      path: `/journal/${j.id}`,
    }));

    // Map strategies to the common activity event format
    const strategyEvents: ActivityEvent[] = strategies.map(s => ({
      id: `strategy-${s.id}`,
      type: 'strategy',
      label: `Built a new strategy: "${s.name}"`,
      timestamp: s.created_at || new Date().toISOString(),
      userId: s.user_id,
      path: `/strategy/${s.id}`,
    }));
    
    // Map new users to the common activity event format
    const userEvents: ActivityEvent[] = users.map(u => ({
        id: `user-${u.id}`,
        type: 'user',
        label: `New user signed up: ${u.email}`,
        timestamp: u.created_at,
        userId: u.id,
        path: `/admin/users/${u.id}`,
    }));

    // Combine all events, sort by timestamp, and take the most recent `limit`
    const allEvents = [...journalEvents, ...strategyEvents, ...userEvents];
    allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allEvents.slice(0, limit);
  } catch (error) {
    console.error('Error fetching activity timeline:', error);
    return [];
  }
}; 