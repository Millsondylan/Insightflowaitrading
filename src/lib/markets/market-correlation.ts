import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Types for market correlations
 */
export interface AssetPair {
  baseAsset: string;
  quoteAsset: string;
}

export type CorrelationTimePeriod = '1d' | '7d' | '30d' | '90d' | '1y';

export type ColorPaletteTheme = 
  'blueRed' | 
  'greenRed' | 
  'purpleGreen' | 
  'orangeBlue' |
  'monochrome' |
  'highContrast' |
  'pastel';

export interface CorrelationMatrix {
  timestamp: string;
  assets: string[];
  matrix: number[][];
  timeframe: CorrelationTimePeriod;
  metadata: {
    dataPoints: number;
    lastUpdated: string;
  };
}

export interface CorrelationSettings {
  userId: string;
  favoritePairs: AssetPair[];
  timePeriod: CorrelationTimePeriod;
  colorPalette: ColorPaletteTheme;
  chartType: 'heatmap' | 'network' | 'matrix';
  alertThreshold: number;
  customAssets?: string[];
}

export interface CorrelationAlert {
  id: string;
  userId: string;
  pairId: string;
  baseAsset: string;
  quoteAsset: string;
  oldCorrelation: number;
  newCorrelation: number;
  timePeriod: CorrelationTimePeriod;
  threshold: number;
  createdAt: string;
  isRead: boolean;
}

/**
 * Generate a correlation matrix for a set of assets
 * @param assets List of asset symbols
 * @param timePeriod Time period for correlation calculation
 * @returns Correlation matrix
 */
export async function generateCorrelationMatrix(
  assets: string[],
  timePeriod: CorrelationTimePeriod = '30d'
): Promise<CorrelationMatrix> {
  try {
    // In a real implementation, this would fetch and analyze price data
    // Here we'll generate a simulated correlation matrix for demonstration
    
    const matrix: number[][] = [];
    
    // Generate n×n correlation matrix with simulated values
    for (let i = 0; i < assets.length; i++) {
      const row: number[] = [];
      
      for (let j = 0; j < assets.length; j++) {
        if (i === j) {
          // Perfect correlation with self
          row.push(1);
        } else if (j < i) {
          // Copy the value from the upper triangle (correlation is symmetric)
          row.push(matrix[j][i]);
        } else {
          // Generate a realistic correlation value between -1 and 1
          // Use known pairs to generate more realistic correlations
          const correlation = generateRealisticCorrelation(assets[i], assets[j]);
          row.push(correlation);
        }
      }
      
      matrix.push(row);
    }
    
    // Create correlation matrix object
    const correlationMatrix: CorrelationMatrix = {
      timestamp: new Date().toISOString(),
      assets,
      matrix,
      timeframe: timePeriod,
      metadata: {
        dataPoints: estimateDataPointCount(timePeriod),
        lastUpdated: new Date().toISOString()
      }
    };
    
    // Save to database for caching and historical reference
    await saveCorrelationMatrix(correlationMatrix);
    
    return correlationMatrix;
  } catch (error) {
    console.error('Error generating correlation matrix:', error);
    
    // Return an empty matrix as fallback
    return {
      timestamp: new Date().toISOString(),
      assets: [],
      matrix: [],
      timeframe: timePeriod,
      metadata: {
        dataPoints: 0,
        lastUpdated: new Date().toISOString()
      }
    };
  }
}

/**
 * Generate a realistic correlation value between two assets
 */
