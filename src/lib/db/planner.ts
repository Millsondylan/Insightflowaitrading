import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type DailyPlan = Tables<'daily_plans'>;

export async function createDailyPlan(
  userId: string,
  data: {
    date: string;
    focus_note: string;
    selected_strategies: string[];
    market_condition?: string;
    risk_level?: string;
    trading_goals?: string[];
  }
): Promise<{ plan: DailyPlan | null; error: Error | null }> {
  const { data: plan, error } = await supabase
    .from('daily_plans')
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

  return { plan, error };
}

export async function updateDailyPlan(
  planId: string,
  userId: string,
  updates: Partial<DailyPlan>
): Promise<{ plan: DailyPlan | null; error: Error | null }> {
  const { data: plan, error } = await supabase
    .from('daily_plans')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', planId)
    .eq('user_id', userId)
    .select()
    .single();

  return { plan, error };
}

export async function deleteDailyPlan(
  planId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('daily_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', userId);

  return { error };
}

export async function getDailyPlan(
  userId: string,
  date: string
): Promise<{ plan: DailyPlan | null; error: Error | null }> {
  const { data: plan, error } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  return { plan, error };
}

export async function getUserPlans(
  userId: string,
  options?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ plans: DailyPlan[]; error: Error | null }> {
  let query = supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId);

  if (options?.startDate) {
    query = query.gte('date', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('date', options.endDate);
  }

  query = query.order('date', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: plans, error } = await query;

  return { plans: plans || [], error };
} 