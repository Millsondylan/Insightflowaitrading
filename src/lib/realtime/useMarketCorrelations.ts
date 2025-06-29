import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/realtime-js';
import type { Database } from '@/integrations/supabase/types';

// Narrow type for the table row
export type MarketCorrelationRow = Database["public"]["Tables"]["market_correlations"]["Row"];

interface UseMarketCorrelationsOptions {
  timeframe?: string; // e.g. '1d', '7d'
  autoSubscribe?: boolean;
}

export function useMarketCorrelations({ timeframe = '30d', autoSubscribe = true }: UseMarketCorrelationsOptions = {}) {
  const [data, setData] = useState<marketCorrelationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: rows, error } = await supabase
      .from('market_correlations')
      .select('*')
      .eq('timeframe', timeframe)
      .order('updated_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setData(rows as MarketCorrelationRow[]);
    }
    setLoading(false);
  }, [timeframe]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscription
  useEffect(() => {
    if (!autoSubscribe) return;
    const ch = supabase.channel('mc_realtime').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'market_correlations',
        filter: `timeframe=eq.${timeframe}`,
      },
      () => fetchData()
    );

    ch.subscribe();
    setChannel(ch);

    return () => {
      ch.unsubscribe();
    };
  }, [autoSubscribe, timeframe, fetchData]);

  return { data, loading, error, refresh: fetchData } as const;
} 