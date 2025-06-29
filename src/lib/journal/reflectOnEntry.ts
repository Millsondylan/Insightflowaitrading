import { JournalEntry } from './schema';
import { AIReflection, buildReflectionPrompt } from './promptBuilder';
import { requestReflection } from '@/api/journal/reflect';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for storing AI reflections in Supabase
 */
export interface StoredAIReflection extends AIReflection {
  id: string;
  journalEntryId: string;
  userId: string;
  createdAt: string;
  provider: string; // Which AI provider was used
}

/**
 * Cache for storing reflections to avoid repeated API calls
 */
const reflectionCache = new Map<string, AIReflection>();

/**
 * Generates AI reflection for a journal entry with caching
 * @param entry Journal entry to analyze
 * @param options Configuration options
 * @returns AI reflection analysis
 */
export async function reflectOnEntry(
  entry: JournalEntry,
  options: {
    forceRefresh?: boolean;
    additionalContext?: string;
    saveToDatabase?: boolean;
    userId?: string;
  } = {}
): Promise<aIReflection> {
  const { 
    forceRefresh = false, 
    additionalContext, 
    saveToDatabase = true,
    userId 
  } = options;

  const cacheKey = `${entry.id}-${additionalContext || ''}`;

  // Check cache first unless force refresh is requested
  if (!forceRefresh && reflectionCache.has(cacheKey)) {
    console.log('Returning cached AI reflection for entry:', entry.id);
    return reflectionCache.get(cacheKey)!;
  }

  // Check if we have a stored reflection in the database
  if (!forceRefresh && saveToDatabase && entry.id) {
    try {
      const storedReflection = await getStoredReflection(entry.id);
      if (storedReflection) {
        // Cache the stored reflection
        const reflection: AIReflection = {
          summary: storedReflection.summary,
          tags: storedReflection.tags,
          suggestion: storedReflection.suggestion,
          confidence: storedReflection.confidence
        };
        reflectionCache.set(cacheKey, reflection);
        return reflection;
      }
    } catch (error) {
      console.warn('Failed to fetch stored reflection:', error);
      // Continue with generating new reflection
    }
  }

  try {
    // Generate new reflection
    const reflection = await requestReflection(entry, additionalContext);
    
    // Cache the result
    reflectionCache.set(cacheKey, reflection);
    
    // Save to database if requested
    if (saveToDatabase && userId && entry.id) {
      try {
        await saveReflectionToDatabase(reflection, entry.id, userId);
      } catch (error) {
        console.warn('Failed to save reflection to database:', error);
        // Don't fail the entire operation if saving fails
      }
    }
    
    return reflection;
  } catch (error) {
    console.error('Failed to generate AI reflection:', error);
    throw error;
  }
}

/**
 * Retrieves stored AI reflection from Supabase using correct column names
 * @param journalEntryId ID of the journal entry
 * @returns Stored AI reflection or null if not found
 */
async function getStoredReflection(journalEntryId: string): Promise<StoredAIReflection | null> {
  try {
    const { data, error } = await supabase
      .from('ai_reflections')
      .select('*')
      .eq('journalentryid', journalEntryId)
      .order('createdat', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, which is fine
        return null;
      }
      throw error;
    }

    // Map database column names to expected format
    return {
      id: data.id,
      journalEntryId: data.journalentryid,
      userId: data.userid,
      summary: data.summary,
      tags: data.tags,
      suggestion: data.suggestion,
      confidence: data.confidence,
      provider: data.provider,
      createdAt: data.createdat
    } as StoredAIReflection;
  } catch (error) {
    console.error('Error fetching stored reflection:', error);
    return null;
  }
}

/**
 * Saves AI reflection to Supabase for future reference using correct column names
 * @param reflection AI reflection to save
 * @param journalEntryId ID of the journal entry
 * @param userId User ID
 * @returns Saved reflection data
 */