function generateRealisticCorrelation(asset1: string, asset2: string): number {
  // Define some known correlation patterns
  const knownPairs: Record<string, number> = {
    'BTC_ETH': 0.82,
    'BTC_XRP': 0.58,
    'ETH_SOL': 0.76,
    'SPY_QQQ': 0.91,
    'SPY_DIA': 0.92,
    'GOLD_SILVER': 0.72,
    'GOLD_BTC': -0.21,
    'USD_GOLD': -0.42,
    'VIX_SPY': -0.78,
    'CRUDE_NATURAL_GAS': 0.45,
    'EURUSD_GBPUSD': 0.73
  };
  
  // Check if this is a known pair or its reverse
  const pair = `${asset1}_${asset2}`;
  const reversePair = `${asset2}_${asset1}`;
  
  if (knownPairs[pair] !== undefined) {
    return knownPairs[pair];
  }
  
  if (knownPairs[reversePair] !== undefined) {
    return knownPairs[reversePair];
  }
  
  // Classify asset types for more realistic correlations
  const isCrypto = (asset: string) => /^(BTC|ETH|SOL|XRP|DOT|ADA|AVAX|BNB)/i.test(asset);
  const isStock = (asset: string) => /^[A-Z]{1,5}$/i.test(asset) && !isCrypto(asset);
  const isFiat = (asset: string) => /(USD|EUR|GBP|JPY|CHF|CAD|AUD|NZD)/i.test(asset);
  const isCommodity = (asset: string) => /(GOLD|SILVER|CRUDE|OIL|NATURAL_GAS|WHEAT|CORN)/i.test(asset);
  const isIndex = (asset: string) => /(SPY|QQQ|DIA|VIX|FTSE|DAX|NIKKEI|HSI)/i.test(asset);
  
  // Assets of same type tend to be more positively correlated
  if (
    (isCrypto(asset1) && isCrypto(asset2)) ||
    (isStock(asset1) && isStock(asset2)) ||
    (isFiat(asset1) && isFiat(asset2)) ||
    (isCommodity(asset1) && isCommodity(asset2)) ||
    (isIndex(asset1) && isIndex(asset2))
  ) {
    // Same asset class: generally positive correlation
    // Generate between 0.3 and 0.9 with mean around 0.6
    return 0.6 + (Math.random() * 0.6 - 0.3);
  }
  
  // Crypto and tech stocks: moderate positive correlation
  if (isCrypto(asset1) && isStock(asset2) || isCrypto(asset2) && isStock(asset1)) {
    return 0.4 + (Math.random() * 0.4 - 0.2);
  }
  
  // Stocks and indices: strong positive correlation
  if ((isStock(asset1) && isIndex(asset2)) || (isStock(asset2) && isIndex(asset1))) {
    return 0.7 + (Math.random() * 0.3 - 0.15);
  }
  
  // Fiat and commodities: often negative correlation
  if ((isFiat(asset1) && isCommodity(asset2)) || (isFiat(asset2) && isCommodity(asset1))) {
    return -0.3 + (Math.random() * 0.6 - 0.3);
  }
  
  // Default to low correlation with some randomness
  return Math.random() * 0.6 - 0.3;
}

/**
 * Save correlation matrix to database
 */
async function saveCorrelationMatrix(matrix: CorrelationMatrix): Promise<void> {
  try {
    // In a real implementation, we would save this to a database table
    // Here we'll just log it
    console.log('Saved correlation matrix:', matrix.timestamp);
  } catch (error) {
    console.error('Error saving correlation matrix:', error);
  }
}

/**
 * Estimate data point count based on timeframe
 */
function estimateDataPointCount(timePeriod: CorrelationTimePeriod): number {
  // Estimate number of data points based on period (assuming daily data)
  switch (timePeriod) {
    case '1d': return 24; // Hourly data points for 1 day
    case '7d': return 7; // Daily data points for 1 week
    case '30d': return 30; // Daily data points for 30 days
    case '90d': return 90; // Daily data points for 90 days
    case '1y': return 252; // Trading days in a year
    default: return 30;
  }
}

/**
 * Get color palette for correlation visualization
 * @param theme Color palette theme
 * @param steps Number of color steps in the palette
 * @returns Array of color hex codes
 */
