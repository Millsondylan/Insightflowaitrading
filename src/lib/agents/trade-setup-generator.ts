import { OpenAI } from 'openai';
import { supabase } from '@/lib/db/supabase-client';

interface MarketData {
  symbol: string;
  price: number;
  dailyChange: number;
  volume: number;
  indicators: {
    rsi: number;
    macd: {
      line: number;
      signal: number;
      histogram: number;
    };
    movingAverages: {
      ma50: number;
      ma200: number;
    };
  };
}

export interface TradeSetup {
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  confidence: number; // 1-100
  setupType: string;
  reasoning: string;
  timeframe: string;
}

export class TradeSetupGenerator {
  private openai: OpenAI;
  private userPreferences: any // eslint-disable-line @typescript-eslint/no-explicit-any;
  
  constructor(userId: string) {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
    this.loadUserPreferences(userId);
  }
  
  private async loadUserPreferences(userId: string) {
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    this.userPreferences = data || {};
  }
  
  async generateTradeSetups(marketData: MarketData[], maxSetups: number = 3): Promise<TradeSetup[]> {
    // Prepare market data summary for the AI
    const marketSummary = marketData.map(data => ({
      symbol: data.symbol,
      price: data.price,
      dailyChange: `${data.dailyChange.toFixed(2)}%`,
      rsi: data.indicators.rsi,
      macdHistogram: data.indicators.macd.histogram,
      ma50: data.indicators.movingAverages.ma50,
      ma200: data.indicators.movingAverages.ma200,
    }));
    
    const messages = [
      { 
        role: "system", 
        content: `You are an AI trade setup generator for a trading platform. Analyze market data and generate high-probability trade setups.
        
User preferences: ${JSON.stringify(this.userPreferences)}

Provide ${maxSetups} trade setups based on technical analysis of the market data. For each setup:
1. Identify the best direction (long/short)
2. Calculate entry price, stop loss, and take profit levels
3. Provide a confidence score from 1-100
4. Explain the reasoning in one short paragraph
5. Return JSON response only` 
      },
      {
        role: "user",
        content: `Generate trade setups based on the following market data:\n${JSON.stringify(marketSummary, null, 2)}`
      }
    ];
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        temperature: 0.4,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });
      
      try {
        const parsedResponse = JSON.parse(response.choices[0]?.message?.content || "{}");
        return parsedResponse.setups || [];
      } catch (error) {
        console.error("Error parsing AI response:", error);
        return [];
      }
    } catch (error) {
      console.error("Error generating trade setups:", error);
      return [];
    }
  }
  
  async getMarketEventResponse(event: {
    type: string; 
    symbol: string;
    details: Record<string, any>;
  }): Promise<string> {
    const messages = [
      {
        role: "system",
        content: "You are an AI trading assistant that provides brief responses to market events."
      },
      {
        role: "user",
        content: `Provide a brief insight about this market event: ${JSON.stringify(event)}`
      }
    ];
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 150
      });
      
      return response.choices[0]?.message?.content || 
        "A market event has occurred. Please check your trading platform for details.";
    } catch (error) {
      console.error("Error generating market event response:", error);
      return "Unable to analyze market event at this time.";
    }
  }
} 