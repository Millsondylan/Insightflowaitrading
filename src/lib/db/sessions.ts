import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type TradingSession = Tables<'trading_sessions'>;

export async function createSession(
  userId: string,
  data: {
    start_time: string;
    initial_balance: number;
    emotional_state?: string;
    focus_level?: number;
    notes?: string;
  }
): Promise<{ session: TradingSession | null; error: Error | null }> {
  const { data: session, error } = await supabase
    .from('trading_sessions')
    .insert([
      {
        user_id: userId,
        ...data,
        total_trades: 0,
        winning_trades: 0,
        losing_trades: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { session, error };
}

export async function endSession(
  sessionId: string,
  userId: string,
  data: {
    end_time: string;
    final_balance: number;
    pnl: number;
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    emotional_state?: string;
    focus_level?: number;
    notes?: string;
  }
): Promise<{ session: TradingSession | null; error: Error | null }> {
  const { data: session, error } = await supabase
    .from('trading_sessions')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single();

  return { session, error };
}

export async function updateSessionStats(
  sessionId: string,
  userId: string,
  stats: {
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    pnl?: number;
  }
): Promise<{ session: TradingSession | null; error: Error | null }> {
  const { data: session, error } = await supabase
    .from('trading_sessions')
    .update({
      ...stats,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single();

  return { session, error };
}

export async function getSession(
  sessionId: string
): Promise<{ session: TradingSession | null; error: Error | null }> {
  const { data: session, error } = await supabase
    .from('trading_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  return { session, error };
}

export async function getUserSessions(
  userId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    includeActive?: boolean;
    limit?: number;
  }
): Promise<{ sessions: TradingSession[]; error: Error | null }> {
  let query = supabase
    .from('trading_sessions')
    .select('*')
    .eq('user_id', userId);

  if (options?.startDate) {
    query = query.gte('start_time', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('start_time', options.endDate);
  }

  if (!options?.includeActive) {
    query = query.not('end_time', 'is', null);
  }

  query = query.order('start_time', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: sessions, error } = await query;

  return { sessions: sessions || [], error };
}

export async function getActiveSession(
  userId: string
): Promise<{ session: TradingSession | null; error: Error | null }> {
  const { data: session, error } = await supabase
    .from('trading_sessions')
    .select('*')
    .eq('user_id', userId)
    .is('end_time', null)
    .single();

  return { session, error };
}

export async function deleteSession(
  sessionId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('trading_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId);

  return { error };
} 