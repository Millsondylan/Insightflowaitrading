// Backtest Queue Worker
// This function runs periodically to process backtest jobs in the queue

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Maximum number of jobs to process in one run
const MAX_JOBS = 3;

export const handler = async (event, context) => {
  try {
    // Check if this is a scheduled event or manual trigger
    const isScheduled = event.body === null || event.httpMethod === undefined;
    
    // If API request (not scheduled), validate token
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
    }

    // Get queued backtest jobs (oldest first)
    const { data: queuedJobs, error: jobsError } = await supabase
      .from('backtest_jobs')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(MAX_JOBS);
      
    if (jobsError) throw jobsError;
    
    if (!queuedJobs || queuedJobs.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No backtest jobs in queue' })
      };
    }
    
    // Process each job
    const processPromises = queuedJobs.map(async (job) => {
      try {
        return await processBacktestJob(job);
      } catch (err) {
        console.error(`Error processing job ${job.id}:`, err);
        
        // Update job status to failed
        await supabase
          .from('backtest_jobs')
          .update({
            status: 'failed',
            error: err.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);
          
        return { id: job.id, success: false, error: err.message };
      }
    });
    
    const results = await Promise.all(processPromises);
    
    // Count successful jobs
    const successCount = results.filter(result => result.success).length;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Processed ${queuedJobs.length} backtest jobs, ${successCount} successfully completed`,
        results
      })
    };
    
  } catch (error) {
    console.error('Error in backtest worker function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process backtest jobs' })
    };
  }
};

async function processBacktestJob(job) {
  try {
    // Update job to running status
    const { error: updateError } = await supabase
      .from('backtest_jobs')
      .update({
        status: 'running',
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);
      
    if (updateError) throw updateError;
    
    // Get strategy details from the job params
    const { strategy_id, params } = job;
    
    // Get the strategy
    const { data: strategy, error: strategyError } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategy_id)
      .single();
      
    if (strategyError) throw strategyError;
    if (!strategy) throw new Error('Strategy not found');
    
    // Get price data for backtest
    const marketData = await fetchMarketData(params.symbol, params.timeframe, params.start_date, params.end_date);
    
    // Run the backtest
    const backtestResult = await runBacktest(strategy, marketData, params);
    
    // Update job with results
    const { error: resultError } = await supabase
      .from('backtest_jobs')
      .update({
        status: 'done',
        result: backtestResult,
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);
      
    if (resultError) throw resultError;
    
    // Store backtest result in separate table for history
    const { error: historyError } = await supabase
      .from('backtest_results')
      .insert([{
        job_id: job.id,
        user_id: job.user_id,
        strategy_id: strategy_id,
        params: params,
        result: backtestResult,
        created_at: new Date().toISOString()
      }]);
      
    if (historyError) throw historyError;
    
    // Send notification to user
    await supabase
      .from('notifications')
      .insert([{
        user_id: job.user_id,
        type: 'backtest',
        title: 'Backtest Completed',
        message: `Your backtest for ${strategy.name} on ${params.symbol} is complete.`,
        data: {
          job_id: job.id,
          strategy_id: strategy_id,
          win_rate: backtestResult.win_rate,
          profit_factor: backtestResult.profit_factor
        }
      }]);
      
    return {
      id: job.id,
      success: true,
      result: {
        win_rate: backtestResult.win_rate,
        profit_factor: backtestResult.profit_factor,
        total_trades: backtestResult.trades.length
      }
    };
  } catch (error) {
    console.error(`Error processing backtest job ${job.id}:`, error);
    throw error;
  }
}

async function fetchMarketData(symbol, timeframe, startDate, endDate) {
  try {
    // Check if we have data cached in the database
    const { data: cachedData, error: cacheError } = await supabase
      .from('market_data_cache')
      .select('data')
      .eq('symbol', symbol)
      .eq('timeframe', timeframe)
      .single();
      
    if (!cacheError && cachedData) {
      // Filter the cached data by date range
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      
      return cachedData.data.filter(candle => {
        const candleTime = new Date(candle.timestamp).getTime();
        return candleTime >= start && candleTime <= end;
      });
    }
    
    // If no cached data, use a market data API (placeholder)
    const marketData = [];
    
    // Simulated data generation for demonstration
    // In production, you would fetch from a real market data API
    const start = new Date(startDate);
    const end = new Date(endDate);
    const day = 24 * 60 * 60 * 1000;
    
    for (let time = start.getTime(); time <= end.getTime(); time += day) {
      const date = new Date(time);
      
      // Generate simulated price data
      const basePrice = symbol === 'BTCUSD' ? 30000 : 
                        symbol === 'ETHUSD' ? 2000 : 
                        symbol === 'EURUSD' ? 1.1 : 100;
      
      const randomFactor = 0.02; // 2% daily random movement
      const dayFactor = 1 + (Math.random() * 2 - 1) * randomFactor;
      
      const open = basePrice * (1 + (time - start.getTime()) / (end.getTime() - start.getTime()) * 0.2);
      const close = open * dayFactor;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 1000 + 500;
      
      marketData.push({
        timestamp: date.toISOString(),
        open,
        high,
        low,
        close,
        volume
      });
    }
    
    return marketData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

async function runBacktest(strategy, marketData, params) {
  // Parse strategy rules
  const rules = strategy.rules;
  
  // Initialize backtest state
  const trades = [];
  let position = null;
  let cash = params.initial_capital || 10000;
  let equity = cash;
  
  // Track performance metrics
  let winCount = 0;
  let lossCount = 0;
  let totalProfit = 0;
  let totalLoss = 0;
  let maxDrawdown = 0;
  let peakEquity = cash;
  
  // Run strategy on market data
  for (let i = 0; i < marketData.length; i++) {
    const candle = marketData[i];
    
    // Get the last N candles for analysis (lookback window)
    const lookback = Math.min(i, params.lookback || 20);
    const history = marketData.slice(i - lookback, i + 1);
    
    // Check if we should enter a position
    if (!position && evaluateEntryRules(rules.entry, candle, history)) {
      position = {
        entry_price: candle.close,
        entry_time: candle.timestamp,
        size: calculatePositionSize(cash, candle.close, params),
        direction: rules.entry.find(r => r.type === 'direction')?.value || 'long'
      };
    }
    
    // Check if we should exit an existing position
    else if (position && evaluateExitRules(rules.exit, candle, history, position)) {
      // Calculate profit/loss
      const exitPrice = candle.close;
      const priceDiff = position.direction === 'long' 
        ? exitPrice - position.entry_price
        : position.entry_price - exitPrice;
      
      const profitLoss = priceDiff * position.size;
      
      // Record trade
      const trade = {
        entry_price: position.entry_price,
        entry_time: position.entry_time,
        exit_price: exitPrice,
        exit_time: candle.timestamp,
        size: position.size,
        profit_loss: profitLoss,
        profit_loss_percent: (profitLoss / (position.size * position.entry_price)) * 100,
        direction: position.direction
      };
      
      trades.push(trade);
      
      // Update metrics
      if (profitLoss > 0) {
        winCount++;
        totalProfit += profitLoss;
      } else {
        lossCount++;
        totalLoss -= profitLoss; // Convert to positive number
      }
      
      // Update cash and equity
      cash += profitLoss;
      equity = cash;
      
      // Track max drawdown
      if (equity > peakEquity) {
        peakEquity = equity;
      }
      
      const drawdown = (peakEquity - equity) / peakEquity * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
      
      // Reset position
      position = null;
    }
  }
  
  // Calculate final metrics
  const totalTrades = winCount + lossCount;
  const winRate = totalTrades > 0 ? (winCount / totalTrades * 100) : 0;
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
  const finalReturn = (equity - params.initial_capital) / params.initial_capital * 100;
  
  return {
    trades,
    metrics: {
      win_rate: winRate,
      profit_factor: profitFactor,
      total_trades: totalTrades,
      win_count: winCount,
      loss_count: lossCount,
      max_drawdown: maxDrawdown,
      final_equity: equity,
      return: finalReturn
    },
    win_rate: winRate, // Duplicate for convenience
    profit_factor: profitFactor,
    equity_curve: calculateEquityCurve(trades, params.initial_capital)
  };
}

function evaluateEntryRules(rules, currentCandle, history) {
  // Simplified rule evaluation logic
  // In production, this would be much more sophisticated
  return Math.random() > 0.85; // Simulate entries about 15% of the time
}

function evaluateExitRules(rules, currentCandle, history, position) {
  // Simplified exit logic
  // In production, this would be much more sophisticated
  return Math.random() > 0.7; // Simulate exits about 30% of the time when in a position
}

function calculatePositionSize(cash, price, params) {
  const riskPercent = params.risk_per_trade || 0.02; // Default 2% risk
  const maxRisk = cash * riskPercent;
  
  // For simplicity, let's just do fixed fractional
  return maxRisk / price;
}

function calculateEquityCurve(trades, initialCapital) {
  const curve = [{ timestamp: new Date(0).toISOString(), equity: initialCapital }];
  
  let equity = initialCapital;
  trades.forEach(trade => {
    equity += trade.profit_loss;
    curve.push({
      timestamp: trade.exit_time,
      equity
    });
  });
  
  return curve;
} 