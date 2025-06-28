import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type StrategyBacktest = Tables<'strategy_backtests'>;

export async function createBacktest(
  userId: string,
  data: {
    strategy_id: string;
    symbol: string;
    timeframe: string;
    start_date: string;
    end_date: string;
    initial_balance?: number;
    final_balance: number;
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    profit_factor?: number;
    sharpe_ratio?: number;
    max_drawdown?: number;
    win_rate?: number;
    results_data?: any;
  }
): Promise<{ backtest: StrategyBacktest | null; error: Error | null }> {
  const { data: backtest, error } = await supabase
    .from('strategy_backtests')
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

  return { backtest, error };
}

export async function getBacktest(
  backtestId: string
): Promise<{ backtest: StrategyBacktest | null; error: Error | null }> {
  const { data: backtest, error } = await supabase
    .from('strategy_backtests')
    .select('*')
    .eq('id', backtestId)
    .single();

  return { backtest, error };
}

export async function getStrategyBacktests(
  strategyId: string,
  options?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ backtests: StrategyBacktest[]; error: Error | null }> {
  let query = supabase
    .from('strategy_backtests')
    .select('*')
    .eq('strategy_id', strategyId);

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

  const { data: backtests, error } = await query;

  return { backtests: backtests || [], error };
}

export async function getUserBacktests(
  userId: string,
  options?: {
    symbol?: string;
    timeframe?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ backtests: StrategyBacktest[]; error: Error | null }> {
  let query = supabase
    .from('strategy_backtests')
    .select('*')
    .eq('user_id', userId);

  if (options?.symbol) {
    query = query.eq('symbol', options.symbol);
  }

  if (options?.timeframe) {
    query = query.eq('timeframe', options.timeframe);
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

  const { data: backtests, error } = await query;

  return { backtests: backtests || [], error };
}

export async function deleteBacktest(
  backtestId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('strategy_backtests')
    .delete()
    .eq('id', backtestId)
    .eq('user_id', userId);

  return { error };
} 