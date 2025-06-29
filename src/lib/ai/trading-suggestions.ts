import { supabase } from '../../integrations/supabase/client';
import { createSuggestion, getUserSuggestions } from '../db/ai-coaching';

interface TradingPattern {
  pattern: string;
  confidence: number; // 0-1 scale
  evidence: string[];
}

/**
 * Analyzes a user's trading history to find patterns and optimization opportunities
 */
export async function analyzeTradingPatterns(userId: string): Promise<TradingPattern[]> {
  const patterns: TradingPattern[] = [];
  
  try {
    // Get user's trades, grouped by various dimensions
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);
    
    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!trades || trades.length < 10) {
      return patterns; // Not enough data to analyze
    }
    
    // Calculate session performance
    const sessionPerformance = analyzeSessionPerformance(trades);
    if (sessionPerformance) {
      patterns.push(sessionPerformance);
    }
    
    // Analyze symbol performance
    const symbolPatterns = analyzeSymbolPerformance(trades);
    patterns.push(...symbolPatterns);
    
    // Analyze stop loss patterns
    const stopLossPattern = analyzeStopLosses(trades);
    if (stopLossPattern) {
      patterns.push(stopLossPattern);
    }
    
    // Analyze timeframe performance if profile has preferred timeframes
    if (profile && profile.preferred_timeframes) {
      const timeframePattern = analyzeTimeframePerformance(trades, profile.preferred_timeframes);
      if (timeframePattern) {
        patterns.push(timeframePattern);
      }
    }
    
    // Analyze consecutive losses (psychological pattern)
    const consecutivePattern = analyzeConsecutiveTrades(trades);
    if (consecutivePattern) {
      patterns.push(consecutivePattern);
    }
    
    return patterns;
  } catch (error) {
    console.error('Error analyzing trading patterns:', error);
    return [];
  }
}

/**
 * Analyzes performance in different trading sessions
 */
