// Setups Leaderboard Updater
// This function runs periodically to recalculate the leaderboard of best trading setups

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Market data provider API key
const MARKET_API_KEY = process.env.MARKET_API_KEY;

export const handler = async (event, context) => {
  try {
    // Check if this is a scheduled event or manual trigger
    const isScheduled = event.body === null || event.httpMethod === undefined;
    
    // If manual API request, validate admin token
    if (!isScheduled) {
      const authHeader = event.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Missing or invalid token' })
        };
      }
      
      // Verify the JWT token with Supabase
      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Invalid token' })
        };
      }
      
      // Check if user has admin privileges
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
        
      if (!userRole || userRole.role !== 'admin') {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Forbidden: Admin privileges required' })
        };
      }
    }
    
    // Fetch all public setups with their likes and views
    const { data: setups, error: setupsError } = await supabase
      .from('public_setups')
      .select(`
        id,
        user_id,
        strategy_id,
        symbol,
        entry,
        sl,
        tp,
        timeframe,
        stats,
        likes,
        views,
        shared_at
      `)
      .order('shared_at', { ascending: false })
      .limit(1000); // Process up to 1000 recent setups
      
    if (setupsError) throw setupsError;
    
    // Get the latest 100 public setups
    const recentSetups = setups.slice(0, 100);
    
    // Process each setup to update performance metrics
    for (const setup of recentSetups) {
      try {
        // Check if backtest results exist in stats
        if (!setup.stats || !setup.stats.backtestResults) {
          // Backtest the setup
          const backtestResults = await backtestSetup(setup);
          
          // Update the stats field
          const updatedStats = {
            ...(setup.stats || {}),
            backtestResults,
            backtested_at: new Date().toISOString()
          };
          
          // Update database with backtest results
          const { error: updateError } = await supabase
            .from('public_setups')
            .update({ stats: updatedStats })
            .eq('id', setup.id);
            
          if (updateError) {
            console.error(`Error updating setup ${setup.id} stats:`, updateError);
          }
        }
      } catch (error) {
        console.error(`Error processing setup ${setup.id}:`, error);
      }
    }
    
    // Calculate ranking score for each setup
    const rankedSetups = setups.map(setup => {
      const ageInDays = (new Date() - new Date(setup.shared_at)) / (1000 * 60 * 60 * 24);
      const recencyFactor = Math.max(0, 1 - (ageInDays / 30)); // Decay over 30 days
      
      // Get backtest stats
      const winRate = setup.stats?.backtestResults?.winRate || 0.5;
      const profitFactor = setup.stats?.backtestResults?.profitFactor || 1.0;
      const confidenceScore = setup.stats?.confidenceScore || 50;
      
      // Calculate score components
      const popularityScore = (setup.likes * 2) + (setup.views * 0.1);
      const performanceScore = (winRate * 50) + (profitFactor * 10);
      const aiScore = confidenceScore * 0.5;
      
      // Combine scores with recency factor
      const totalScore = (popularityScore + performanceScore + aiScore) * recencyFactor;
      
      return {
        ...setup,
        score: totalScore
      };
    });
    
    // Sort by score
    rankedSetups.sort((a, b) => b.score - a.score);
    
    // Save the top 50 to a leaderboard cache table
    const { error: truncateError } = await supabase
      .from('setup_leaderboard')
      .delete()
      .gte('id', 0); // Clear all rows
      
    if (truncateError) throw truncateError;
    
    const top50 = rankedSetups.slice(0, 50).map((setup, index) => ({
      setup_id: setup.id,
      rank: index + 1,
      score: setup.score,
      updated_at: new Date().toISOString()
    }));
    
    const { error: insertError } = await supabase
      .from('setup_leaderboard')
      .insert(top50);
      
    if (insertError) throw insertError;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Leaderboard updated successfully',
        updated: top50.length,
        total_processed: setups.length
      })
    };
    
  } catch (error) {
    console.error('Error updating setup leaderboard:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update setup leaderboard' })
    };
  }
};

