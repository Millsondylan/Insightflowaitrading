
import { JournalEntry } from './schema';
import { buildReflectionPrompt, validateAIReflection, type AIReflection } from './promptBuilder';

/**
 * Main function to reflect on a journal entry using AI
 * @param entry The journal entry to analyze
 * @param additionalContext Optional additional context for the AI
 * @returns Promise resolving to AI reflection
 */
export async function reflectOnEntry(
  entry: JournalEntry,
  additionalContext?: string
): Promise<AIReflection> {
  try {
    // Build the prompt for AI analysis
    const prompt = buildReflectionPrompt({
      entry,
      additionalContext
    });
    
    // Call OpenAI API (mock implementation for now)
    const response = await callOpenAI(prompt);
    
    // Validate and return the response
    return validateAIReflection(response);
  } catch (error) {
    console.error('Error reflecting on entry:', error);
    
    // Return fallback reflection
    return {
      summary: "Unable to generate AI reflection at this time. Please try again later.",
      tags: ["Technical Issue"],
      suggestion: "Check your internet connection and try again.",
      confidence: 0.1
    };
  }
}

/**
 * Mock OpenAI API call - replace with actual implementation
 * @param prompt The prompt to send to OpenAI
 * @returns Promise resolving to AI response
 */
async function callOpenAI(prompt: string): Promise<string> {
  // This is a mock implementation
  // In a real implementation, you would use the OpenAI SDK
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock response
  return JSON.stringify({
    summary: "This trade shows good risk management with a clear exit strategy. The entry timing could be improved by waiting for stronger confirmation signals.",
    tags: ["Disciplined", "Risk Management"],
    suggestion: "Consider using multiple timeframe analysis to confirm entry signals before executing trades.",
    confidence: 0.85
  });
}

/**
 * Batch reflection for multiple entries
 * @param entries Array of journal entries to analyze
 * @returns Promise resolving to array of AI reflections
 */
export async function reflectOnEntries(entries: JournalEntry[]): Promise<AIReflection[]> {
  const reflections: AIReflection[] = [];
  
  for (const entry of entries) {
    try {
      const reflection = await reflectOnEntry(entry);
      reflections.push(reflection);
    } catch (error) {
      console.error(`Error reflecting on entry ${entry.id}:`, error);
      // Add fallback reflection for failed entries
      reflections.push({
        summary: "Unable to analyze this entry.",
        tags: ["Error"],
        suggestion: "Review this trade manually.",
        confidence: 0.1
      });
    }
  }
  
  return reflections;
}

/**
 * Get reflection statistics
 * @param reflections Array of AI reflections
 * @returns Statistics about the reflections
 */
export function getReflectionStats(reflections: AIReflection[]) {
  const allTags = reflections.flatMap(r => r.tags);
  const avgConfidence = reflections.reduce((sum, r) => sum + r.confidence, 0) / reflections.length;
  
  // Count tag frequency
  const tagCounts = allTags.reduce((counts, tag) => {
    counts[tag] = (counts[tag] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Get most common tags
  const mostCommonTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));
  
  return {
    totalReflections: reflections.length,
    averageConfidence: avgConfidence,
    mostCommonTags,
    totalUniqueTags: Object.keys(tagCounts).length
  };
}
