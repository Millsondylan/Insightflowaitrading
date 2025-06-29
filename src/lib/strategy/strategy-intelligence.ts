import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export type StrategyType = 'trend' | 'momentum' | 'reversal' | 'breakout' | 'volatility' | 'mean-reversion' | 'custom';

export interface StrategyInput {
  name: string;
  description: string;
  naturalLanguage: string;
  risk: 'Low' | 'Medium' | 'High';
  timeframe: string;
  type: StrategyType;
  userId: string;
}

export interface StrategyRule {
  id: string;
  type: 'entry' | 'exit' | 'filter' | 'position';
  condition: string;
  parameters: Record<string, any>;
  priority: number;
  isActive: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'setup' | 'entry' | 'exit' | 'management' | 'mindset';
  priority: number;
}

export interface StrategyPerformance {
  winRate?: number;
  profitFactor?: number;
  maxDrawdown?: number;
  sharpeRatio?: number;
}

export interface StrategyVersion {
  id: string;
  strategyId: string;
  version: string;
  rules: StrategyRule[];
  checklist: ChecklistItem[];
  performance?: StrategyPerformance;
  createdAt: string;
  changeLog: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  naturalLanguage: string;
  risk: 'Low' | 'Medium' | 'High';
  timeframe: string;
  type: StrategyType;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  currentVersion: string;
  versions: StrategyVersion[];
}

// Type for Supabase strategy data
interface StrategyRecord {
  id: string;
  name: string;
  description: string;
  user_id: string;
  language: string;
  code: string;
  created_at: string;
  updated_at: string;
  is_published?: boolean;
  metadata?: {
    risk?: 'Low' | 'Medium' | 'High';
    timeframe?: string;
    type?: StrategyType;
  };
}

// Type for Supabase version data
interface VersionRecord {
  id: string;
  strategy_id: string;
  user_id: string;
  version: string;
  code: string;
  changes_summary: string;
  performance_data: Record<string, any>;
  is_live: boolean;
  created_at: string;
}

/**
 * Create a new strategy from natural language input
 * @param input Strategy input parameters
 * @returns The created strategy
 */
export async function createStrategy(input: StrategyInput): Promise<Strategy | null> {
  try {
    const strategyId = uuidv4();
    const now = new Date().toISOString();
    const versionId = uuidv4();
    
    // Parse natural language into rules and checklist
    const { rules, checklist } = await parseNaturalLanguage(input.naturalLanguage);
    
    // Create strategy version
    const version: StrategyVersion = {
      id: versionId,
      strategyId,
      version: '1.0.0',
      rules,
      checklist,
      createdAt: now,
      changeLog: 'Initial strategy creation'
    };
    
    // Create strategy
    const strategy: Strategy = {
      id: strategyId,
      name: input.name,
      description: input.description,
      naturalLanguage: input.naturalLanguage,
      risk: input.risk,
      timeframe: input.timeframe,
      type: input.type,
      userId: input.userId,
      createdAt: now,
      updatedAt: now,
      isPublished: false,
      currentVersion: '1.0.0',
      versions: [version]
    };
    
    // Save to database
    const { error: strategyError } = await supabase
      .from('trading_strategies')
      .insert({
        id: strategy.id,
        name: strategy.name,
        description: strategy.description,
        user_id: strategy.userId,
        language: 'natural',
        code: strategy.naturalLanguage,
        created_at: strategy.createdAt,
        updated_at: strategy.updatedAt,
        metadata: {
          risk: strategy.risk,
          timeframe: strategy.timeframe,
          type: strategy.type
        }
      });
    
    if (strategyError) throw strategyError;
    
    // Save version
    const { error: versionError } = await supabase
      .from('strategy_versions')
      .insert({
        id: version.id,
        strategy_id: strategy.id,
        user_id: strategy.userId,
        version: version.version,
        code: strategy.naturalLanguage,
        changes_summary: version.changeLog,
        performance_data: {},
        is_live: false,
        created_at: version.createdAt
      });
    
    if (versionError) throw versionError;

    // Log audit
    await logAuditEvent({
      user_id: strategy.userId,
      action_type: 'STRATEGY_CREATE',
      component_name: 'StrategyIntelligence',
      action_details: { strategy_id: strategy.id, version: strategy.currentVersion }
    });
    
    return strategy;
  } catch (error) {
    console.error('Failed to create strategy:', error);
    return null;
  }
}

/**
 * Update an existing strategy
 * @param strategyId Strategy ID
 * @param updates Updates to apply
 * @param userId User making the update
 * @returns The updated strategy
 */