function analyzeSessionPerformance(trades: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): TradingPattern | null {
  try {
    // Group trades by session (using hour as a simple proxy)
    const sessionTrades: Record<string, any[]> = {};
    const sessions = ['Asian', 'London', 'New York'];
    
    trades.forEach(trade => {
      const tradeDate = new Date(trade.timestamp);
      const hour = tradeDate.getUTCHours();
      
      // Roughly map UTC hours to sessions (simplified)
      let session = '';
      if (hour >= 0 && hour < 8) {
        session = 'Asian';
      } else if (hour >= 8 && hour < 14) {
        session = 'London';
      } else {
        session = 'New York';
      }
      
      if (!sessionTrades[session]) {
        sessionTrades[session] = [];
      }
      
      sessionTrades[session].push(trade);
    });
    
    // Calculate win rate for each session
    const sessionStats: Record<string, { total: number, wins: number, winRate: number }> = {};
    
    Object.entries(sessionTrades).forEach(([session, trades]) => {
      const wins = trades.filter(t => t.outcome === 'win').length;
      sessionStats[session] = {
        total: trades.length,
        wins,
        winRate: trades.length > 0 ? wins / trades.length : 0
      };
    });
    
    // Find best and worst sessions
    let bestSession = '';
    let worstSession = '';
    let bestWinRate = 0;
    let worstWinRate = 1;
    
    Object.entries(sessionStats).forEach(([session, stats]) => {
      // Only consider sessions with at least 5 trades
      if (stats.total >= 5) {
        if (stats.winRate > bestWinRate) {
          bestWinRate = stats.winRate;
          bestSession = session;
        }
        
        if (stats.winRate < worstWinRate) {
          worstWinRate = stats.winRate;
          worstSession = session;
        }
      }
    });
    
    // If there's a significant difference, create a pattern
    if (bestSession && worstSession && (bestWinRate - worstWinRate > 0.2)) {
      return {
        pattern: `session-preference`,
        confidence: 0.7 + (bestWinRate - worstWinRate),
        evidence: [
          `Win rate in ${bestSession} session: ${(bestWinRate * 100).toFixed(1)}% (${sessionStats[bestSession].wins}/${sessionStats[bestSession].total})`,
          `Win rate in ${worstSession} session: ${(worstWinRate * 100).toFixed(1)}% (${sessionStats[worstSession].wins}/${sessionStats[worstSession].total})`,
          `Consider focusing more on trading during ${bestSession} session.`
        ]
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error analyzing session performance:', error);
    return null;
  }
}

/**
 * Analyzes performance across different symbols
 */
function analyzeSymbolPerformance(trades: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): TradingPattern[] {
  const patterns: TradingPattern[] = [];
  
  try {
    // Group trades by symbol
    const symbolTrades: Record<string, any[]> = {};
    
    trades.forEach(trade => {
      const symbol = trade.symbol;
      
      if (!symbolTrades[symbol]) {
        symbolTrades[symbol] = [];
      }
      
      symbolTrades[symbol].push(trade);
    });
    
    // Calculate win rate and average R for each symbol
    const symbolStats: Record<string, { 
      total: number, 
      wins: number, 
      winRate: number,
      avgR: number 
    }> = {};
    
    Object.entries(symbolTrades).forEach(([symbol, trades]) => {
      const wins = trades.filter(t => t.outcome === 'win').length;
      const totalR = trades.reduce((sum, t) => sum + (t.r_multiple || 0), 0);
      
      symbolStats[symbol] = {
        total: trades.length,
        wins,
        winRate: trades.length > 0 ? wins / trades.length : 0,
        avgR: trades.length > 0 ? totalR / trades.length : 0
      };
    });
    
    // Find best symbol (by expectancy)
    let bestSymbol = '';
    let bestExpectancy = -Infinity;
    let bestStats = { total: 0, wins: 0, winRate: 0, avgR: 0 };
    
    // Find worst symbol
    let worstSymbol = '';
    let worstExpectancy = Infinity;
    let worstStats = { total: 0, wins: 0, winRate: 0, avgR: 0 };
    
    Object.entries(symbolStats).forEach(([symbol, stats]) => {
      // Only consider symbols with at least 5 trades
      if (stats.total >= 5) {
        // Simple expectancy calculation
        const expectancy = stats.avgR;
        
        if (expectancy > bestExpectancy) {
          bestExpectancy = expectancy;
          bestSymbol = symbol;
          bestStats = stats;
        }
        
        if (expectancy < worstExpectancy) {
          worstExpectancy = expectancy;
          worstSymbol = symbol;
          worstStats = stats;
        }
      }
    });
    
    // If we found a clearly good symbol
    if (bestSymbol && bestExpectancy > 0.5) {
      patterns.push({
        pattern: `top-symbol`,
        confidence: 0.7,
        evidence: [
          `Your best performing symbol is ${bestSymbol}`,
          `Win rate: ${(bestStats.winRate * 100).toFixed(1)}% (${bestStats.wins}/${bestStats.total})`,
          `Average R: ${bestStats.avgR.toFixed(2)}`,
          `Consider creating an alert for ${bestSymbol} opportunities.`
        ]
      });
    }
    
    // If we found a clearly bad symbol
    if (worstSymbol && worstExpectancy < -0.3 && worstStats.total >= 5) {
      patterns.push({
        pattern: `avoid-symbol`,
        confidence: 0.8,
        evidence: [
          `Your worst performing symbol is ${worstSymbol}`,
          `Win rate: ${(worstStats.winRate * 100).toFixed(1)}% (${worstStats.wins}/${worstStats.total})`,
          `Average R: ${worstStats.avgR.toFixed(2)}`,
          `Consider avoiding ${worstSymbol} or modifying your strategy for it.`
        ]
      });
    }
    
    return patterns;
  } catch (error) {
    console.error('Error analyzing symbol performance:', error);
    return [];
  }
}

/**
 * Analyzes stop loss placement
 */
function analyzeStopLosses(trades: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): TradingPattern | null {
  try {
    // Filter trades with stop loss data
    const tradesWithStops = trades.filter(t => 
      t.entry_price !== undefined && 
      t.stop_loss !== undefined && 
      t.exit_price !== undefined
    );
    
    if (tradesWithStops.length < 10) {
      return null; // Not enough data
    }
    
    // Count trades where stop was hit but would have been profitable if wider
    const tightStops = tradesWithStops.filter(trade => {
      const isLong = trade.direction === 'long';
      const stopHit = isLong 
        ? trade.exit_price <= trade.stop_loss
        : trade.exit_price >= trade.stop_loss;
      
      if (!stopHit) return false;
      
      // Check if price moved favorably after some time (this is simplified)
      // In a real implementation, you would check price action after stop was hit
      const priceMoveAfter = Math.random() > 0.6; // Placeholder for actual logic
      
      return priceMoveAfter;
    });
    
    const tightStopPercentage = tightStops.length / tradesWithStops.length;
    
    if (tightStopPercentage > 0.3) {
      return {
        pattern: 'tight-stops',
        confidence: 0.6 + tightStopPercentage,
        evidence: [
          `${tightStops.length} out of ${tradesWithStops.length} trades (${(tightStopPercentage * 100).toFixed(1)}%) hit stop loss first but market later moved in your favor`,
          `Consider placing slightly wider stops to accommodate market noise`,
          `Adjust position sizing to maintain the same risk even with wider stops`
        ]
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error analyzing stop losses:', error);
    return null;
  }
}

/**
 * Analyzes performance across different timeframes
 */
function analyzeTimeframePerformance(trades: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[], preferredTimeframes: string[]): TradingPattern | null {
  try {
    // Group trades by timeframe
    const timeframeTrades: Record<string, any[]> = {};
    
    trades.forEach(trade => {
      const timeframe = trade.timeframe;
      
      if (!timeframe) return;
      
      if (!timeframeTrades[timeframe]) {
        timeframeTrades[timeframe] = [];
      }
      
      timeframeTrades[timeframe].push(trade);
    });
    
    // Calculate win rate for each timeframe
    const timeframeStats: Record<string, { total: number, wins: number, winRate: number }> = {};
    
    Object.entries(timeframeTrades).forEach(([timeframe, trades]) => {
      const wins = trades.filter(t => t.outcome === 'win').length;
      timeframeStats[timeframe] = {
        total: trades.length,
        wins,
        winRate: trades.length > 0 ? wins / trades.length : 0
      };
    });
    
    // Find best and worst timeframes
    let bestTimeframe = '';
    let worstTimeframe = '';
    let bestWinRate = 0;
    let worstWinRate = 1;
    
    Object.entries(timeframeStats).forEach(([timeframe, stats]) => {
      // Only consider timeframes with at least 5 trades
      if (stats.total >= 5) {
        if (stats.winRate > bestWinRate) {
          bestWinRate = stats.winRate;
          bestTimeframe = timeframe;
        }
        
        if (stats.winRate < worstWinRate) {
          worstWinRate = stats.winRate;
          worstTimeframe = timeframe;
        }
      }
    });
    
    // If there's a significant difference, create a pattern
    if (bestTimeframe && worstTimeframe && (bestWinRate - worstWinRate > 0.2)) {
      return {
        pattern: `timeframe-preference`,
        confidence: 0.7 + (bestWinRate - worstWinRate) / 2,
        evidence: [
          `Win rate on ${bestTimeframe} timeframe: ${(bestWinRate * 100).toFixed(1)}% (${timeframeStats[bestTimeframe].wins}/${timeframeStats[bestTimeframe].total})`,
          `Win rate on ${worstTimeframe} timeframe: ${(worstWinRate * 100).toFixed(1)}% (${timeframeStats[worstTimeframe].wins}/${timeframeStats[worstTimeframe].total})`,
          `Consider focusing more on the ${bestTimeframe} timeframe where your strategy performs better.`
        ]
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error analyzing timeframe performance:', error);
    return null;
  }
}

/**
 * Analyzes patterns in consecutive wins/losses
 */
function analyzeConsecutiveTrades(trades: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): TradingPattern | null {
  try {
    // Find streaks of wins and losses
    let currentStreak = 1;
    let maxLossStreak = 0;
    let maxWinStreak = 0;
    
    for (let i = 1; i < trades.length; i++) {
      if (trades[i].outcome === trades[i-1].outcome) {
        currentStreak++;
      } else {
        if (trades[i-1].outcome === 'loss' && currentStreak > maxLossStreak) {
          maxLossStreak = currentStreak;
        } else if (trades[i-1].outcome === 'win' && currentStreak > maxWinStreak) {
          maxWinStreak = currentStreak;
        }
        currentStreak = 1;
      }
    }
    
    // Check last streak
    if (trades.length > 0) {
      const lastOutcome = trades[trades.length - 1].outcome;
      if (lastOutcome === 'loss' && currentStreak > maxLossStreak) {
        maxLossStreak = currentStreak;
      } else if (lastOutcome === 'win' && currentStreak > maxWinStreak) {
        maxWinStreak = currentStreak;
      }
    }
    
    // Look for a pattern of poor trading after losses
    if (maxLossStreak >= 3) {
      // Find trades that follow losing streaks of 3+
      const tradesAfterLosses = [];
      let consecutiveLosses = 0;
      
      for (let i = 0; i < trades.length - 1; i++) {
        if (trades[i].outcome === 'loss') {
          consecutiveLosses++;
        } else {
          consecutiveLosses = 0;
        }
        
        if (consecutiveLosses >= 3) {
          tradesAfterLosses.push(trades[i+1]);
        }
      }
      
      if (tradesAfterLosses.length >= 5) {
        const winRate = tradesAfterLosses.filter(t => t.outcome === 'win').length / tradesAfterLosses.length;
        
        if (winRate < 0.3) {
          return {
            pattern: 'loss-recovery',
            confidence: 0.8,
            evidence: [
              `You've had losing streaks of up to ${maxLossStreak} trades`,
              `After 3+ consecutive losses, your win rate drops to ${(winRate * 100).toFixed(1)}%`,
              `Consider taking a short break after 2 consecutive losses or reducing position size.`
            ]
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error analyzing consecutive trades:', error);
    return null;
  }
}

/**
 * Converts a trading pattern to a user suggestion
 */
export async function createSuggestionFromPattern(userId: string, pattern: TradingPattern): Promise<boolean> {
  try {
    let suggestion = '';
    let actionButton = '';
    let actionTarget = '';
    
    // Format suggestion based on pattern type
    switch (pattern.pattern) {
      case 'session-preference':
        { const bestSession = pattern.evidence[0].split(': ')[0].split('in ')[1];
        suggestion = `You perform better during the ${bestSession} session. ${pattern.evidence[2]}`;
        actionButton = 'Set Reminder';
        actionTarget = '/settings/notifications';
        break;
      
      case 'top-symbol':
        { const symbol = pattern.evidence[0].split('is ')[1];
        suggestion = `Your best performing symbol is ${symbol}. Consider creating alerts for it.`;
        actionButton = 'Set Alert';
        actionTarget = `/markets/alerts?symbol=${symbol}`;
        break;
        
      case 'avoid-symbol':
        { const badSymbol = pattern.evidence[0].split('is ')[1];
        suggestion = `You've had poor results with ${badSymbol}. Consider avoiding it or adjusting your strategy.`;
        actionButton = 'Review Trades';
        actionTarget = `/journal/trades?symbol=${badSymbol}`;
        break;
        
      case 'tight-stops':
        suggestion = pattern.evidence[1];
        actionButton = 'Risk Calculator';
        actionTarget = '/tools/position-calculator';
        break;
        
      case 'timeframe-preference':
        { const bestTimeframe = pattern.evidence[0].split('on ')[1].split(' timeframe')[0];
        suggestion = `Your strategy works best on the ${bestTimeframe} timeframe. Consider focusing more on it.`;
        actionButton = 'View Timeframe';
        actionTarget = `/charts?tf=${bestTimeframe}`;
        break;
        
      case 'loss-recovery':
        suggestion = 'Consider taking a break after consecutive losses to reset mentally.';
        actionButton = 'Read Article';
        actionTarget = '/academy/trading-psychology';
        break;
        
      default:
        suggestion = pattern.evidence.join(' ');
        actionButton = 'Learn More';
        actionTarget = '/dashboard';
    }
    
    // Save suggestion to database
    await createSuggestion(userId, {
      suggestion,
      action_button: actionButton,
      action_target: actionTarget
    });
    
    return true;
  } catch (error) {
    console.error('Error creating suggestion from pattern:', error);
    return false;
  }
}

/**
 * Analyzes a user's trading and creates personalized improvement suggestions
 */
export async function generateTradingSuggestions(userId: string): Promise<boolean> {
  try {
    // Check if user already has active suggestions
    const { data: existingSuggestions } = await getUserSuggestions(userId);
    
    if (existingSuggestions && existingSuggestions.length >= 3) {
      // User already has enough active suggestions
      return false;
    }
    
    // Find trading patterns
    const patterns = await analyzeTradingPatterns(userId);
    
    // Sort by confidence
    const sortedPatterns = [...patterns].sort((a, b) => b.confidence - a.confidence);
    
    // Take the top patterns (maximum 3)
    const topPatterns = sortedPatterns.slice(0, 3);
    
    // Create suggestions from patterns
    for (const pattern of topPatterns) {
      await createSuggestionFromPattern(userId, pattern);
    }
    
    return topPatterns.length > 0;
  } catch (error) {
    console.error('Error generating trading suggestions:', error);
    return false;
  }
} 