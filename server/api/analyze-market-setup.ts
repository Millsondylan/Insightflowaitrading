import { Request, Response } from 'express';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { storage } from '../storage';

// Initialize OpenAI client (optional)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface MarketAnalysisRequest {
  symbol: string;
  timeframe: string;
  user_id: string;
  scan_mode?: 'quick' | 'deep';
  include_strategies?: boolean;
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
        macd: Math.random() * 2 - 1,
        signal: Math.random() * 2 - 1,
        histogram: Math.random() * 2 - 1
      },
      bollinger: {
        upper: 55000 + Math.random() * 5000,
        middle: 50000 + Math.random() * 5000,
        lower: 45000 + Math.random() * 5000
      },
      volume: Math.random() * 1000000
    }
  };
}

function generateMockCandles(count: number) {
  const candles = [];
  let price = 50000;
  const timeframe = '1h';
  const timeframeMinutes = getTimeframeMinutes(timeframe);
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - (count - i) * timeframeMinutes * 60 * 1000);
    const open = price;
    const change = (Math.random() - 0.5) * 1000;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 500;
    const low = Math.min(open, close) - Math.random() * 500;
    
    candles.push({
      timestamp: timestamp.toISOString(),
      open,
      high,
      low,
      close,
      volume: Math.random() * 100000
    });
    
    price = close;
  }
  
  return candles;
}

function getTimeframeMinutes(timeframe: string): number {
  if (!timeframe) return 60;
  
  const number = parseInt(timeframe);
  if (timeframe.endsWith('m')) return number;
  if (timeframe.endsWith('h')) return number * 60;
  if (timeframe.endsWith('d')) return number * 60 * 24;
  if (timeframe.endsWith('w')) return number * 60 * 24 * 7;
  return 60; // default to 1h
}

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

// Generate mock analysis data when OpenAI is not available
function generateMockAnalysis(symbol: string, timeframe: string) {
  const isLong = Math.random() > 0.5;
  const entryPrice = 50000 + Math.random() * 10000;
  const stopLoss = isLong ? entryPrice * 0.98 : entryPrice * 1.02;
  const takeProfit = isLong ? entryPrice * 1.05 : entryPrice * 0.95;
  
  return {
    trade_type: isLong ? 'LONG' : 'SHORT',
    entry: Math.round(entryPrice),
    sl: Math.round(stopLoss),
    tp: Math.round(takeProfit),
    confidence_score: Math.floor(Math.random() * 30) + 60, // 60-90
    pattern_description: `${isLong ? 'Bullish' : 'Bearish'} pattern identified on ${symbol}`,
    reasoning_details: `Technical analysis suggests a ${isLong ? 'bullish' : 'bearish'} trend continuation for ${symbol} on the ${timeframe} timeframe.`,
    indicator_data: {
      rsi: Math.floor(Math.random() * 40) + 30,
      macd: isLong ? 0.5 + Math.random() : -0.5 - Math.random(),
      volume: Math.floor(Math.random() * 1000000)
    },
    risk_reward_ratio: isLong ? 
      Math.round(((takeProfit - entryPrice) / (entryPrice - stopLoss)) * 100) / 100 :
      Math.round(((entryPrice - takeProfit) / (stopLoss - entryPrice)) * 100) / 100,
    matching_strategies: []
  };
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
    
    // Call AI to generate analysis or use mock data
    let analysisData;
    
    if (openai) {
      try {
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

        const aiResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: `Analyze ${symbol} on the ${timeframe} timeframe. ${scan_mode === 'deep' ? 'Provide in-depth analysis.' : ''}` }
          ],
          temperature: 0.4,
          response_format: { type: "json_object" }
        });
        
        const analysisText = aiResponse.choices[0]?.message.content || '';
        analysisData = JSON.parse(analysisText);
      } catch (error) {
        console.error('Error with AI analysis:', error);
        // Fall back to mock data
        analysisData = generateMockAnalysis(symbol, timeframe);
      }
    } else {
      // No OpenAI key available, use mock data
      console.log('OpenAI not configured, using mock analysis data');
      analysisData = generateMockAnalysis(symbol, timeframe);
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