export async function updateStrategy(
  strategyId: string,
  updates: Partial<StrategyInput>,
  userId: string
): Promise<Strategy | null> {
  try {
    // Get current strategy
    const { data: strategyData, error: fetchError } = await supabase
      .from('trading_strategies')
      .select('*')
      .eq('id', strategyId)
      .single();
    
    if (fetchError) throw fetchError;
    if (!strategyData) throw new Error('Strategy not found');
    
    const strategy = strategyData as StrategyRecord;
    
    // Verify ownership
    if (strategy.user_id !== userId) {
      throw new Error('Unauthorized: User does not own this strategy');
    }
    
    // Get current version
    const { data: versionData, error: versionFetchError } = await supabase
      .from('strategy_versions')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (versionFetchError) throw versionFetchError;
    
    const version = versionData as VersionRecord;
    
    // Parse current version information
    const currentVersionNum = version.version;
    const [major, minor, patch] = currentVersionNum.split('.').map(Number);
    
    // Create new version number based on changes
    let newVersionNum = currentVersionNum;
    let changeLog = 'Strategy updated';
    
    if (updates.naturalLanguage && updates.naturalLanguage !== strategy.code) {
      // Major change if strategy logic changed
      newVersionNum = `${major + 1}.0.0`;
      changeLog = 'Major strategy logic update';
    } else if (updates.name || updates.description || updates.type) {
      // Minor change for metadata updates
      newVersionNum = `${major}.${minor + 1}.0`;
      changeLog = 'Strategy metadata updated';
    } else {
      // Patch for minor fixes
      newVersionNum = `${major}.${minor}.${patch + 1}`;
      changeLog = 'Minor strategy fixes';
    }
    
    // Parse natural language if present
    let rules = [];
    let checklist = [];
    
    if (updates.naturalLanguage) {
      const parsed = await parseNaturalLanguage(updates.naturalLanguage);
      rules = parsed.rules;
      checklist = parsed.checklist;
    }
    
    // Prepare metadata updates
    const currentMetadata = strategy.metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      ...(updates.risk && { risk: updates.risk }),
      ...(updates.timeframe && { timeframe: updates.timeframe }),
      ...(updates.type && { type: updates.type })
    };
    
    // Update strategy
    const updateObj = {
      ...(updates.name && { name: updates.name }),
      ...(updates.description && { description: updates.description }),
      ...(updates.naturalLanguage && { code: updates.naturalLanguage }),
      metadata: updatedMetadata,
      updated_at: new Date().toISOString()
    };
    
    const { error: updateError } = await supabase
      .from('trading_strategies')
      .update(updateObj)
      .eq('id', strategyId);
    
    if (updateError) throw updateError;
    
    // Create new version
    const versionId = uuidv4();
    
    const { error: versionError } = await supabase
      .from('strategy_versions')
      .insert({
        id: versionId,
        strategy_id: strategyId,
        user_id: userId,
        version: newVersionNum,
        code: updates.naturalLanguage || strategy.code,
        changes_summary: changeLog,
        performance_data: {},
        is_live: false,
        created_at: new Date().toISOString()
      });
    
    if (versionError) throw versionError;

    // Log audit
    await logAuditEvent({
      user_id: userId,
      action_type: 'STRATEGY_UPDATE',
      component_name: 'StrategyIntelligence',
      action_details: { 
        strategy_id: strategyId, 
        old_version: currentVersionNum,
        new_version: newVersionNum
      }
    });
    
    // Get updated strategy
    return await getStrategy(strategyId);
  } catch (error) {
    console.error('Failed to update strategy:', error);
    return null;
  }
}

/**
 * Get a strategy by ID with all its versions
 * @param strategyId Strategy ID
 * @returns The strategy with all versions
 */
