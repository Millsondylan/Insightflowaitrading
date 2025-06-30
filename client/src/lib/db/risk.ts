import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type RiskSettings = Tables<'risk_settings'>;

export async function createRiskSettings(
  userId: string,
  data: {
    max_position_size: number;
    max_daily_drawdown: number;
    default_stop_loss_percent: number;
    default_take_profit_percent: number;
    max_trades_per_day?: number;
    allowed_symbols?: string[];
    risk_per_trade_percent: number;
    compounding_enabled?: boolean;
  }
): Promise<{ settings: RiskSettings | null; error: Error | null }> {
  const { data: settings, error } = await supabase
    .from('risk_settings')
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

  return { settings, error };
}

export async function updateRiskSettings(
  settingsId: string,
  userId: string,
  updates: Partial<RiskSettings>
): Promise<{ settings: RiskSettings | null; error: Error | null }> {
  const { data: settings, error } = await supabase
    .from('risk_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settingsId)
    .eq('user_id', userId)
    .select()
    .single();

  return { settings, error };
}

export async function getRiskSettings(
  userId: string
): Promise<{ settings: RiskSettings | null; error: Error | null }> {
  const { data: settings, error } = await supabase
    .from('risk_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { settings, error };
}

export async function deleteRiskSettings(
  settingsId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('risk_settings')
    .delete()
    .eq('id', settingsId)
    .eq('user_id', userId);

  return { error };
}

export async function updateAllowedSymbols(
  settingsId: string,
  userId: string,
  symbols: string[]
): Promise<{ settings: RiskSettings | null; error: Error | null }> {
  const { data: settings, error } = await supabase
    .from('risk_settings')
    .update({
      allowed_symbols: symbols,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settingsId)
    .eq('user_id', userId)
    .select()
    .single();

  return { settings, error };
}

export async function toggleCompounding(
  settingsId: string,
  userId: string,
  enabled: boolean
): Promise<{ settings: RiskSettings | null; error: Error | null }> {
  const { data: settings, error } = await supabase
    .from('risk_settings')
    .update({
      compounding_enabled: enabled,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settingsId)
    .eq('user_id', userId)
    .select()
    .single();

  return { settings, error };
} 