export function getCorrelationColorPalette(
  theme: ColorPaletteTheme = 'blueRed',
  steps: number = 9
): string[] {
  // Each theme should have a range from -1 to 1 correlation
  // with the middle color representing 0 correlation
  
  switch (theme) {
    case 'blueRed':
      return [
        '#053061', // Strong negative correlation
        '#2166ac',
        '#4393c3',
        '#92c5de',
        '#f7f7f7', // No correlation
        '#f4a582',
        '#d6604d',
        '#b2182b',
        '#67001f'  // Strong positive correlation
      ];
      
    case 'greenRed':
      return [
        '#1a9850', // Strong negative correlation
        '#66bd63',
        '#a6d96a',
        '#d9ef8b',
        '#f7f7f7', // No correlation
        '#fee08b',
        '#fdae61',
        '#f46d43',
        '#d73027'  // Strong positive correlation
      ];
      
    case 'purpleGreen':
      return [
        '#40004b', // Strong negative correlation
        '#762a83',
        '#9970ab',
        '#c2a5cf',
        '#f7f7f7', // No correlation
        '#e6f5d0',
        '#a6dba0',
        '#5aae61',
        '#00441b'  // Strong positive correlation
      ];
      
    case 'orangeBlue':
      return [
        '#7f3b08', // Strong negative correlation
        '#b35806',
        '#e08214',
        '#fdb863',
        '#f7f7f7', // No correlation
        '#b2abd2',
        '#8073ac',
        '#542788',
        '#2d004b'  // Strong positive correlation
      ];
      
    case 'monochrome':
      return [
        '#f7f7f7', // Strong negative correlation
        '#d9d9d9',
        '#bdbdbd',
        '#969696',
        '#737373', // No correlation
        '#525252',
        '#252525',
        '#000000',
        '#000000'  // Strong positive correlation
      ];
      
    case 'highContrast':
      return [
        '#0000ff', // Strong negative correlation
        '#3232ff',
        '#6666ff',
        '#9999ff',
        '#ffffff', // No correlation
        '#ff9999',
        '#ff6666',
        '#ff3232',
        '#ff0000'  // Strong positive correlation
      ];
      
    case 'pastel':
      return [
        '#b3e2cd', // Strong negative correlation
        '#c8e2b3',
        '#dedeb3',
        '#e2d4b3',
        '#f7f7f7', // No correlation
        '#e2b3b3',
        '#e2b3cc',
        '#ccb3e2',
        '#b3b3e2'  // Strong positive correlation
      ];
      
    default:
      // Default blue-red
      return [
        '#053061', // Strong negative correlation
        '#2166ac',
        '#4393c3',
        '#92c5de',
        '#f7f7f7', // No correlation
        '#f4a582',
        '#d6604d',
        '#b2182b',
        '#67001f'  // Strong positive correlation
      ];
  }
}

/**
 * Get the color for a specific correlation value
 * @param correlation Correlation value between -1 and 1
 * @param palette Color palette
 * @returns Hex color code
 */
export function getCorrelationColor(
  correlation: number,
  palette: string[] = getCorrelationColorPalette('blueRed')
): string {
  // Ensure correlation is within bounds
  correlation = Math.max(-1, Math.min(1, correlation));
  
  // Map correlation from [-1,1] to [0,palette.length-1]
  const index = Math.round((correlation + 1) * (palette.length - 1) / 2);
  
  return palette[index];
}

/**
 * Save user correlation settings
 * @param userId User ID
 * @param settings Correlation settings
 * @returns Success status
 */
export async function saveCorrelationSettings(
  userId: string,
  settings: Partial<CorrelationSettings>
): Promise<boolean> {
  try {
    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('user_correlation_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const now = new Date().toISOString();
    
    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('user_correlation_settings')
        .update({
          ...settings,
          updated_at: now
        })
        .eq('user_id', userId);
      
      return !error;
    } else {
      // Create new settings
      const { error } = await supabase
        .from('user_correlation_settings')
        .insert({
          user_id: userId,
          favorite_pairs: settings.favoritePairs || [],
          time_period: settings.timePeriod || '30d',
          color_palette: settings.colorPalette || 'blueRed',
          chart_type: settings.chartType || 'heatmap',
          alert_threshold: settings.alertThreshold || 0.7,
          custom_assets: settings.customAssets || [],
          created_at: now,
          updated_at: now
        });
      
      return !error;
    }
  } catch (error) {
    console.error('Error saving correlation settings:', error);
    return false;
  }
}

/**
 * Get user correlation settings
 * @param userId User ID
 * @returns User correlation settings
 */
export async function getCorrelationSettings(
  userId: string
): Promise<CorrelationSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_correlation_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      userId: data.user_id,
      favoritePairs: data.favorite_pairs || [],
      timePeriod: data.time_period || '30d',
      colorPalette: data.color_palette || 'blueRed',
      chartType: data.chart_type || 'heatmap',
      alertThreshold: data.alert_threshold || 0.7,
      customAssets: data.custom_assets
    };
  } catch (error) {
    console.error('Error getting correlation settings:', error);
    return null;
  }
}

