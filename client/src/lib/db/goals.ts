import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type TradingGoal = Tables<'trading_goals'>;

export async function createGoal(
  userId: string,
  data: {
    title: string;
    description?: string;
    target_value?: number;
    current_value?: number;
    goal_type: string;
    start_date: string;
    target_date?: string;
    status?: string;
    progress_data?: any;
  }
): Promise<{ goal: TradingGoal | null; error: Error | null }> {
  const { data: goal, error } = await supabase
    .from('trading_goals')
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

  return { goal, error };
}

export async function updateGoal(
  goalId: string,
  userId: string,
  updates: Partial<tradingGoal>
): Promise<{ goal: TradingGoal | null; error: Error | null }> {
  const { data: goal, error } = await supabase
    .from('trading_goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  return { goal, error };
}

export async function updateGoalProgress(
  goalId: string,
  userId: string,
  currentValue: number,
  progressData?: any
): Promise<{ goal: TradingGoal | null; error: Error | null }> {
  const { data: goal, error } = await supabase
    .from('trading_goals')
    .update({
      current_value: currentValue,
      progress_data: progressData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  return { goal, error };
}

export async function deleteGoal(
  goalId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('trading_goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId);

  return { error };
}

export async function getGoal(
  goalId: string
): Promise<{ goal: TradingGoal | null; error: Error | null }> {
  const { data: goal, error } = await supabase
    .from('trading_goals')
    .select('*')
    .eq('id', goalId)
    .single();

  return { goal, error };
}

export async function getUserGoals(
  userId: string,
  options?: {
    status?: string;
    goalType?: string;
    includeCompleted?: boolean;
    limit?: number;
  }
): Promise<{ goals: TradingGoal[]; error: Error | null }> {
  let query = supabase
    .from('trading_goals')
    .select('*')
    .eq('user_id', userId);

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.goalType) {
    query = query.eq('goal_type', options.goalType);
  }

  if (!options?.includeCompleted) {
    query = query.neq('status', 'completed');
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: goals, error } = await query;

  return { goals: goals || [], error };
}

export async function getActiveGoals(
  userId: string
): Promise<{ goals: TradingGoal[]; error: Error | null }> {
  const { data: goals, error } = await supabase
    .from('trading_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false });

  return { goals: goals || [], error };
} 