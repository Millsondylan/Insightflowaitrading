import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { AI_PROVIDERS } from '@/lib/config';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  pair: string;
  entryPrice: number;
  exitPrice: number;
  timeframe: string;
  reason: string;
  sentiment: string;
  chartUrl?: string;
  tags?: string[];
  createdAt: string;
}

export interface AIReflection {
  id: string;
  journalEntryId: string;
  userId: string;
  summary: string;
  tags: string[];
  suggestion: string;
  confidence: number;
  provider: string;
  createdAt: string;
}

export interface ReflectionOptions {
  userId: string;
  saveToDatabase?: boolean;
  additionalContext?: string;
  forceRefresh?: boolean;
  preferredProvider?: 'openai' | 'groq' | 'gemini';
}

/**
 * Generate AI reflection for a journal entry
 * @param entry The journal entry to analyze
 * @param options Configuration options
 * @returns AI-generated reflection
 */
export async function reflectOnEntry(
  entry: JournalEntry,
  options: ReflectionOptions
): Promise<AIReflection | null> {
  try {
    const { userId, saveToDatabase = true, forceRefresh = false } = options;

    // Check if we already have a reflection for this entry
    if (!forceRefresh) {
      const { data: existingReflection } = await supabase
        .from('ai_reflections')
        .select('*')
        .eq('journalentryid', entry.id)
        .single();

      if (existingReflection) {
        return {
          id: existingReflection.id,
          journalEntryId: existingReflection.journalentryid,
          userId: existingReflection.userid,
          summary: existingReflection.summary,
          tags: existingReflection.tags,
          suggestion: existingReflection.suggestion,
          confidence: existingReflection.confidence,
          provider: existingReflection.provider,
          createdAt: existingReflection.createdat
        };
      }
    }

    // Generate reflection using the preferred provider or falling back as needed
    const reflection = await generateReflection(entry, options);

    if (!reflection) {
      console.error('Failed to generate reflection for entry:', entry.id);
      return null;
    }

    // Save to database if requested
    if (saveToDatabase) {
      const { error } = await supabase.from('ai_reflections').insert({
        id: reflection.id,
        journalentryid: reflection.journalEntryId,
        userid: reflection.userId,
        summary: reflection.summary,
        tags: reflection.tags,
        suggestion: reflection.suggestion,
        confidence: reflection.confidence,
        provider: reflection.provider,
        createdat: reflection.createdAt
      });

      if (error) {
        console.error('Failed to save reflection:', error);
      }

      // Log audit event
      await logAuditEvent({
        user_id: userId,
        action_type: 'REFLECTION_GENERATE',
        component_name: 'JournalReflection',
        action_details: {
          journal_entry_id: entry.id,
          reflection_id: reflection.id,
          provider: reflection.provider
        }
      });
    }

    return reflection;
  } catch (error) {
    console.error('Error in reflectOnEntry:', error);
    return null;
  }
}

/**
 * Get historical patterns from a user's journal entries
 * @param userId User ID
 * @param limit Number of entries to analyze
 * @returns Object with behavioral patterns and statistics
 */
