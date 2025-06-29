import { supabase } from './supabase-client';
import { v4 as uuidv4 } from 'uuid';

// Types
interface Strategy {
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
  performance_data: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
}

interface StrategyVersion {
  id: string;
  strategy_id: string;
  user_id: string;
  version: string;
  code: string;
  description: string;
  changes_summary: string;
  performance_data: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
  is_live: boolean;
  created_at: string;
  improvement_reason?: string;
  is_active?: boolean;
}

// Get all strategies for a user
export async function getUserStrategies(userId: string): Promise<Strategy[] | null> {
  try {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user strategies:', error);
    return null;
  }
}

// Get a specific strategy by ID
export async function getStrategy(strategyId: string): Promise<Strategy | null> {
  try {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching strategy:', error);
    return null;
  }
}

// Create a new strategy
export async function createStrategy(
  userId: string, 
  name: string, 
  description: string,
  code: string,
  language = 'pinescript'
): Promise<Strategy | null> {
  try {
    const newStrategy = {
      id: uuidv4(),
      user_id: userId,
      name,
      description,
      code,
      language,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version_count: 1,
      is_public: false,
      tags: [],
      performance_data: {}
    };
    
    const { data, error } = await supabase
      .from('strategies')
      .insert(newStrategy)
      .select()
      .single();
      
    if (error) throw error;
    
    // Also create initial version
    await createStrategyVersion(
      data.id,
      userId,
      '1.0',
      code,
      'Initial version',
      '',
      true
    );
    
    return data;
  } catch (error) {
    console.error('Error creating strategy:', error);
    return null;
  }
}

// Update an existing strategy
export async function updateStrategy(
  strategyId: string,
  updates: Partial<Strategy>
): Promise<Strategy | null> {
  try {
    const { data, error } = await supabase
      .from('strategies')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', strategyId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating strategy:', error);
    return null;
  }
}

// Delete a strategy
export async function deleteStrategy(strategyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', strategyId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting strategy:', error);
    return false;
  }
}

// Get all versions of a strategy
export async function getStrategyVersions(strategyId: string): Promise<StrategyVersion[] | null> {
  try {
    const { data, error } = await supabase
      .from('strategy_versions')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching strategy versions:', error);
    return null;
  }
}

// Get a specific version
export async function getStrategyVersion(versionId: string): Promise<StrategyVersion | null> {
  try {
    const { data, error } = await supabase
      .from('strategy_versions')
      .select('*')
      .eq('id', versionId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching strategy version:', error);
    return null;
  }
}

// Create a new strategy version
export async function createStrategyVersion(
  strategyId: string,
  userId: string,
  version: string,
  code: string,
  description: string,
  changesSummary: string,
  isActive: boolean = false
): Promise<StrategyVersion | null> {
  try {
    // If this version is active, deactivate all other versions
    if (isActive) {
      await supabase
        .from('strategy_versions')
        .update({ is_active: false })
        .eq('strategy_id', strategyId);
    }
    
    const newVersion = {
      id: uuidv4(),
      strategy_id: strategyId,
      user_id: userId,
      version,
      code,
      description,
      changes_summary: changesSummary,
      performance_data: {},
      is_live: false,
      is_active: isActive,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('strategy_versions')
      .insert(newVersion)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update version count on parent strategy
    await supabase
      .from('strategies')
      .update({ 
        version_count: supabase.rpc('increment', { row_id: strategyId }),
        updated_at: new Date().toISOString()
      })
      .eq('id', strategyId);
    
    return data;
  } catch (error) {
    console.error('Error creating strategy version:', error);
    return null;
  }
}

// Activate a strategy version
export async function activateStrategyVersion(versionId: string): Promise<boolean> {
  try {
    // Get the version to find the strategy ID
    const { data: version, error: versionError } = await supabase
      .from('strategy_versions')
      .select('strategy_id')
      .eq('id', versionId)
      .single();
      
    if (versionError) throw versionError;
    
    // Deactivate all versions for this strategy
    const { error: deactivateError } = await supabase
      .from('strategy_versions')
      .update({ is_active: false })
      .eq('strategy_id', version.strategy_id);
      
    if (deactivateError) throw deactivateError;
    
    // Activate the requested version
    const { error: activateError } = await supabase
      .from('strategy_versions')
      .update({ is_active: true })
      .eq('id', versionId);
      
    if (activateError) throw activateError;
    
    return true;
  } catch (error) {
    console.error('Error activating strategy version:', error);
    return false;
  }
} 