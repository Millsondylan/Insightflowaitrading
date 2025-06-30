import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Trade = Tables<'trades'>;

export async function createTrade(
  userId: string,
  data: {
    symbol: string;
    trade_type: string;
    entry_price: number;
    quantity: number;
    opened_at: string;
    exit_price?: number;
    closed_at?: string;
    pnl?: number;
    notes?: string;
    emotional_state?: string;
    market_condition?: string;
    setup_quality?: number;
    strategy?: string;
    tags?: string[];
  }
): Promise<{ trade: Trade | null; error: Error | null }> {
  const { data: trade, error } = await supabase
    .from('trades')
    .insert([
      {
        user_id: userId,
        ...data,
        status: data.closed_at ? 'closed' : 'open',
      },
    ])
    .select()
    .single();

  return { trade, error };
}

export async function updateTrade(
  tradeId: string,
  userId: string,
  updates: Partial<Trade>
): Promise<{ trade: Trade | null; error: Error | null }> {
  const { data: trade, error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', tradeId)
    .eq('user_id', userId)
    .select()
    .single();

  return { trade, error };
}

export async function closeTrade(
  tradeId: string,
  userId: string,
  data: {
    exit_price: number;
    closed_at: string;
    pnl: number;
  }
): Promise<{ trade: Trade | null; error: Error | null }> {
  const { data: trade, error } = await supabase
    .from('trades')
    .update({
      ...data,
      status: 'closed',
    })
    .eq('id', tradeId)
    .eq('user_id', userId)
    .select()
    .single();

  return { trade, error };
}

export async function deleteTrade(
  tradeId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', tradeId)
    .eq('user_id', userId);

  return { error };
}

export async function getTrade(
  tradeId: string
): Promise<{ trade: Trade | null; error: Error | null }> {
  const { data: trade, error } = await supabase
    .from('trades')
    .select('*')
    .eq('id', tradeId)
    .single();

  return { trade, error };
}

export async function getUserTrades(
  userId: string,
  options?: {
    status?: 'open' | 'closed';
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ trades: Trade[]; error: Error | null }> {
  let query = supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId);

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.startDate) {
    query = query.gte('opened_at', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('opened_at', options.endDate);
  }

  query = query.order('opened_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: trades, error } = await query;

  return { trades: trades || [], error };
}

export async function getTradesByStrategy(
  userId: string,
  strategyId: string
): Promise<{ trades: Trade[]; error: Error | null }> {
  const { data: trades, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .eq('strategy', strategyId)
    .order('opened_at', { ascending: false });

  return { trades: trades || [], error };
} 