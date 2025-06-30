// AI Market Setup Generator
// This function generates trade setup suggestions based on market data and user preferences

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

export const handler = async (event, context) => {
  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    // Parse request body
    const { symbol, timeframe, user_id } = JSON.parse(event.body);
    
    // Validate required parameters
    if (!symbol || !timeframe || !user_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
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
    
    if (error || !user || user.id !== user_id) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized: Invalid token' })
      };
    }
    
    // Check if we have a recent setup for this symbol/timeframe combo (cache for 15 minutes)
    const cacheWindow = new Date();
    cacheWindow.setMinutes(cacheWindow.getMinutes() - 15);
    
    const { data: cachedSetup } = await supabase
      .from('market_setups')
      .select('*')
      .eq('symbol', symbol)
      .eq('timeframe', timeframe)
      .eq('user_id', user_id)
      .gte('created_at', cacheWindow.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (cachedSetup && cachedSetup.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          result: cachedSetup[0],
          source: 'cache'
        })
      };
    }
    
    // Get user preferences
    const { data: userPreferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();
      
    const tradingStyle = userPreferences?.trading_style || 'swing';
    const riskRatio = userPreferences?.risk_ratio || 2.0;
    const favoriteIndicators = userPreferences?.favorite_indicators || ['EMA', 'RSI'];
    
    // Fetch market data (last 100 candles)
    const marketData = await fetchMarketData(symbol, timeframe, 100);
    
    // Generate trade setup using AI
    const setup = await generateTradeSetup(symbol, timeframe, marketData, {
      tradingStyle,
      riskRatio,
      favoriteIndicators
    });
    
    // Store the setup in the database
    const { data: newSetup, error: insertError } = await supabase
      .from('market_setups')
      .insert([{
        user_id: user_id,
        symbol: symbol,
        timeframe: timeframe,
        entry: setup.entry,
        sl: setup.sl,
        tp: setup.tp,
        trade_type: setup.tradeType,
        confidence_score: setup.confidenceScore,
        pattern_description: setup.patternDescription,
        indicator_data: setup.indicators,
        ai_generated: true
      }])
      .select()
      .single();
      
    if (insertError) throw insertError;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        result: newSetup,
        source: 'ai'
      })
    };
    
  } catch (error) {
    console.error('Error in AI setup generator:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate market setup' })
    };
  }
};

// Fetch market data from an API
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

// Generate trade setup using AI
async function generateTradeSetup(symbol, timeframe, marketData, preferences) {
  try {
    // Format the market data for the AI prompt
    const recentCandles = marketData.slice(-10).map(c => ({
      timestamp: c.timestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    }));
    
    // Current price is the close of the last candle
    const currentPrice = marketData[marketData.length - 1].close;
    
    // Prepare prompt for AI
    const prompt = `
You are an expert trading analyst with decades of experience in technical analysis.
Based on the following market data and user preferences, suggest a high-probability trade setup.

Market: ${symbol}
Timeframe: ${timeframe}
User preferences:
- Trading style: ${preferences.tradingStyle}
- Risk-reward ratio: 1:${preferences.riskRatio}
- Favorite indicators: ${preferences.favoriteIndicators.join(', ')}

Recent price action (last 10 candles, most recent last):
${JSON.stringify(recentCandles, null, 2)}

Current price: ${currentPrice}

Analyze this data and provide:
1. Trade direction (LONG or SHORT)
2. Entry price (specific price, not a range)
3. Stop loss price (specific price)
4. Take profit price (based on the user's preferred risk ratio)
5. Pattern or indicator that triggered this setup (e.g., "Bullish engulfing at support", "RSI divergence")
6. Confidence score (0-100, where 100 is highest confidence)
7. Brief explanation (1-2 sentences)

Format your response as a valid JSON object with these fields exactly as follows:
{
  "tradeType": "LONG or SHORT",
  "entry": number,
  "sl": number,
  "tp": number,
  "patternDescription": "string",
  "confidenceScore": number,
  "explanation": "string",
  "indicators": {}
}

IMPORTANT: Make sure the response is valid JSON and includes reasonable prices based on the current market price.
Entry, SL, and TP must be numeric values, not strings or ranges.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a trading expert AI that analyzes market data and provides precise trade setups." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });
    
    // Parse the AI response
    const setupJson = response.choices[0]?.message?.content || "{}";
    const setup = JSON.parse(setupJson);
    
    // Validate the setup data
    if (!setup.tradeType || !setup.entry || !setup.sl || !setup.tp) {
      throw new Error("AI returned incomplete setup data");
    }
    
    return setup;
  } catch (error) {
    console.error('Error generating trade setup with AI:', error);
    
    // Return a fallback setup for demonstration purposes
    const currentPrice = marketData[marketData.length - 1].close;
    const isLong = Math.random() > 0.5;
    const slDistance = currentPrice * 0.01; // 1% stop loss
    
    return {
      tradeType: isLong ? 'LONG' : 'SHORT',
      entry: currentPrice,
      sl: isLong ? currentPrice - slDistance : currentPrice + slDistance,
      tp: isLong ? currentPrice + (slDistance * preferences.riskRatio) : currentPrice - (slDistance * preferences.riskRatio),
      patternDescription: isLong ? 'Potential bullish reversal pattern' : 'Potential bearish reversal pattern',
      confidenceScore: 65,
      explanation: "Fallback setup generated due to AI service error.",
      indicators: {
        trendStrength: "moderate",
        volatility: "medium"
      }
    };
  }
} 