// AI Strategy Scanner
// This function parses a trading strategy and finds markets where the strategy currently applies

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fetch from 'node-fetch';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Market data provider API key
const MARKET_API_KEY = process.env.MARKET_API_KEY;

// Popular markets to scan by default
const POPULAR_MARKETS = [
  'BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'SOL/USDT',  // Crypto
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD',       // Forex
  'AAPL', 'MSFT', 'GOOGL', 'AMZN',                  // Stocks
  'GOLD', 'SILVER', 'OIL', 'NATGAS'                 // Commodities
];

// Timeframes to check
const DEFAULT_TIMEFRAMES = ['15m', '1h', '4h', 'D1'];

export const handler = async (event, context) => {
  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    // Parse request body
    const { strategy_id, markets, timeframes } = JSON.parse(event.body);
    
    // Validate required parameters
    if (!strategy_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameter: strategy_id' })
      };
    }
    
    // Verify the JWT token with Supabase
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized: Missing or invalid token' })
      };
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized: Invalid token' })
      };
    }
    
    // Get the strategy details from the database
    const { data: strategy, error: strategyError } = await supabase
      .from('user_strategies')
      .select('*')
      .eq('id', strategy_id)
      .single();
      
    if (strategyError || !strategy) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Strategy not found' })
      };
    }
    
    // Check if the strategy belongs to the authenticated user or is public
    if (strategy.user_id !== user.id && !strategy.is_public) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Access denied to this strategy' })
      };
    }
    
    // Use provided markets or default to popular ones
    const marketsToScan = markets || POPULAR_MARKETS;
    
    // Use provided timeframes or default ones
    const timeframesToScan = timeframes || DEFAULT_TIMEFRAMES;
    
    // If the strategy has already been parsed by AI, use that
    let parsedStrategy = strategy.ai_parsed;
    
    // If not parsed yet, parse it using AI
    if (!parsedStrategy) {
      parsedStrategy = await parseStrategyWithAI(strategy.strategy_text);
      
      // Update the strategy with the parsed version
      const { error: updateError } = await supabase
        .from('user_strategies')
        .update({ ai_parsed: parsedStrategy })
        .eq('id', strategy_id);
        
      if (updateError) {
        console.error('Error updating strategy with parsed version:', updateError);
      }
    }
    
    // Scan the markets
    const scanResults = await scanMarkets(strategy_id, parsedStrategy, marketsToScan, timeframesToScan);
    
    // Save the setups found during scanning
    if (scanResults.matchingSetups.length > 0) {
      // Delete any existing setups for this strategy
      await supabase
        .from('strategy_setups')
        .delete()
        .eq('strategy_id', strategy_id);
        
      // Batch insert the new setups
      const setupsToInsert = scanResults.matchingSetups.map(setup => ({
        strategy_id: strategy_id,
        symbol: setup.symbol,
        entry: setup.entry,
        sl: setup.sl,
        tp: setup.tp,
        confidence: setup.confidence,
        timeframe: setup.timeframe
      }));
      
      const { error: insertError } = await supabase
        .from('strategy_setups')
        .insert(setupsToInsert);
        
      if (insertError) {
        console.error('Error inserting strategy setups:', insertError);
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        strategy_id: strategy_id,
        total_markets_scanned: scanResults.totalScanned,
        matching_setups_count: scanResults.matchingSetups.length,
        matching_setups: scanResults.matchingSetups
      })
    };
    
  } catch (error) {
    console.error('Error in strategy scanning function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to scan strategy across markets' })
    };
  }
};