async function saveReflectionToDatabase(
  reflection: AIReflection,
  journalEntryId: string,
  userId: string
): Promise<StoredAIReflection> {
  const reflectionData = {
    journalentryid: journalEntryId,
    userid: userId,
    summary: reflection.summary,
    tags: reflection.tags,
    suggestion: reflection.suggestion,
    confidence: reflection.confidence,
    provider: 'auto', // Could be enhanced to track which provider was used
    createdat: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('ai_reflections')
    .insert([reflectionData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save reflection: ${error.message}`);
  }

  // Map response back to expected format
  return {
    id: data.id,
    journalEntryId: data.journalentryid,
    userId: data.userid,
    summary: data.summary,
    tags: data.tags,
    suggestion: data.suggestion,
    confidence: data.confidence,
    provider: data.provider,
    createdAt: data.createdat
  } as StoredAIReflection;
}

/**
 * Clears the reflection cache for a specific entry or all entries
 * @param entryId Optional entry ID to clear specific cache entry
 */
export function clearReflectionCache(entryId?: string): void {
  if (entryId) {
    // Clear all cache entries for this entry ID
    for (const key of reflectionCache.keys()) {
      if (key.startsWith(entryId)) {
        reflectionCache.delete(key);
      }
    }
  } else {
    // Clear entire cache
    reflectionCache.clear();
  }
}

/**
 * Batch reflect on multiple journal entries
 * @param entries Array of journal entries to analyze
 * @param options Configuration options
 * @returns Array of reflections with entry IDs
 */
export async function batchReflectOnEntries(
  entries: JournalEntry[],
  options: {
    maxConcurrent?: number;
    additionalContext?: string;
    saveToDatabase?: boolean;
    userId?: string;
  } = {}
): Promise<array<{ entryId: string; reflection: AIReflection | null; error?: string }>> {
  const { maxConcurrent = 3, additionalContext, saveToDatabase = true, userId } = options;
  
  const results: Array<{ entryId: string; reflection: AIReflection | null; error?: string }> = [];
  
  // Process entries in batches to avoid overwhelming the API
  for (let i = 0; i < entries.length; i += maxConcurrent) {
    const batch = entries.slice(i, i + maxConcurrent);
    
    const batchPromises = batch.map(async (entry) => {
      try {
        const reflection = await reflectOnEntry(entry, {
          additionalContext,
          saveToDatabase,
          userId
        });
        return { entryId: entry.id, reflection };
      } catch (error: any // eslint-disable-line @typescript-eslint/no-explicit-any) {
        console.error(`Failed to reflect on entry ${entry.id}:`, error);
        return { 
          entryId: entry.id, 
          reflection: null, 
          error: error.message || 'Unknown error' 
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Gets reflection statistics for a user
 * @param userId User ID
 * @returns Reflection statistics
 */
export async function getReflectionStats(userId: string): Promise<{
  totalReflections: number;
  averageConfidence: number;
  commonTags: Array<{ tag: string; count: number }>;
  recentReflections: number;
}> {
  try {
    const { data, error } = await supabase
      .from('ai_reflections')
      .select('confidence, tags, createdat')
      .eq('userid', userId);

    if (error) throw error;

    const reflections = data || [];
    const totalReflections = reflections.length;
    
    if (totalReflections === 0) {
      return {
        totalReflections: 0,
        averageConfidence: 0,
        commonTags: [],
        recentReflections: 0
      };
    }

    // Calculate average confidence
    const averageConfidence = reflections.reduce((sum, r) => sum + r.confidence, 0) / totalReflections;

    // Count tag frequencies
    const tagCounts = new Map<string, number>();
    reflections.forEach(r => {
      r.tags.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const commonTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count recent reflections (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReflections = reflections.filter(r => 
      new Date(r.createdat) > thirtyDaysAgo
    ).length;

    return {
      totalReflections,
      averageConfidence,
      commonTags,
      recentReflections
    };
  } catch (error) {
    console.error('Error getting reflection stats:', error);
    return {
      totalReflections: 0,
      averageConfidence: 0,
      commonTags: [],
      recentReflections: 0
    };
  }
}