// Backtest a trading setup against historical data
async function backtestSetup(setup) {
  try {
    // Get historical data (6 months)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    // This should be replaced with your actual market data API call
    const historicalData = await fetchHistoricalData(
      setup.symbol, 
      setup.timeframe, 
      startDate.toISOString()
    );
    
    if (!historicalData || !historicalData.length) {
      throw new Error('No historical data available for backtesting');
    }
    
    // Find entry candle index (first candle after shared date)
    const entryIndex = historicalData.findIndex(
      candle => new Date(candle.timestamp) > new Date(setup.shared_at)
    );
    
    if (entryIndex === -1) {
      throw new Error('Entry point not found in historical data');
    }
    
    // Determine if trade is long or short based on SL vs TP
    const isLong = setup.tp > setup.entry;
    
    // Track backtest metrics
    let wins = 0;
    let losses = 0;
    let totalProfitR = 0;
    let totalLossR = 0;
    let outcome = 'open'; // 'win', 'loss', or 'open'
    let exitPrice = null;
    let exitDate = null;
    
    // Calculate R value (risk unit)
    const riskPerUnit = Math.abs(setup.entry - setup.sl);
    
    // Simulate trading after entry point
    for (let i = entryIndex; i < historicalData.length; i++) {
      const candle = historicalData[i];
      
      // For long trade
      if (isLong) {
        // Check if stop loss was hit (price went below SL)
        if (candle.low <= setup.sl) {
          outcome = 'loss';
          exitPrice = setup.sl;
          exitDate = candle.timestamp;
          losses++;
          totalLossR += 1; // 1R loss
          break;
        }
        
        // Check if take profit was hit (price went above TP)
        if (candle.high >= setup.tp) {
          outcome = 'win';
          exitPrice = setup.tp;
          exitDate = candle.timestamp;
          wins++;
          totalProfitR += (setup.tp - setup.entry) / riskPerUnit; // Profit in R
          break;
        }
      } 
      // For short trade
      else {
        // Check if stop loss was hit (price went above SL)
        if (candle.high >= setup.sl) {
          outcome = 'loss';
          exitPrice = setup.sl;
          exitDate = candle.timestamp;
          losses++;
          totalLossR += 1; // 1R loss
          break;
        }
        
        // Check if take profit was hit (price went below TP)
        if (candle.low <= setup.tp) {
          outcome = 'win';
          exitPrice = setup.tp;
          exitDate = candle.timestamp;
          wins++;
          totalProfitR += (setup.entry - setup.tp) / riskPerUnit; // Profit in R
          break;
        }
      }
    }
    
    // Calculate backtest metrics
    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? wins / totalTrades : 0;
    const averageR = wins > 0 ? totalProfitR / wins : 0;
    const profitFactor = totalLossR > 0 ? totalProfitR / totalLossR : totalProfitR > 0 ? 999 : 0;
    
    return {
      wins,
      losses,
      totalTrades,
      winRate,
      averageR,
      profitFactor,
      outcome,
      exitPrice,
      exitDate,
      backtested_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error backtesting setup:', error);
    return {
      error: error.message,
      backtested_at: new Date().toISOString()
    };
  }
}

// Fetch historical market data
async function fetchHistoricalData(symbol, timeframe, startDate) {
  try {
    // This is a placeholder - use your actual market data API
    const response = await fetch(
      `https://api.market-data-provider.com/historical?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}&start=${startDate}&apikey=${MARKET_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Market data API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.candles || [];
    
  } catch (error) {
    console.error('Error fetching historical data:', error);
    // Return dummy data for demo purposes
    return generateDummyHistoricalData(symbol, timeframe, startDate);
  }
}

// Generate dummy historical data for development/fallback
function generateDummyHistoricalData(symbol, timeframe, startDate) {
  const data = [];
  let candles = 1000; // About 6 months of 4h candles
  let basePrice = 100 + Math.random() * 1000;
  
  const start = new Date(startDate);
  const timeframeMinutes = getTimeframeMinutes(timeframe);
  
  for (let i = 0; i < candles; i++) {
    const volatility = 0.02;
    const changePercent = (Math.random() - 0.5) * volatility;
    basePrice *= (1 + changePercent);
    
    const open = basePrice;
    const close = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.round(1000 + Math.random() * 10000);
    
    const timestamp = new Date(start);
    timestamp.setMinutes(timestamp.getMinutes() + (i * timeframeMinutes));
    
    data.push({
      timestamp: timestamp.toISOString(),
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return data;
}

// Convert timeframe string to minutes
function getTimeframeMinutes(timeframe) {
  switch (timeframe) {
    case '1m': return 1;
    case '5m': return 5;
    case '15m': return 15;
    case '30m': return 30;
    case '1h': return 60;
    case '4h': return 240;
    case 'D1': return 1440;
    case 'W1': return 10080;
    default: return 60;
  }
} 