export async function getStrategy(strategyId: string): Promise<Strategy | null> {
  try {
    // Get strategy
    const { data: strategyData, error: fetchError } = await supabase
      .from('trading_strategies')
      .select('*')
      .eq('id', strategyId)
      .single();
    
    if (fetchError) throw fetchError;
    if (!strategyData) throw new Error('Strategy not found');
    
    const strategy = strategyData as StrategyRecord;
    
    // Get all versions
    const { data: versionsData, error: versionFetchError } = await supabase
      .from('strategy_versions')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false });
    
    if (versionFetchError) throw versionFetchError;
    
    // Get current version (first in the sorted list)
    const currentVersion = versionsData.length > 0 ? versionsData[0].version : '1.0.0';
    
    // Parse versions
    const versions: StrategyVersion[] = versionsData.map(v => {
      const version = v as VersionRecord;
      // For each version, parse rules and checklist from code
      // This would be done automatically in production
      const { rules, checklist } = parseNaturalLanguageSync(version.code);
      
      // Convert performance data to correct format
      const performanceData = version.performance_data || {};
      const performance: StrategyPerformance = {
        winRate: performanceData.winRate,
        profitFactor: performanceData.profitFactor,
        maxDrawdown: performanceData.maxDrawdown,
        sharpeRatio: performanceData.sharpeRatio
      };
      
      return {
        id: version.id,
        strategyId: version.strategy_id,
        version: version.version,
        rules,
        checklist,
        performance,
        createdAt: version.created_at,
        changeLog: version.changes_summary
      };
    });
    
    // Extract metadata with defaults
    const metadata = strategy.metadata || {};
    
    // Build complete strategy object
    const completeStrategy: Strategy = {
      id: strategy.id,
      name: strategy.name,
      description: strategy.description,
      naturalLanguage: strategy.code,
      risk: metadata.risk || 'Medium',
      timeframe: metadata.timeframe || 'Daily',
      type: metadata.type || 'custom',
      userId: strategy.user_id,
      createdAt: strategy.created_at,
      updatedAt: strategy.updated_at,
      isPublished: !!strategy.is_published,
      currentVersion,
      versions
    };
    
    return completeStrategy;
  } catch (error) {
    console.error('Failed to get strategy:', error);
    return null;
  }
}

/**
 * Publish a strategy to make it available to others
 * @param strategyId Strategy ID
 * @param userId User publishing the strategy
 * @returns Success status
 */