// Parse a strategy text description into structured logic using GPT-4
async function parseStrategyWithAI(strategyText) {
  try {
    const prompt = `
You are an expert algorithmic trading developer. Your task is to convert the following trading strategy described in plain language into structured logic.

Trading Strategy:
${strategyText}

Convert this into a JSON object with the following structure:
{
  "name": "Concise name of the strategy",
  "direction": "LONG" or "SHORT" or "BOTH", // Indicates if the strategy is for long trades, short trades, or both
  "timeframes": ["15m", "1h", "4h", "D1"], // List of timeframes this strategy works best on
  "entryConditions": [
    // Array of conditions that need to be ALL true for an entry
    {
      "type": "indicator", // One of: "indicator", "pattern", "price", "volume"
      "indicator": "indicator name", // e.g., "RSI", "EMA", "MACD"
      "condition": "condition description", // e.g., "RSI < 30", "EMA50 crosses above EMA200"
      "weight": 1.0 // Importance of this condition (0.1 to 1.0)
    },
    // More conditions...
  ],
  "exitConditions": [
    // Array of conditions for taking profit or stopping loss
    {
      "type": "takeProfit",
      "value": "calculation", // e.g., "2x stop distance"
    },
    {
      "type": "stopLoss",
      "value": "calculation" // e.g., "below recent low"
    }
  ],
  "description": "A concise 1-2 sentence explanation of the strategy"
}

Guidelines:
- Analyze the strategy and extract precise entry and exit conditions
- If specific indicator parameters are mentioned, include them
- If a specific calculation method is described for stops or targets, include that
- Make the JSON valid and properly structured
- Don't include any trailing commas in the JSON
- Ensure all JSON fields are properly completed with sensible values based on the strategy

Return ONLY the JSON object, nothing else.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are an algorithmic trading expert that converts natural language trading strategies into structured JSON logic." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });
    
    const parsedStrategy = JSON.parse(response.choices[0]?.message?.content || "{}");
    return parsedStrategy;
  } catch (error) {
    console.error('Error parsing strategy with AI:', error);
    return {
      name: "Error parsing strategy",
      direction: "BOTH",
      timeframes: ["1h"],
      entryConditions: [],
      exitConditions: [],
      description: "Failed to parse strategy text"
    };
  }
}

// Scan multiple markets to find where this strategy currently applies
async function scanMarkets(strategyId, parsedStrategy, markets, timeframes) {
  const matchingSetups = [];
  let totalScanned = 0;
  
  // For each market and timeframe combination
  for (const symbol of markets) {
    for (const timeframe of timeframes) {
      totalScanned++;
      
      try {
        // Skip timeframes that aren't compatible with this strategy
        if (parsedStrategy.timeframes && !parsedStrategy.timeframes.includes(timeframe)) {
          continue;
        }
        
        // Fetch market data for this symbol and timeframe
        const marketData = await fetchMarketData(symbol, timeframe, 100);
        
        // Check if the strategy conditions apply to this market data
        const matches = await checkStrategyAgainstMarket(parsedStrategy, symbol, timeframe, marketData);
        
        // If we found a match, add it to our results
        if (matches.isMatch) {
          matchingSetups.push({
            strategy_id: strategyId,
            symbol: symbol,
            timeframe: timeframe,
            entry: matches.entry,
            sl: matches.sl,
            tp: matches.tp,
            confidence: matches.confidence,
            reasons: matches.reasons
          });
        }
      } catch (error) {
        console.error(`Error scanning ${symbol} on ${timeframe}:`, error);
        // Continue to next market/timeframe
      }
    }
  }
  
  return {
    totalScanned,
    matchingSetups
  };
}

// Fetch market data from an external API
async function fetchMarketData(symbol, timeframe, limit) {
  try {
    // This is a simplified example - implement with your actual market data provider
    const response = await fetch(
      `https://api.market-data-provider.com/historical?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}&limit=${limit}&apikey=${MARKET_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Market data API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.candles || [];
    
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Return dummy data in case of failure for demo purposes
    return generateDummyMarketData(100);
  }
}

// Generate dummy market data for development/fallback
function generateDummyMarketData(count) {
  const data = [];
  let basePrice = 100 + Math.random() * 1000;
  
  for (let i = 0; i < count; i++) {
    const volatility = 0.02;
    const changePercent = (Math.random() - 0.5) * volatility;
    basePrice *= (1 + changePercent);
    
    const open = basePrice;
    const close = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.round(1000 + Math.random() * 10000);
    
    const now = new Date();
    now.setMinutes(now.getMinutes() - (count - i) * 15); // For 15m candles
    
    data.push({
      timestamp: now.toISOString(),
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return data;
}

// Check if the strategy conditions apply to the given market data
async function checkStrategyAgainstMarket(strategy, symbol, timeframe, marketData) {
  // Use GPT-4 to check if the strategy applies to this market data
  try {
    // Format the latest 10 candles for the AI prompt
    const recentCandles = marketData.slice(-10).map(c => ({
      timestamp: c.timestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume
    }));
    
    // Current price is the close of the last candle
    const currentPrice = marketData[marketData.length - 1].close;
    
    const prompt = `
You are an expert trading system that checks if market data matches a specific trading strategy.

Strategy Definition:
${JSON.stringify(strategy, null, 2)}

Market Data for ${symbol} on ${timeframe} timeframe (last 10 candles, most recent last):
${JSON.stringify(recentCandles, null, 2)}

Current price: ${currentPrice}

Check if the current market conditions match the entry conditions for this strategy.
If the strategy is for LONG trades only, check only for long entry conditions.
If the strategy is for SHORT trades only, check only for short entry conditions.
If the strategy is for BOTH directions, check which direction (if any) currently has valid entry conditions.

Also calculate:
1. Entry price (at current price or specific level nearby)
2. Stop loss price (based on strategy's exit conditions or sensible market level)
3. Take profit price (based on strategy's exit conditions)
4. Confidence score (0-100) based on how well the conditions match

Respond with a JSON object in this exact format:
{
  "isMatch": true/false,
  "entry": number,
  "sl": number,
  "tp": number,
  "direction": "LONG" or "SHORT",
  "confidence": number,
  "reasons": ["reason1", "reason2", ...]
}

IMPORTANT: Make sure the response is valid JSON with numeric values for entry/sl/tp prices.
Only return isMatch=true if the strategy conditions are clearly met in the current market conditions.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a trading expert AI that analyzes if market data matches trading strategy conditions." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });
    
    // Parse the AI response
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    // Default to no match if parsing fails
    if (!result || typeof result.isMatch !== 'boolean') {
      return { isMatch: false };
    }
    
    return result;
    
  } catch (error) {
    console.error('Error checking strategy against market:', error);
    return { isMatch: false };
  }
} 