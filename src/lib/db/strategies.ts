import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Strategy = Tables<'trading_strategies'>;

export async function createStrategy(
  userId: string,
  data: {
    name: string;
    description?: string;
    code: string;
    language?: string;
  }
): Promise<{ strategy: Strategy | null; error: Error | null }> {
  const { data: strategy, error } = await supabase
    .from('trading_strategies')
    .insert([
      {
        name: data.name,
        description: data.description,
        code: data.code,
        language: data.language,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { strategy, error };
}

export async function updateStrategy(
  strategyId: string,
  userId: string,
  updates: Partial<Strategy>
): Promise<{ strategy: Strategy | null; error: Error | null }> {
  const { data: strategy, error } = await supabase
    .from('trading_strategies')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', strategyId)
    .eq('user_id', userId)
    .select()
    .single();

  return { strategy, error };
}

export async function deleteStrategy(
  strategyId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('trading_strategies')
    .delete()
    .eq('id', strategyId)
    .eq('user_id', userId);

  return { error };
}

export async function getStrategy(
  strategyId: string
): Promise<{ strategy: Strategy | null; error: Error | null }> {
  const { data: strategy, error } = await supabase
    .from('trading_strategies')
    .select('*')
    .eq('id', strategyId)
    .single();

  return { strategy, error };
}

export async function getUserStrategies(
  userId: string
): Promise<{ strategies: Strategy[]; error: Error | null }> {
  const { data: strategies, error } = await supabase
    .from('trading_strategies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { strategies: strategies || [], error };
}

export async function getPublicStrategies(): Promise<{ strategies: Strategy[]; error: Error | null }> {
  const { data: strategies, error } = await supabase
    .from('trading_strategies')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  return { strategies: strategies || [], error };
} 