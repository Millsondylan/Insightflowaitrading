import { supabase } from '@/integrations/supabase/client';

/**
 * Types for market correlations
 */
export interface CorrelationPair {
  base_asset: string;
  quote_asset: string;
}

export type CorrelationTimePeriod = '1d' | '7d' | '30d' | '90d' | '1y';

export interface CorrelationSettings {
  user_id: string;
  pairs: CorrelationPair[];
  time_period: CorrelationTimePeriod;
  favorite_pairs: CorrelationPair[];
  chart_type: 'heatmap' | 'network' | 'matrix';
  custom_assets?: string[];
}

export interface CorrelationData {
  pair_id: string;
  base_asset: string;
  quote_asset: string;
  correlation: number;
  time_period: CorrelationTimePeriod;
  volatility: number;
  trend_strength: number;
  data_points: number;
  last_updated: string;
}

/**
 * Gets market correlations for specified pairs and time period
 */
export async function getMarketCorrelations(
  pairs: CorrelationPair[] | 'all', 
  timePeriod: CorrelationTimePeriod = '30d',
  userId?: string
): Promise<CorrelationData[]> {
  try {
    // Get user favorites if userId is provided
    let userFavorites: CorrelationPair[] = [];
    
    if (userId) {
      const { data: settings } = await supabase
        .from('user_correlation_settings')
        .select('favorite_pairs')
        .eq('user_id', userId)
        .single();
      
      if (settings?.favorite_pairs) {
        userFavorites = settings.favorite_pairs as CorrelationPair[];
      }
    }
    
    // Get correlation data
    let query = supabase
      .from('market_correlations')
      .select('*')
      .eq('time_period', timePeriod);
      
    // Filter by specific pairs if provided
    if (pairs !== 'all') {
      const pairConditions = pairs.map(pair => 
        `(base_asset.eq.${pair.base_asset}.and.quote_asset.eq.${pair.quote_asset})`
      );
      query = query.or(pairConditions.join(','));
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Add is_favorite flag to each correlation
    const correlations = (data || []).map(correlation => {
      const isFavorite = userFavorites.some(
        fav => 
          fav.base_asset === correlation.base_asset && 
          fav.quote_asset === correlation.quote_asset
      );
      
      return {
        ...correlation,
        is_favorite: isFavorite
      };
    });
    
    return correlations;
  } catch (err) {
    console.error('Error fetching market correlations:', err);
    return [];
  }
}

/**
 * Saves user correlation settings
 */
export async function saveCorrelationSettings(
  userId: string,
  settings: Partial<CorrelationSettings>
): Promise<boolean> {
  try {
    // Get current settings first
    const { data: existingSettings } = await supabase
      .from('user_correlation_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('user_correlation_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      return !error;
    } else {
      // Create new settings
      const { error } = await supabase
        .from('user_correlation_settings')
        .insert({
          user_id: userId,
          time_period: settings.time_period || '30d',
          pairs: settings.pairs || [],
          favorite_pairs: settings.favorite_pairs || [],
          chart_type: settings.chart_type || 'heatmap',
          custom_assets: settings.custom_assets || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      return !error;
    }
  } catch (err) {
    console.error('Error saving correlation settings:', err);
    return false;
  }
}

/**
 * Toggles favorite status for a correlation pair
 */
export async function toggleFavoritePair(
  userId: string,
  pair: CorrelationPair
): Promise<boolean> {
  try {
    // Get current favorites
    const { data: settings } = await supabase
      .from('user_correlation_settings')
      .select('favorite_pairs')
      .eq('user_id', userId)
      .single();
    
    if (!settings) {
      // Create new settings with this favorite
      return await saveCorrelationSettings(userId, {
        favorite_pairs: [pair]
      });
    }
    
    const favorites = settings.favorite_pairs as CorrelationPair[] || [];
    
    // Check if pair is already a favorite
    const existingIndex = favorites.findIndex(
      fav => fav.base_asset === pair.base_asset && fav.quote_asset === pair.quote_asset
    );
    
    let updatedFavorites;
    if (existingIndex >= 0) {
      // Remove from favorites
      updatedFavorites = [
        ...favorites.slice(0, existingIndex),
        ...favorites.slice(existingIndex + 1)
      ];
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, pair];
    }
    
    // Update settings
    const { error } = await supabase
      .from('user_correlation_settings')
      .update({
        favorite_pairs: updatedFavorites,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    return !error;
  } catch (err) {
    console.error('Error toggling favorite pair:', err);
    return false;
  }
}

/**
 * Calculates the correlation between two assets based on their price history
 * This is a simplified implementation - in production you would use more robust statistical methods
 * and actual price data from your database or API
 */
export async function calculateCorrelation(
  asset1: string,
  asset2: string,
  timePeriod: CorrelationTimePeriod
): Promise<number> {
  try {
    // In production: Fetch price data for both assets over the time period
    // const prices1 = await getPriceHistory(asset1, timePeriod);
    // const prices2 = await getPriceHistory(asset2, timePeriod);
    
    // For development, return a simulated correlation value
    // This would normally be calculated using Pearson correlation coefficient
    const simulatedCorrelation = simulateCorrelationValue(asset1, asset2);
    
    // Store the calculated correlation in the database
    await supabase
      .from('market_correlations')
      .upsert({
        pair_id: `${asset1}_${asset2}`,
        base_asset: asset1,
        quote_asset: asset2,
        correlation: simulatedCorrelation,
        time_period: timePeriod,
        volatility: Math.random() * 0.5,
        trend_strength: Math.random() * 0.8,
        data_points: Math.floor(Math.random() * 1000) + 100,
        last_updated: new Date().toISOString()
      });
    
    return simulatedCorrelation;
  } catch (err) {
    console.error('Error calculating correlation:', err);
    return 0;
  }
}

/**
 * Simulates a correlation value between two assets for development purposes
 * In production, this would be calculated from actual price data
 */
function simulateCorrelationValue(asset1: string, asset2: string): number {
  // For demonstration - specific pairs have predefined correlations
  const knownPairs: Record<string, number> = {
    'BTC_ETH': 0.85,
    'BTC_SOL': 0.76,
    'BTC_XRP': 0.62,
    'ETH_SOL': 0.78,
    'ETH_MATIC': 0.81,
    'SPY_QQQ': 0.92,
    'SPY_DIA': 0.94,
    'GOLD_SILVER': 0.73,
    'GOLD_BTC': -0.21,
    'USD_GOLD': -0.45,
    'USD_BTC': -0.18,
    'TSLA_SPY': 0.64,
    'AAPL_QQQ': 0.82,
  };
  
  const pairKey = `${asset1}_${asset2}`;
  const reversePairKey = `${asset2}_${asset1}`;
  
  if (knownPairs[pairKey] !== undefined) {
    return knownPairs[pairKey];
  } else if (knownPairs[reversePairKey] !== undefined) {
    return knownPairs[reversePairKey];
  } else if (asset1 === asset2) {
    return 1.0; // Perfect correlation with self
  } else {
    // Generate a random correlation between -1 and 1, with higher likelihood of positive correlation
    return (Math.random() * 1.6) - 0.5;
  }
} 