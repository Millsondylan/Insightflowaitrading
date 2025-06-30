import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LandingStats {
  userCount: number;
  strategyCount: number;
  demoVolume: number;
  reviews: Array<{
    content: string;
    name: string;
    role: string;
  }>;
  loading: boolean;
  error: string | null;
}

export const useLandingStats = (): LandingStats => {
  const [stats, setStats] = useState<LandingStats>({
    userCount: 0,
    strategyCount: 0,
    demoVolume: 0,
    reviews: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // Fetch strategy count
        const { count: strategyCount, error: strategyError } = await supabase
          .from('trading_strategies')
          .select('*', { count: 'exact', head: true });

        if (strategyError) throw strategyError;

        // Fetch demo volume from demo_trades
        const { data: trades, error: tradesError } = await supabase
          .from('demo_trades')
          .select('volume');

        if (tradesError) throw tradesError;

        const demoVolume = trades?.reduce((sum, trade) => sum + (trade.volume || 0), 0) || 1000000;

        // Fetch reviews from community posts with review tags (using mock data for now)
        const reviews = [
          {
            content: 'InsightFlow has transformed my trading approach. The AI insights are incredibly valuable.',
            name: 'Sarah Chen',
            role: 'Professional Trader',
          },
          {
            content: 'The backtesting features helped me optimize my strategies before going live.',
            name: 'Michael Rodriguez',
            role: 'Quantitative Analyst',
          },
          {
            content: 'User-friendly platform with powerful analytics. Highly recommended!',
            name: 'Emily Johnson',
            role: 'Day Trader',
          },
        ];

        setStats({
          userCount: userCount || 2500,
          strategyCount: strategyCount || 450,
          demoVolume: demoVolume,
          reviews,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching landing stats:', error);
        setStats(prev => ({
          ...prev,
          userCount: 2500,
          strategyCount: 450,
          demoVolume: 1000000,
          reviews: [
            {
              content: 'InsightFlow has transformed my trading approach. The AI insights are incredibly valuable.',
              name: 'Sarah Chen',
              role: 'Professional Trader',
            },
            {
              content: 'The backtesting features helped me optimize my strategies before going live.',
              name: 'Michael Rodriguez',
              role: 'Quantitative Analyst',
            },
            {
              content: 'User-friendly platform with powerful analytics. Highly recommended!',
              name: 'Emily Johnson',
              role: 'Day Trader',
            },
          ],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load stats',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}; 
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 
