import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type TradingInsight = Tables<'trading_insights'>;

export async function createInsight(
  userId: string,
  data: {
    title: string;
    content: string;
    insight_type: string;
    symbol?: string;
    timeframe?: string;
    action_text?: string;
    confidence?: number;
    expires_at?: string;
  }
): Promise<{ insight: TradingInsight | null; error: Error | null }> {
  const { data: insight, error } = await supabase
    .from('trading_insights')
    .insert([
      {
        user_id: userId,
        ...data,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { insight, error };
}

export async function getInsight(
  insightId: string
): Promise<{ insight: TradingInsight | null; error: Error | null }> {
  const { data: insight, error } = await supabase
    .from('trading_insights')
    .select('*')
    .eq('id', insightId)
    .single();

  return { insight, error };
}

export async function updateInsight(
  insightId: string,
  userId: string,
  updates: Partial<tradingInsight>
): Promise<{ insight: TradingInsight | null; error: Error | null }> {
  const { data: insight, error } = await supabase
    .from('trading_insights')
    .update(updates)
    .eq('id', insightId)
    .eq('user_id', userId)
    .select()
    .single();

  return { insight, error };
}

export async function deleteInsight(
  insightId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('trading_insights')
    .delete()
    .eq('id', insightId)
    .eq('user_id', userId);

  return { error };
}

export async function getUserInsights(
  userId: string,
  options?: {
    type?: string;
    symbol?: string;
    timeframe?: string;
    limit?: number;
    includeExpired?: boolean;
  }
): Promise<{ insights: TradingInsight[]; error: Error | null }> {
  let query = supabase
    .from('trading_insights')
    .select('*')
    .eq('user_id', userId);

  if (options?.type) {
    query = query.eq('insight_type', options.type);
  }

  if (options?.symbol) {
    query = query.eq('symbol', options.symbol);
  }

  if (options?.timeframe) {
    query = query.eq('timeframe', options.timeframe);
  }

  if (!options?.includeExpired) {
    query = query.or(`expires_at.gt.${new Date().toISOString()},expires_at.is.null`);
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: insights, error } = await query;

  return { insights: insights || [], error };
}

export async function getActiveInsights(
  options?: {
    type?: string;
    symbol?: string;
    timeframe?: string;
    limit?: number;
  }
): Promise<{ insights: TradingInsight[]; error: Error | null }> {
  let query = supabase
    .from('trading_insights')
    .select('*')
    .or(`expires_at.gt.${new Date().toISOString()},expires_at.is.null`);

  if (options?.type) {
    query = query.eq('insight_type', options.type);
  }

  if (options?.symbol) {
    query = query.eq('symbol', options.symbol);
  }

  if (options?.timeframe) {
    query = query.eq('timeframe', options.timeframe);
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: insights, error } = await query;

  return { insights: insights || [], error };
} 