/**
 * Create a correlation alert when two assets exceed the threshold
 * @param userId User ID
 * @param baseAsset Base asset
 * @param quoteAsset Quote asset
 * @param oldCorrelation Previous correlation
 * @param newCorrelation New correlation
 * @param timePeriod Time period
 * @param threshold Alert threshold
 * @returns Success status
 */
export async function createCorrelationAlert(
  userId: string,
  baseAsset: string,
  quoteAsset: string,
  oldCorrelation: number,
  newCorrelation: number,
  timePeriod: CorrelationTimePeriod,
  threshold: number
): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    const pairId = `${baseAsset}_${quoteAsset}`;
    
    const { error } = await supabase.from('market_alerts').insert({
      id: uuidv4(),
      user_id: userId,
      alert_type: 'correlation_change',
      symbol: pairId,
      condition_data: {
        baseAsset,
        quoteAsset,
        oldCorrelation,
        newCorrelation,
        timePeriod,
        threshold
      },
      message: `Correlation between ${baseAsset} and ${quoteAsset} changed from ${oldCorrelation.toFixed(2)} to ${newCorrelation.toFixed(2)}`,
      triggered: true,
      triggered_at: now,
      created_at: now
    });
    
    // Also create notification
    await supabase.from('user_notifications').insert({
      id: uuidv4(),
      user_id: userId,
      notification_type: 'market_correlation',
      title: `Correlation Change Alert`,
      message: `${baseAsset}/${quoteAsset} correlation changed significantly (${(newCorrelation - oldCorrelation).toFixed(2)})`,
      data: {
        baseAsset,
        quoteAsset,
        oldCorrelation,
        newCorrelation,
        timePeriod
      },
      priority: Math.abs(newCorrelation - oldCorrelation) > 0.3 ? 'high' : 'medium',
      channels: ['app', 'email'],
      status: 'sent',
      sent_at: now,
      created_at: now
    });
    
    // Log audit event
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      user_id: userId,
      action_type: 'CORRELATION_ALERT_CREATED',
      component_name: 'MarketCorrelation',
      action_details: {
        baseAsset,
        quoteAsset,
        oldCorrelation,
        newCorrelation,
        timePeriod
      },
      client_timestamp: now,
      server_timestamp: now
    });
    
    return !error;
  } catch (error) {
    console.error('Error creating correlation alert:', error);
    return false;
  }
}

/**
 * Check if a pair is a user's favorite
 * @param userId User ID
 * @param baseAsset Base asset
 * @param quoteAsset Quote asset
 * @returns True if favorite
 */
export async function isFavoritePair(
  userId: string,
  baseAsset: string,
  quoteAsset: string
): Promise<boolean> {
  try {
    const settings = await getCorrelationSettings(userId);
    
    if (!settings || !settings.favoritePairs) {
      return false;
    }
    
    return settings.favoritePairs.some(
      pair => 
        (pair.baseAsset === baseAsset && pair.quoteAsset === quoteAsset) ||
        (pair.baseAsset === quoteAsset && pair.quoteAsset === baseAsset)
    );
  } catch (error) {
    console.error('Error checking favorite pair:', error);
    return false;
  }
}

/**
 * Toggle favorite status for a pair
 * @param userId User ID
 * @param baseAsset Base asset
 * @param quoteAsset Quote asset
 * @returns New favorite status
 */
export async function toggleFavoritePair(
  userId: string,
  baseAsset: string,
  quoteAsset: string
): Promise<boolean> {
  try {
    const settings = await getCorrelationSettings(userId);
    
    if (!settings) {
      // Create new settings with this pair as favorite
      await saveCorrelationSettings(userId, {
        favoritePairs: [{ baseAsset, quoteAsset }]
      });
      return true;
    }
    
    const favoritePairs = settings.favoritePairs || [];
    const isFavorite = await isFavoritePair(userId, baseAsset, quoteAsset);
    
    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favoritePairs.filter(
        pair => 
          !(pair.baseAsset === baseAsset && pair.quoteAsset === quoteAsset) &&
          !(pair.baseAsset === quoteAsset && pair.quoteAsset === baseAsset)
      );
      
      await saveCorrelationSettings(userId, {
        favoritePairs: newFavorites
      });
      
      return false;
    } else {
      // Add to favorites
      await saveCorrelationSettings(userId, {
        favoritePairs: [...favoritePairs, { baseAsset, quoteAsset }]
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite pair:', error);
    return false;
  }
} 