export async function analyzeJournalPatterns(
  userId: string,
  limit: number = 10
): Promise<{
  patterns: { pattern: string; frequency: number; impact: number }[];
  emotionMap: Record<string, number>;
  tradingHabits: string[];
  improvementAreas: string[];
}> {
  try {
    // Get recent journal entries
    const { data: entries, error: entriesError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('userid', userId)
      .order('createdat', { ascending: false })
      .limit(limit);

    if (entriesError) throw entriesError;

    // Get reflections for these entries
    const { data: reflections, error: reflectionsError } = await supabase
      .from('ai_reflections')
      .select('*')
      .eq('userid', userId)
      .in(
        'journalentryid',
        entries.map((e) => e.id)
      );

    if (reflectionsError) throw reflectionsError;

    // Combine entries with their reflections
    const combinedData = entries.map((entry) => {
      const reflection = reflections.find((r) => r.journalentryid === entry.id);
      return {
        entry,
        reflection
      };
    });

    // Extract all tags
    const allTags = reflections.flatMap((r) => r.tags || []);
    const tagFrequency: Record<string, number> = {};
    
    // Count frequency of each tag
    allTags.forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    // Calculate pattern impact (simplified)
    const patterns = Object.entries(tagFrequency).map(([pattern, frequency]) => {
      // For each pattern, check if it's associated with winning or losing trades
      const entriesWithPattern = combinedData.filter(
        (d) => d.reflection && d.reflection.tags && d.reflection.tags.includes(pattern)
      );

      // Calculate win/loss ratio for trades with this pattern
      let winCount = 0;
      entriesWithPattern.forEach((d) => {
        const pnl = d.entry.exitprice - d.entry.entryprice;
        if (pnl > 0) winCount++;
      });

      const winRate = entriesWithPattern.length > 0 ? winCount / entriesWithPattern.length : 0;
      // Impact is positive if win rate > 0.5, negative otherwise
      const impact = (winRate - 0.5) * 2; // Scale to -1 to 1 range

      return {
        pattern,
        frequency,
        impact
      };
    });

    // Extract emotion map from sentiments
    const emotions = entries.map((e) => e.sentiment);
    const emotionMap: Record<string, number> = {};

    emotions.forEach((emotion) => {
      if (emotion) {
        emotionMap[emotion] = (emotionMap[emotion] || 0) + 1;
      }
    });

    // Identify trading habits (simplified)
    const tradingHabits = [
      ...patterns
        .filter((p) => p.frequency > 1) // Pattern occurs more than once
        .map((p) => p.pattern)
    ];

    // Identify improvement areas (patterns with negative impact)
    const improvementAreas = patterns
      .filter((p) => p.impact < 0)
      .map((p) => p.pattern);

    return {
      patterns,
      emotionMap,
      tradingHabits,
      improvementAreas
    };
  } catch (error) {
    console.error('Error analyzing journal patterns:', error);
    return {
      patterns: [],
      emotionMap: {},
      tradingHabits: [],
      improvementAreas: []
    };
  }
}

/**
 * Get AI coaching feedback based on recent trading activity
 * @param userId User ID
 * @returns Coaching suggestions based on recent patterns
 */
export async function generateCoachingFeedback(
  userId: string
): Promise<{
  feedback: string;
  focus_areas: string[];
  strengths: string[];
  urgency: 'low' | 'medium' | 'high';
}> {
  try {
    // Get pattern analysis
    const patterns = await analyzeJournalPatterns(userId, 20);

    // Determine strengths (patterns with positive impact)
    const strengths = patterns.patterns
      .filter((p) => p.impact > 0.3)
      .map((p) => p.pattern);

    // Determine focus areas (patterns with negative impact)
    const focus_areas = patterns.patterns
      .filter((p) => p.impact < -0.2 && p.frequency > 1)
      .map((p) => p.pattern);

    // Determine urgency based on frequency and impact of negative patterns
    let urgency: 'low' | 'medium' | 'high' = 'low';
    const negativePatterns = patterns.patterns.filter((p) => p.impact < 0);
    
    const totalNegativeFreq = negativePatterns.reduce((sum, p) => sum + p.frequency, 0);
    const averageNegativeImpact = negativePatterns.length > 0
      ? negativePatterns.reduce((sum, p) => sum + p.impact, 0) / negativePatterns.length
      : 0;

    if (totalNegativeFreq > 10 && averageNegativeImpact < -0.5) {
      urgency = 'high';
    } else if (totalNegativeFreq > 5 || averageNegativeImpact < -0.3) {
      urgency = 'medium';
    }

    // Generate feedback text
    let feedback = '';
    
    if (urgency === 'high') {
      feedback = `I've noticed some concerning patterns in your recent trading. You might want to take a step back and review your strategy, particularly regarding ${focus_areas.join(', ')}.`;
    } else if (urgency === 'medium') {
      feedback = `There are a few areas where small adjustments could improve your results. Consider paying attention to ${focus_areas.join(', ')}.`;
    } else {
      feedback = `Your trading has been generally consistent. To further improve, you might consider refining ${focus_areas.length > 0 ? focus_areas.join(', ') : 'your existing approach'}.`;
    }

    // Add strengths to the feedback
    if (strengths.length > 0) {
      feedback += ` Your strengths include ${strengths.join(', ')}. Keep leveraging these aspects of your trading.`;
    }

    // Save coaching feedback to database
    const { error } = await supabase.from('coaching_feedback').insert({
      id: uuidv4(),
      user_id: userId,
      feedback_type: 'journal_reflection',
      context_data: patterns,
      ai_analysis: feedback,
      suggestions: focus_areas,
      urgency,
      user_acknowledged: false,
      follow_up_required: urgency === 'high',
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Failed to save coaching feedback:', error);
    }

    return {
      feedback,
      focus_areas,
      strengths,
      urgency
    };
  } catch (error) {
    console.error('Error generating coaching feedback:', error);
    return {
      feedback: 'Unable to generate coaching feedback at this time.',
      focus_areas: [],
      strengths: [],
      urgency: 'low'
    };
  }
}

/**
 * Generate AI reflection using available providers
 * @param entry Journal entry
 * @param options Reflection options
 * @returns AI-generated reflection
 */
async function generateReflection(
  entry: JournalEntry,
  options: ReflectionOptions
): Promise<AIReflection | null> {
  const providers = determineProviderOrder(options.preferredProvider);

  for (const provider of providers) {
    try {
      const reflection = await callAIProvider(entry, provider, options);
      if (reflection) {
        return {
          id: uuidv4(),
          journalEntryId: entry.id,
          userId: options.userId,
          summary: reflection.summary,
          tags: reflection.tags,
          suggestion: reflection.suggestion,
          confidence: reflection.confidence,
          provider,
          createdAt: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error(`Error with ${provider} provider:`, error);
      // Continue to next provider
    }
  }

  // Fallback to basic analysis if all AI providers fail
  return {
    id: uuidv4(),
    journalEntryId: entry.id,
    userId: options.userId,
    summary: generateBasicSummary(entry),
    tags: extractBasicTags(entry),
    suggestion: generateBasicSuggestion(entry),
    confidence: 0.5,
    provider: 'fallback',
    createdAt: new Date().toISOString()
  };
}

/**
 * Determine the order of AI providers to try
 * @param preferredProvider User's preferred provider
 * @returns Ordered array of providers to try
 */
function determineProviderOrder(
  preferredProvider?: 'openai' | 'groq' | 'gemini'
): ('openai' | 'groq' | 'gemini')[] {
  const available: ('openai' | 'groq' | 'gemini')[] = [];

  // Add available providers based on configured API keys
  if (AI_PROVIDERS.openai) available.push('openai');
  if (AI_PROVIDERS.groq) available.push('groq');
  if (AI_PROVIDERS.gemini) available.push('gemini');

  // If no providers are available, return empty array
  if (available.length === 0) {
    return [];
  }

  // If preferred provider is available, put it first
  if (preferredProvider && available.includes(preferredProvider)) {
    return [
      preferredProvider,
      ...available.filter((p) => p !== preferredProvider)
    ];
  }

  // Otherwise return all available providers
  return available;
}

/**
 * Call a specific AI provider API
 * @param entry Journal entry
 * @param provider AI provider
 * @param options Reflection options
 * @returns AI response
 */
async function callAIProvider(
  entry: JournalEntry,
  provider: 'openai' | 'groq' | 'gemini',
  options: ReflectionOptions
): Promise<{
  summary: string;
  tags: string[];
  suggestion: string;
  confidence: number;
} | null> {
  const prompt = buildPrompt(entry, options.additionalContext);
  
  // Implementation would vary based on provider
  // In a real implementation, we would make API calls to the respective providers
  
  // For demonstration purposes, we'll use a simple mock that varies by provider
  switch (provider) {
    case 'openai':
      // Mock OpenAI response
      return {
        summary: `You entered a ${entry.pair} trade and noted feeling ${entry.sentiment}. The trade ${entry.exitPrice > entry.entryPrice ? 'was profitable' : 'resulted in a loss'}. Your reasoning showed ${entry.reason.includes('plan') ? 'adherence to your plan' : 'potential impulse decision making'}.`,
        tags: extractBasicTags(entry).concat(['Analyzed', 'AI-Reviewed']),
        suggestion: `Consider ${entry.exitPrice < entry.entryPrice ? 'reviewing your entry criteria' : 'documenting this successful pattern'} for future reference.`,
        confidence: 0.92
      };

    case 'groq':
      // Mock Groq response
      return {
        summary: `Your ${entry.pair} trade reflects a ${entry.sentiment} emotional state. ${entry.exitPrice > entry.entryPrice ? 'The positive outcome' : 'The negative outcome'} appears to be related to your approach described in your reasoning.`,
        tags: extractBasicTags(entry).concat(['Pattern-Identified']),
        suggestion: `Next time, try to ${entry.sentiment === 'calm' ? 'maintain this emotional discipline' : 'trade with a calmer mindset'} for better results.`,
        confidence: 0.85
      };

    case 'gemini':
      // Mock Gemini response
      return {
        summary: `Analysis shows this ${entry.pair} trade on ${entry.timeframe} timeframe ${entry.exitPrice > entry.entryPrice ? 'succeeded' : 'failed'} with a ${entry.sentiment} sentiment noted.`,
        tags: extractBasicTags(entry),
        suggestion: `To improve, focus on ${entry.reason.length < 50 ? 'documenting your reasoning more thoroughly' : 'maintaining your detailed analysis approach'}.`,
        confidence: 0.79
      };

    default:
      return null;
  }
}

/**
 * Extract basic tags from a journal entry
 * @param entry Journal entry
 * @returns Array of behavioral tags
 */
function extractBasicTags(entry: JournalEntry): string[] {
  const tags: string[] = [];

  // Sentiment-based tags
  if (entry.sentiment === 'calm' || entry.sentiment === 'confident') {
    tags.push('Disciplined');
  } else if (entry.sentiment === 'anxious' || entry.sentiment === 'fearful') {
    tags.push('Anxious');
  } else if (entry.sentiment === 'excited' || entry.sentiment === 'eager') {
    tags.push('FOMO');
  } else if (entry.sentiment === 'angry' || entry.sentiment === 'frustrated') {
    tags.push('Revenge-Trading');
  }

  // Reason-based tags
  const reasonLower = entry.reason.toLowerCase();
  if (reasonLower.includes('plan') || reasonLower.includes('strategy')) {
    tags.push('Plan-Following');
  }
  if (reasonLower.includes('impulse') || reasonLower.includes('quick')) {
    tags.push('Impulsive');
  }
  if (reasonLower.includes('wait') || reasonLower.includes('patient')) {
    tags.push('Patient');
  }
  if (reasonLower.includes('risk') || reasonLower.includes('stop loss')) {
    tags.push('Risk-Aware');
  }

  // Outcome vs expectation
  const pnl = entry.exitPrice - entry.entryPrice;
  if ((pnl > 0 && entry.sentiment === 'confident') ||
      (pnl < 0 && entry.sentiment === 'anxious')) {
    tags.push('Self-Aware');
  }
  if ((pnl < 0 && entry.sentiment === 'confident') ||
      (pnl > 0 && entry.sentiment === 'anxious')) {
    tags.push('Misaligned-Expectation');
  }

  return tags;
}

/**
 * Generate a basic summary for a journal entry
 * @param entry Journal entry
 * @returns Summary text
 */
function generateBasicSummary(entry: JournalEntry): string {
  const outcome = entry.exitPrice >= entry.entryPrice ? 'profit' : 'loss';
  
  return `You traded ${entry.pair} on the ${entry.timeframe} timeframe with a ${outcome}. You noted feeling ${entry.sentiment} during this trade. Your reasoning was: "${entry.reason.substring(0, 100)}${entry.reason.length > 100 ? '...' : ''}"`;
}

/**
 * Generate a basic suggestion for a journal entry
 * @param entry Journal entry
 * @returns Suggestion text
 */
function generateBasicSuggestion(entry: JournalEntry): string {
  const pnl = entry.exitPrice - entry.entryPrice;
  
  if (pnl > 0) {
    return 'Document this successful trade pattern and consider what elements you can replicate in future trades.';
  } else {
    return 'Review what could have been improved in your analysis or execution, and consider if your emotional state affected your decision-making.';
  }
}

/**
 * Build a prompt for AI analysis
 * @param entry Journal entry
 * @param additionalContext Additional user context
 * @returns Formatted AI prompt
 */
function buildPrompt(entry: JournalEntry, additionalContext?: string): string {
  const pnl = entry.exitPrice - entry.entryPrice;
  const pnlPercent = ((entry.exitPrice - entry.entryPrice) / entry.entryPrice) * 100;
  
  return `
Please analyze this trading journal entry:

Instrument: ${entry.pair}
Timeframe: ${entry.timeframe}
Entry Price: ${entry.entryPrice}
Exit Price: ${entry.exitPrice}
Outcome: ${pnl > 0 ? 'Profit' : 'Loss'} of ${Math.abs(pnl).toFixed(2)} (${Math.abs(pnlPercent).toFixed(2)}%)
Emotional State: ${entry.sentiment}

Trader's Reasoning:
"${entry.reason}"

${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Please provide:
1. A brief summary of the trade and decision process
2. Key behavioral tags that identify trading psychology patterns
3. A suggestion for improvement or reinforcement
`;
}

/**
 * Update the memory store with insights from a journal entry
 * @param userId User ID
 * @param entryId Journal entry ID
 * @param reflection AI reflection
 * @returns Success status
 */
export async function storeMemory(
  userId: string,
  entryId: string,
  reflection: AIReflection
): Promise<boolean> {
  try {
    // Get entry date from journal entry
    const { data: entry } = await supabase
      .from('journal_entries')
      .select('createdat')
      .eq('id', entryId)
      .single();
    
    if (!entry) return false;
    
    const entryDate = entry.createdat.split('T')[0]; // Just get the date part
    
    // Store patterns in memory
    for (const tag of reflection.tags) {
      await supabase.from('journal_memory').insert({
        id: uuidv4(),
        user_id: userId,
        entry_date: entryDate,
        pattern: tag,
        emotion: reflection.summary.includes('positive') ? 'positive' : 
                reflection.summary.includes('negative') ? 'negative' : 'neutral',
        created_at: new Date().toISOString()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error storing memory:', error);
    return false;
  }
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
      component_path: event.component_path || 'journal-reflection',
      action_details: event.action_details,
      client_timestamp: new Date().toISOString(),
      server_timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}
