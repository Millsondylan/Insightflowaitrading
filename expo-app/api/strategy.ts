import { supabase } from '../lib/supabase';

export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  description: string;
  code: string;
  language: string;
  created_at: string;
  updated_at: string;
  version_count: number;
  is_public: boolean;
  tags: string[];
  performance_data: any;
}

export interface StrategyParameter {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  default: string | number | boolean;
  description: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export async function getStrategies(): Promise<Strategy[]> {
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching strategies:', error);
    return [];
  }

  return data || [];
}

export async function getUserStrategies(userId: string): Promise<Strategy[]> {
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching user strategies:', error);
    return [];
  }

  return data || [];
}

export async function getStrategy(id: string): Promise<Strategy | null> {
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching strategy:', error);
    return null;
  }

  return data;
}

export async function createStrategy(
  userId: string,
  name: string,
  description: string,
  code: string
): Promise<Strategy | null> {
  const { data, error } = await supabase
    .from('strategies')
    .insert([
      {
        user_id: userId,
        name,
        description,
        code,
        language: 'pinescript',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version_count: 1,
        is_public: false,
        tags: [],
        performance_data: {}
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating strategy:', error);
    return null;
  }

  return data;
}

export async function updateStrategy(
  id: string,
  updates: Partial<Strategy>
): Promise<Strategy | null> {
  const { data, error } = await supabase
    .from('strategies')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating strategy:', error);
    return null;
  }

  return data;
}

export async function deleteStrategy(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('strategies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting strategy:', error);
    return false;
  }

  return true;
}

export async function getStrategyParameters(strategyId: string): Promise<StrategyParameter[]> {
  const { data, error } = await supabase
    .from('strategy_parameters')
    .select('*')
    .eq('strategy_id', strategyId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching strategy parameters:', error);
    return [];
  }

  return data || [];
}

export async function saveStrategyParameter(
  strategyId: string,
  parameter: Omit<StrategyParameter, 'id'>
): Promise<StrategyParameter | null> {
  const { data, error } = await supabase
    .from('strategy_parameters')
    .insert([
      {
        strategy_id: strategyId,
        ...parameter,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving strategy parameter:', error);
    return null;
  }

  return data;
}

/**
 * Generate a strategy based on a user prompt
 */
export async function generateStrategyFromPrompt(prompt: string, userId: string) {
  // In a real implementation, this would call an AI endpoint
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response for development
    return {
      name: `AI Strategy: ${prompt.split(' ').slice(0, 3).join(' ')}...`,
      description: `AI-generated strategy based on: ${prompt}`,
      strategy: {
        pseudocode: `
// Generated from prompt: ${prompt}
function strategy(candles, options) {
  // Define indicators
  const ema1 = EMA(candles, options.emaPeriod1);
  const ema2 = EMA(candles, options.emaPeriod2);
  const rsi = RSI(candles, options.rsiPeriod);
  
  // Define trading logic
  const isLong = (
    ema1[candles.length - 1] > ema2[candles.length - 1] && 
    rsi[candles.length - 1] > options.rsiOversold && 
    rsi[candles.length - 1] < options.rsiOverbought
  );
  
  const isShort = (
    ema1[candles.length - 1] < ema2[candles.length - 1] && 
    rsi[candles.length - 1] < options.rsiOverbought && 
    rsi[candles.length - 1] > options.rsiOversold
  );
  
  // Return signals
  return {
    isLong,
    isShort,
    stopLoss: options.stopLoss,
    takeProfit: options.takeProfit
  };
}
        `,
      },
      parameters: [
        {
          id: 'emaPeriod1',
          name: 'Fast EMA Period',
          type: 'number',
          value: 9,
          min: 5,
          max: 50,
          step: 1,
          description: 'Period for the fast exponential moving average',
        },
        {
          id: 'emaPeriod2',
          name: 'Slow EMA Period',
          type: 'number',
          value: 21,
          min: 10,
          max: 100,
          step: 1,
          description: 'Period for the slow exponential moving average',
        },
        {
          id: 'rsiPeriod',
          name: 'RSI Period',
          type: 'number',
          value: 14,
          min: 5,
          max: 30,
          step: 1,
          description: 'Period for the relative strength index',
        },
        {
          id: 'rsiOversold',
          name: 'RSI Oversold Level',
          type: 'number',
          value: 30,
          min: 10,
          max: 40,
          step: 1,
          description: 'RSI level to consider as oversold',
        },
        {
          id: 'rsiOverbought',
          name: 'RSI Overbought Level',
          type: 'number',
          value: 70,
          min: 60,
          max: 90,
          step: 1,
          description: 'RSI level to consider as overbought',
        },
        {
          id: 'stopLoss',
          name: 'Stop Loss %',
          type: 'number',
          value: 1.5,
          min: 0.5,
          max: 5.0,
          step: 0.1,
          description: 'Stop loss distance in percentage',
        },
        {
          id: 'takeProfit',
          name: 'Take Profit %',
          type: 'number',
          value: 3.0,
          min: 1.0,
          max: 10.0,
          step: 0.1,
          description: 'Take profit distance in percentage',
        },
      ],
    };
  } catch (error) {
    console.error('Error generating strategy:', error);
    throw new Error('Failed to generate strategy');
  }
}

/**
 * Save a strategy to the database
 */
export async function saveStrategy(data: any, userId: string) {
  // In a real implementation, this would save to Supabase
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response with ID
    return {
      ...data,
      id: `strategy-${Date.now()}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error saving strategy:', error);
    throw new Error('Failed to save strategy');
  }
} 