export async function publishStrategy(strategyId: string, userId: string): Promise<boolean> {
  try {
    // Get strategy to verify ownership
    const { data: strategyData, error: fetchError } = await supabase
      .from('trading_strategies')
      .select('user_id')
      .eq('id', strategyId)
      .single();
    
    if (fetchError) throw fetchError;
    if (!strategyData) throw new Error('Strategy not found');
    
    // Verify ownership
    if (strategyData.user_id !== userId) {
      throw new Error('Unauthorized: User does not own this strategy');
    }
    
    // Update strategy to published state
    const { error: updateError } = await supabase
      .from('trading_strategies')
      .update({ 
        is_published: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', strategyId);
    
    if (updateError) throw updateError;

    // Log audit
    await logAuditEvent({
      user_id: userId,
      action_type: 'STRATEGY_PUBLISH',
      component_name: 'StrategyIntelligence',
      action_details: { strategy_id: strategyId }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to publish strategy:', error);
    return false;
  }
}

/**
 * Compare two versions of a strategy
 * @param strategyId Strategy ID
 * @param version1 First version to compare
 * @param version2 Second version to compare
 * @returns Comparison result
 */
export async function compareVersions(
  strategyId: string,
  version1: string,
  version2: string
): Promise<{ additions: string[], removals: string[], changes: string[] }> {
  try {
    // Get versions
    const { data: versionsData, error } = await supabase
      .from('strategy_versions')
      .select('*')
      .eq('strategy_id', strategyId)
      .in('version', [version1, version2]);
    
    if (error) throw error;
    
    const v1 = versionsData.find(v => v.version === version1);
    const v2 = versionsData.find(v => v.version === version2);
    
    if (!v1 || !v2) throw new Error('One or both versions not found');
    
    // Parse rules and checklists for both versions
    const v1Parsed = parseNaturalLanguageSync(v1.code);
    const v2Parsed = parseNaturalLanguageSync(v2.code);
    
    // Compare rules
    const v1Rules = v1Parsed.rules.map(r => r.condition);
    const v2Rules = v2Parsed.rules.map(r => r.condition);
    
    // Compare checklist items
    const v1Checklist = v1Parsed.checklist.map(c => c.text);
    const v2Checklist = v2Parsed.checklist.map(c => c.text);
    
    // Find additions (in v2 but not v1)
    const additions = [
      ...v2Rules.filter(r => !v1Rules.includes(r)).map(r => `Rule: ${r}`),
      ...v2Checklist.filter(c => !v1Checklist.includes(c)).map(c => `Checklist: ${c}`)
    ];
    
    // Find removals (in v1 but not v2)
    const removals = [
      ...v1Rules.filter(r => !v2Rules.includes(r)).map(r => `Rule: ${r}`),
      ...v1Checklist.filter(c => !v2Checklist.includes(c)).map(c => `Checklist: ${c}`)
    ];
    
    // Note: In a real implementation, we would use a more sophisticated
    // algorithm to detect changes to existing rules, not just additions/removals
    const changes = [];
    
    return { additions, removals, changes };
  } catch (error) {
    console.error('Failed to compare versions:', error);
    return { additions: [], removals: [], changes: [] };
  }
}

/**
 * Parse natural language strategy into rules and checklist
 * This would typically use AI, but here we'll use a simple implementation
 */
async function parseNaturalLanguage(
  naturalLanguage: string
): Promise<{ rules: StrategyRule[], checklist: ChecklistItem[] }> {
  // In a real implementation, this would call an AI service
  return parseNaturalLanguageSync(naturalLanguage);
}

/**
 * Synchronous version of natural language parsing (for demo purposes)
 */
function parseNaturalLanguageSync(
  naturalLanguage: string
): { rules: StrategyRule[], checklist: ChecklistItem[] } {
  const lines = naturalLanguage.split('\n').filter(line => line.trim());
  
  const rules: StrategyRule[] = [];
  const checklist: ChecklistItem[] = [];
  
  let ruleCounter = 0;
  let checklistCounter = 0;
  
  // Very basic parsing for demo purposes
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.toLowerCase().includes('buy') || trimmed.toLowerCase().includes('long') || 
        trimmed.toLowerCase().includes('enter')) {
      rules.push({
        id: `rule_${ruleCounter++}`,
        type: 'entry',
        condition: trimmed,
        parameters: {},
        priority: rules.length,
        isActive: true
      });
      
      // Create a checklist item for this entry rule
      checklist.push({
        id: `checklist_${checklistCounter++}`,
        text: `Verify entry condition: ${trimmed}`,
        category: 'entry',
        priority: checklist.length
      });
    } else if (trimmed.toLowerCase().includes('sell') || trimmed.toLowerCase().includes('exit') ||
              trimmed.toLowerCase().includes('stop') || trimmed.toLowerCase().includes('profit')) {
      rules.push({
        id: `rule_${ruleCounter++}`,
        type: 'exit',
        condition: trimmed,
        parameters: {},
        priority: rules.length,
        isActive: true
      });
      
      // Create a checklist item for this exit rule
      checklist.push({
        id: `checklist_${checklistCounter++}`,
        text: `Confirm exit condition: ${trimmed}`,
        category: 'exit',
        priority: checklist.length
      });
    } else if (trimmed.toLowerCase().includes('if') || trimmed.toLowerCase().includes('when') ||
              trimmed.toLowerCase().includes('market')) {
      rules.push({
        id: `rule_${ruleCounter++}`,
        type: 'filter',
        condition: trimmed,
        parameters: {},
        priority: rules.length,
        isActive: true
      });
      
      // Create a checklist item for this filter
      checklist.push({
        id: `checklist_${checklistCounter++}`,
        text: `Check filter condition: ${trimmed}`,
        category: 'setup',
        priority: checklist.length
      });
    } else if (trimmed.toLowerCase().includes('size') || trimmed.toLowerCase().includes('risk') ||
              trimmed.toLowerCase().includes('position')) {
      rules.push({
        id: `rule_${ruleCounter++}`,
        type: 'position',
        condition: trimmed,
        parameters: {},
        priority: rules.length,
        isActive: true
      });
      
      // Create a checklist item for position sizing
      checklist.push({
        id: `checklist_${checklistCounter++}`,
        text: `Set position size according to: ${trimmed}`,
        category: 'management',
        priority: checklist.length
      });
    } else {
      // Generic checklist item
      checklist.push({
        id: `checklist_${checklistCounter++}`,
        text: trimmed,
        category: 'mindset',
        priority: checklist.length
      });
    }
  }
  
  // Add some default checklist items if none exist for important categories
  if (!checklist.some(item => item.category === 'setup')) {
    checklist.push({
      id: `checklist_${checklistCounter++}`,
      text: 'Ensure market conditions match strategy requirements',
      category: 'setup',
      priority: checklist.length
    });
  }
  
  if (!checklist.some(item => item.category === 'management')) {
    checklist.push({
      id: `checklist_${checklistCounter++}`,
      text: 'Set position size based on risk management rules',
      category: 'management',
      priority: checklist.length
    });
  }
  
  if (!checklist.some(item => item.category === 'mindset')) {
    checklist.push({
      id: `checklist_${checklistCounter++}`,
      text: 'Check emotional state before placing trade',
      category: 'mindset',
      priority: checklist.length
    });
  }
  
  return { rules, checklist };
}

/**
 * Log an audit event
 */
async function logAuditEvent(event: {
  user_id: string;
  action_type: string;
  component_name: string;
  component_path?: string;
  action_details: Record<string, any>;
}): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      user_id: event.user_id,
      action_type: event.action_type,
      component_name: event.component_name,
      component_path: event.component_path || 'strategy-intelligence',
      action_details: event.action_details,
      client_timestamp: new Date().toISOString(),
      server_timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
} 