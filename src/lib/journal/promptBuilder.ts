import { JournalEntry } from './schema';

/**
 * Interface for AI reflection response
 */
export interface AIReflection {
  summary: string;
  tags: string[];
  suggestion: string;
  confidence: number; // 0-1 scale
}

/**
 * Interface for the AI prompt structure
 */
export interface AIPromptData {
  entry: JournalEntry;
  additionalContext?: string;
}

/**
 * Builds a structured prompt for AI analysis of a journal entry
 * @param data Journal entry and optional context
 * @returns Formatted prompt string for AI analysis
 */
export function buildReflectionPrompt(data: AIPromptData): string {
  const { entry, additionalContext = '' } = data;
  
  // Calculate P&L for context
  const profitLoss = entry.sentiment === 'Bullish' 
    ? ((entry.exitPrice - entry.entryPrice) / entry.entryPrice) * 100
    : ((entry.entryPrice - entry.exitPrice) / entry.entryPrice) * 100;
  
  const profitStatus = profitLoss > 0 ? 'profitable' : 'loss-making';
  
  return `You are an expert trading psychologist and performance coach. Analyze the following trade journal entry and provide structured feedback to help improve trading psychology and decision-making.

TRADE DETAILS:
- Title: ${entry.title}
- Instrument: ${entry.pair}
- Timeframe: ${entry.timeframe}
- Entry Price: ${entry.entryPrice}
- Exit Price: ${entry.exitPrice}
- Sentiment: ${entry.sentiment}
- P&L: ${profitLoss.toFixed(2)}% (${profitStatus})
- Tags: ${entry.tags.join(', ') || 'None'}
- Date: ${new Date(entry.createdAt).toLocaleDateString()}

TRADER'S REASONING:
"${entry.reason}"

${additionalContext ? `ADDITIONAL CONTEXT:\n${additionalContext}\n` : ''}

Please analyze this trade and respond with ONLY a valid JSON object containing:

{
  "summary": "A 2-3 sentence insight about the trade execution, decision-making process, or market timing",
  "tags": ["1-3 behavioral tags like FOMO, Overconfident, Patient, Disciplined, etc."],
  "suggestion": "One specific, actionable improvement suggestion for future trades",
  "confidence": 0.85
}

Focus on:
1. Decision-making patterns and psychological factors
2. Risk management approach
3. Market timing and execution quality
4. Emotional discipline and consistency
5. Learning opportunities regardless of P&L outcome

Be constructive, specific, and actionable. Avoid generic advice.`;
}

/**
 * Builds a batch prompt for analyzing multiple entries to identify patterns
 * @param entries Array of journal entries
 * @returns Formatted prompt for pattern analysis
 */
export function buildPatternAnalysisPrompt(entries: JournalEntry[]): string {
  if (entries.length === 0) {
    throw new Error('Cannot analyze patterns with no entries');
  }
  
  const entriesText = entries.map((entry, index) => {
    const profitLoss = entry.sentiment === 'Bullish' 
      ? ((entry.exitPrice - entry.entryPrice) / entry.entryPrice) * 100
      : ((entry.entryPrice - entry.exitPrice) / entry.entryPrice) * 100;
    
    return `TRADE ${index + 1}:
- ${entry.title} (${entry.pair}, ${entry.timeframe})
- ${entry.sentiment} bias, ${profitLoss.toFixed(2)}% P&L
- Reasoning: "${entry.reason}"
- Date: ${new Date(entry.createdAt).toLocaleDateString()}
`;
  }).join('\n');
  
  return `You are a trading performance analyst. Analyze these ${entries.length} recent trades to identify behavioral patterns and overall performance trends.

${entriesText}

Respond with ONLY a valid JSON object:

{
  "overallPattern": "Brief description of recurring behavioral patterns",
  "strengths": ["2-3 positive patterns identified"],
  "weaknesses": ["2-3 areas needing improvement"],
  "recommendations": ["2-3 specific actionable improvements"],
  "riskProfile": "Conservative/Moderate/Aggressive assessment",
  "consistency": 0.75
}

Focus on psychological consistency, risk management patterns, market timing, and decision-making quality across all trades.`;
}

/**
 * Helper function to validate AI response format
 * @param response Raw AI response string
 * @returns Parsed and validated AIReflection object
 */
export function validateAIReflection(response: string): AIReflection {
  try {
    const parsed = JSON.parse(response);
    
    // Validate required fields
    if (!parsed.summary || typeof parsed.summary !== 'string') {
      throw new Error('Invalid or missing summary');
    }
    
    if (!Array.isArray(parsed.tags)) {
      throw new Error('Invalid or missing tags array');
    }
    
    if (!parsed.suggestion || typeof parsed.suggestion !== 'string') {
      throw new Error('Invalid or missing suggestion');
    }
    
    // Ensure confidence is a number between 0 and 1
    const confidence = typeof parsed.confidence === 'number' 
      ? Math.max(0, Math.min(1, parsed.confidence))
      : 0.5;
    
    // Limit tags to reasonable amount
    const tags = parsed.tags.slice(0, 5).map((tag: any // eslint-disable-line @typescript-eslint/no-explicit-any) => String(tag));
    
    return {
      summary: parsed.summary.trim(),
      tags,
      suggestion: parsed.suggestion.trim(),
      confidence
    };
  } catch (error) {
    console.error('Failed to parse AI reflection:', error);
    throw new Error('Invalid AI response format');
  }
} 