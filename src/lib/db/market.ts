import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type MarketAnalysis = Tables<'market_analysis'>;
export type MarketCorrelation = Tables<'market_correlations'>;

export async function createMarketAnalysis(
  userId: string,
  data: {
    symbol: string;
    timeframe: string;
    analysis_type: string;
    analysis_data: any // eslint-disable-line @typescript-eslint/no-explicit-any;
    sentiment?: string;
    key_levels?: number[];
    indicators?: any;
    expires_at?: string;
  }
): Promise<{ analysis: MarketAnalysis | null; error: Error | null }> {
  const { data: analysis, error } = await supabase
    .from('market_analysis')
    .insert([
      {
        user_id: userId,
        ...data,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { analysis, error };
}

export async function getMarketAnalysis(
  analysisId: string
): Promise<{ analysis: MarketAnalysis | null; error: Error | null }> {
  const { data: analysis, error } = await supabase
    .from('market_analysis')
    .select('*')
    .eq('id', analysisId)
    .single();

  return { analysis, error };
}

export async function getUserMarketAnalyses(
  userId: string,
  options?: {
    symbol?: string;
    timeframe?: string;
    type?: string;
    includeExpired?: boolean;
    limit?: number;
  }
): Promise<{ analyses: MarketAnalysis[]; error: Error | null }> {
  let query = supabase
    .from('market_analysis')
    .select('*')
    .eq('user_id', userId);

  if (options?.symbol) {
    query = query.eq('symbol', options.symbol);
  }

  if (options?.timeframe) {
    query = query.eq('timeframe', options.timeframe);
  }

  if (options?.type) {
    query = query.eq('analysis_type', options.type);
  }

  if (!options?.includeExpired) {
    query = query.or(`expires_at.gt.${new Date().toISOString()},expires_at.is.null`);
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: analyses, error } = await query;

  return { analyses: analyses || [], error };
}

export async function deleteMarketAnalysis(
  analysisId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('market_analysis')
    .delete()
    .eq('id', analysisId)
    .eq('user_id', userId);

  return { error };
}

export async function createMarketCorrelation(
  data: {
    symbol_pair: string[];
    timeframe: string;
    correlation_value: number;
    start_date: string;
    end_date: string;
    data_points: number;
  }
): Promise<{ correlation: MarketCorrelation | null; error: Error | null }> {
  const { data: correlation, error } = await supabase
    .from('market_correlations')
    .insert([
      {
        ...data,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { correlation, error };
}

export async function getMarketCorrelations(
  options?: {
    symbol?: string;
    timeframe?: string;
    minCorrelation?: number;
    maxCorrelation?: number;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
): Promise<{ correlations: MarketCorrelation[]; error: Error | null }> {
  let query = supabase
    .from('market_correlations')
    .select('*');

  if (options?.symbol) {
    query = query.contains('symbol_pair', [options.symbol]);
  }

  if (options?.timeframe) {
    query = query.eq('timeframe', options.timeframe);
  }

  if (options?.minCorrelation !== undefined) {
    query = query.gte('correlation_value', options.minCorrelation);
  }

  if (options?.maxCorrelation !== undefined) {
    query = query.lte('correlation_value', options.maxCorrelation);
  }

  if (options?.startDate) {
    query = query.gte('start_date', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('end_date', options.endDate);
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: correlations, error } = await query;

  return { correlations: correlations || [], error };
} 