import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ReplayData = Tables<'replay_data'>;

export type Candle = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export async function saveReplayData(
  userId: string,
  data: {
    trade_id: string;
    symbol: string;
    timeframe: string;
    start_time: string;
    end_time: string;
    candles: Candle[];
    tags?: string[];
    annotations?: {
      timestamp: string;
      type: string;
      text: string;
    }[];
  }
): Promise<{ replay: ReplayData | null; error: Error | null }> {
  const { data: replay, error } = await supabase
    .from('replay_data')
    .insert([
      {
        user_id: userId,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { replay, error };
}

export async function getReplayData(
  replayId: string
): Promise<{ replay: ReplayData | null; error: Error | null }> {
  const { data: replay, error } = await supabase
    .from('replay_data')
    .select('*')
    .eq('id', replayId)
    .single();

  return { replay, error };
}

export async function getTradeReplayData(
  tradeId: string
): Promise<{ replay: ReplayData | null; error: Error | null }> {
  const { data: replay, error } = await supabase
    .from('replay_data')
    .select('*')
    .eq('trade_id', tradeId)
    .single();

  return { replay, error };
}

export async function updateReplayAnnotations(
  replayId: string,
  userId: string,
  annotations: {
    timestamp: string;
    type: string;
    text: string;
  }[]
): Promise<{ replay: ReplayData | null; error: Error | null }> {
  const { data: replay, error } = await supabase
    .from('replay_data')
    .update({
      annotations,
      updated_at: new Date().toISOString(),
    })
    .eq('id', replayId)
    .eq('user_id', userId)
    .select()
    .single();

  return { replay, error };
}

export async function deleteReplayData(
  replayId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('replay_data')
    .delete()
    .eq('id', replayId)
    .eq('user_id', userId);

  return { error };
}

export async function getUserReplays(
  userId: string,
  options?: {
    symbol?: string;
    timeframe?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ replays: ReplayData[]; error: Error | null }> {
  let query = supabase
    .from('replay_data')
    .select('*')
    .eq('user_id', userId);

  if (options?.symbol) {
    query = query.eq('symbol', options.symbol);
  }

  if (options?.timeframe) {
    query = query.eq('timeframe', options.timeframe);
  }

  if (options?.startDate) {
    query = query.gte('start_time', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('end_time', options.endDate);
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: replays, error } = await query;

  return { replays: replays || [], error };
} 