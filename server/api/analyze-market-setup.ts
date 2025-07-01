import { Request, Response } from 'express';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { storage } from '../storage';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MarketAnalysisRequest {
  symbol: string;
  timeframe: string;
  user_id: string;
  scan_mode?: 'quick' | 'deep';
  include_strategies?: boolean;
}

interface MarketSetup {
  id: string;
  user_id: string;
  symbol: string;
  timeframe: string;
  entry: number;
  sl: number;
  tp: number;
  trade_type: 'LONG' | 'SHORT';
  confidence_score: number;
  pattern_description?: string;
  reasoning_details?: string;
  matching_strategies?: string[];
  indicator_data?: Record<string, any>;
  risk_reward_ratio: number;
  ai_generated: boolean;
  strategy_id?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch historical market data
async function fetchMarketData(symbol: string, timeframe: string) {
  // In a real implementation, this would call a market data API
  // For now, we'll return mock data
  return {
    symbol,
    timeframe,
    candles: generateMockCandles(100),
    indicators: {
      rsi: Math.random() * 100,
      macd: {
        line: Math.random() * 10 - 5,
        signal: Math.random() * 10 - 5,
        histogram: Math.random() * 5 - 2.5
      },
      movingAverages: {
        ma50: 45000 + Math.random() * 1000,
        ma200: 44000 + Math.random() * 1000
      }
    }
  };
}

// Generate mock candle data
function generateMockCandles(count: number) {
  const candles = [];
  let basePrice = 45000 + Math.random() * 5000;
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const volatility = 0.01;
    const change = (Math.random() - 0.5) * volatility * basePrice;
    basePrice += change;
    
    const open = basePrice;
    const close = open + (Math.random() - 0.5) * volatility * open;
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(Math.random() * 1000) + 500;
    
    const timestamp = new Date(now.getTime() - (count - i) * (getTimeframeMinutes('1h') * 60 * 1000));
    
    candles.push({
      timestamp: timestamp.toISOString(),
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return candles;
}

// Convert timeframe to minutes
function getTimeframeMinutes(timeframe: string): number {
  const number = parseInt(timeframe);
  if (timeframe.endsWith('m')) return number;
  if (timeframe.endsWith('h')) return number * 60;
  if (timeframe.endsWith('d')) return number * 60 * 24;
  if (timeframe.endsWith('w')) return number * 60 * 24 * 7;
  return 60; // default to 1h
}

// Mock function to get user strategies
// In a real implementation, this would query your database
async function fetchUserStrategies(userId: string): Promise<Array<{ id: string, title: string }>> {
  try {
    const strategies = await storage.getTradingStrategies(parseInt(userId));
    return strategies.map(strategy => ({
      id: strategy.id,
      title: strategy.title
    }));
  } catch (error) {
    console.error('Error fetching user strategies:', error);
    return [];
  }
}

export default async function handleAnalyzeMarketSetup(req: Request, res: Response) {
  try {
    // Check request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Parse request body
    const { symbol, timeframe, user_id, scan_mode = 'quick', include_strategies = false }: MarketAnalysisRequest = req.body;
    
    // Validate required fields
    if (!symbol || !timeframe || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate user exists
    const user = await storage.getUser(parseInt(user_id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Fetch market data
    const marketData = await fetchMarketData(symbol, timeframe);
    
    // Optionally fetch user's strategies
    let userStrategies: Array<{ id: string, title: string }> = [];
    if (include_strategies) {
      userStrategies = await fetchUserStrategies(user_id);
    }
    
    // Prepare prompt for AI analysis
    const prompt = `
You are an expert trading analyst with deep knowledge of technical analysis and market patterns.

Analyze the following market data for ${symbol} on the ${timeframe} timeframe:
${JSON.stringify(marketData.indicators)}

${include_strategies ? `Consider the user's trading strategies: ${JSON.stringify(userStrategies.map(s => s.title))}` : ''}

Your task:
1. Identify the best trading setup (LONG or SHORT) based on the current market conditions
2. Determine optimal entry price, stop loss, and take profit levels
3. Calculate a confidence score (1-100) based on the strength of the setup
4. Provide a detailed explanation of the pattern and why this setup is likely to work
5. Include relevant technical indicators that support this analysis
6. Calculate the risk-reward ratio

Format your response as JSON with the following structure:
{
  "trade_type": "LONG" or "SHORT",
  "entry": number,
  "sl": number,
  "tp": number,
  "confidence_score": number between 1-100,
  "pattern_description": "brief description of the pattern",
  "reasoning_details": "detailed explanation of why this setup works",
  "indicator_data": { object with key indicators and their values },
  "risk_reward_ratio": number,
  "matching_strategies": ["names of matching strategies"] (if applicable)
}

Only respond with valid JSON.`;
    
    // Call AI to generate analysis
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Analyze ${symbol} on the ${timeframe} timeframe. ${scan_mode === 'deep' ? 'Provide in-depth analysis.' : ''}` }
      ],
      temperature: 0.4,
      response_format: { type: "json_object" }
    });
    
    // Parse AI response
    const analysisText = aiResponse.choices[0]?.message.content || '';
    let analysisData;
    
    try {
      analysisData = JSON.parse(analysisText);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return res.status(500).json({ error: 'Failed to parse AI analysis' });
    }
    
    // Save the market setup to the database
    const savedMarketSetup = await storage.createMarketSetup({
      userId: parseInt(user_id),
      symbol,
      timeframe,
      entry: analysisData.entry.toString(),
      sl: analysisData.sl.toString(),
      tp: analysisData.tp.toString(),
      tradeType: analysisData.trade_type,
      confidenceScore: analysisData.confidence_score.toString(),
      patternDescription: analysisData.pattern_description,
      indicatorData: analysisData.indicator_data || {},
      aiGenerated: true,
      isPublic: false,
    });

    // Return the analysis result
    return res.status(200).json({ 
      success: true,
      result: savedMarketSetup
    });
    
  } catch (error: any) {
    console.error('Error in market setup analysis:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred'
    });
  }
} 