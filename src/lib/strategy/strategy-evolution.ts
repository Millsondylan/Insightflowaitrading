import { supabase } from '../../integrations/supabase/client';
import { createStrategyVersion, logStrategyPerformance } from '../db/ai-coaching';
import { getAIPreferences } from '../db/ai-coaching';

interface TradeAnalysis {
  strategyId: string;
  userId: string;
  winRate: number;
  avgDrawdown: number;
  avgRMultiple: number;
  executionSuccessRate: number;
}

const MIN_TRADES_FOR_ANALYSIS = 20;

/**
 * Analyzes strategy performance based on recent trades
 */
export async function analyzeStrategyPerformance(strategyId: string, userId: string): Promise<TradeAnalysis | null> {
  try {
    // Check if user has enabled AI evolution
    const preferences = await getAIPreferences(userId);
    if (!preferences.strategy_evolution) {
      console.log(`Strategy evolution disabled for user ${userId}`);
      return null;
    }
    
    // Get trades for this strategy
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('strategy_id', strategyId)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (!trades || trades.length < MIN_TRADES_FOR_ANALYSIS) {
      console.log(`Not enough trades (${trades?.length || 0}) for analysis of strategy ${strategyId}`);
      return null;
    }
    
    // Calculate metrics
    const winningTrades = trades.filter(trade => trade.outcome === 'win');
    const winRate = winningTrades.length / trades.length;
    const avgDrawdown = trades.reduce((sum, trade) => sum + (trade.max_drawdown || 0), 0) / trades.length;
    const avgRMultiple = trades.reduce((sum, trade) => sum + (trade.r_multiple || 0), 0) / trades.length;
    
    // Calculate execution success rate based on entry conditions
    // This assumes trades have an "entry_condition_matched" boolean field
    const executionSuccessTrades = trades.filter(trade => trade.entry_condition_matched === true);
    const executionSuccessRate = executionSuccessTrades.length / trades.length;
    
    const analysis = {
      strategyId,
      userId,
      winRate,
      avgDrawdown,
      avgRMultiple,
      executionSuccessRate
    };
    
    // Log the performance
    await logStrategyPerformance(strategyId, userId, {
      win_rate: winRate,
      avg_drawdown: avgDrawdown,
      avg_r_multiple: avgRMultiple,
      execution_success_rate: executionSuccessRate
    });
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing strategy performance:', error);
    return null;
  }
}

/**
 * Determines if a strategy needs improvement based on its performance
 */
export function strategyNeedsImprovement(analysis: TradeAnalysis): boolean {
  // Logic to determine if strategy needs improvement
  // These thresholds should be adjusted based on the specific trading style
  if (analysis.winRate < 0.4) return true;
  if (analysis.avgRMultiple < 0.8) return true;
  if (analysis.executionSuccessRate < 0.7) return true;
  
  return false;
}

/**
 * Generates an AI-improved version of a strategy based on performance analysis
 */
export async function generateImprovedStrategy(strategyId: string, userId: string, analysis: TradeAnalysis) {
  try {
    // Get the original strategy
    const { data: strategy } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .single();
    
    if (!strategy) {
      console.error(`Strategy ${strategyId} not found`);
      return null;
    }
    
    // Get user profile for more context
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Get recent trades for this strategy
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('strategy_id', strategyId)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(20);
    
    // Prepare the prompt for GPT
    const prompt = `
You are an expert trading strategy optimizer. You need to improve a trading strategy that is underperforming.

Current performance metrics:
- Win Rate: ${(analysis.winRate * 100).toFixed(1)}%
- Average R-Multiple: ${analysis.avgRMultiple.toFixed(2)}
- Average Drawdown: ${(analysis.avgDrawdown * 100).toFixed(1)}%
- Execution Success Rate: ${(analysis.executionSuccessRate * 100).toFixed(1)}%

User Profile:
- Experience Level: ${profile?.experience_level || 'Intermediate'}
- Trading Style: ${profile?.trading_style || 'Not specified'}
- Preferred Markets: ${profile?.preferred_markets?.join(', ') || 'Not specified'}
- Preferred Timeframes: ${profile?.preferred_timeframes?.join(', ') || 'Not specified'}

Original Strategy:
${JSON.stringify(strategy, null, 2)}

Recent Trade Outcomes:
${trades?.map(trade => `- ${trade.symbol}, ${trade.entry_price} → ${trade.exit_price}, Outcome: ${trade.outcome}, R-Multiple: ${trade.r_multiple}`).join('\n') || 'No trades available'}

Please improve this strategy to address its weaknesses. Specifically:
1. If win rate is low, focus on improving entry conditions to reduce false signals.
2. If R-multiple is low, suggest better exit conditions or stop loss placements.
3. If drawdown is high, add filters to avoid trading during volatile conditions.
4. If execution success rate is low, simplify the entry conditions to make them clearer.

Return only the improved strategy code in valid JSON format, maintaining the same structure as the original but with your improvements.
`;
    
    // Call the GPT API
    const response = await fetch('/api/ai/improve-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt,
        userId,
        strategyId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate improved strategy: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Extract the new strategy code from the result
    const improvedCode = result.improvedStrategy;
    
    // Generate a reason for the improvement
    let improvementReason = "Strategy automatically improved based on performance analysis.";
    if (analysis.winRate < 0.4) {
      improvementReason += " Entry conditions refined to improve win rate.";
    }
    if (analysis.avgRMultiple < 0.8) {
      improvementReason += " Exit conditions optimized to increase R-multiple.";
    }
    if (analysis.avgDrawdown > 0.15) {
      improvementReason += " Added filters to reduce drawdown.";
    }
    
    // Save the new version
    await createStrategyVersion(
      strategyId, 
      userId, 
      improvedCode, 
      improvementReason
    );
    
    return { success: true, improvementReason };
  } catch (error) {
    console.error('Error generating improved strategy:', error);
    return { success: false, error };
  }
}

/**
 * Background job that runs daily to check and improve strategies
 */
export async function runStrategyEvolutionJob() {
  try {
    console.log('Running strategy evolution job');
    
    // Get all strategies with at least 20 trades in the last month
    const { data: strategies } = await supabase
      .from('strategies')
      .select(`
        id,
        user_id,
        trades:trades!inner(id)
      `)
      .gte('trades.timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });
    
    if (!strategies) return;
    
    // Group by user and strategy to count trades
    const strategyCounts = strategies.reduce((acc, s) => {
      const key = `${s.id}:${s.user_id}`;
      acc[key] = (acc[key] || 0) + s.trades.length;
      return acc;
    }, {} as Record<string, number>);
    
    // Process strategies with enough trades
    for (const [key, count] of Object.entries(strategyCounts)) {
      if (count < MIN_TRADES_FOR_ANALYSIS) continue;
      
      const [strategyId, userId] = key.split(':');
      
      // Check user preferences first
      const preferences = await getAIPreferences(userId);
      if (!preferences.strategy_evolution) continue;
      
      // Analyze and potentially improve the strategy
      const analysis = await analyzeStrategyPerformance(strategyId, userId);
      if (analysis && strategyNeedsImprovement(analysis)) {
        await generateImprovedStrategy(strategyId, userId, analysis);
        console.log(`Strategy ${strategyId} improved for user ${userId}`);
      }
    }
    
  } catch (error) {
    console.error('Error in strategy evolution job:', error);
  }
} 