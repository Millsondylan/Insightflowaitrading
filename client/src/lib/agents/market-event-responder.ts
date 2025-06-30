
import { RealtimeChannel } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { supabase } from '@/lib/db/supabase-client';

interface MarketEvent {
  id: string;
  type: 'price-alert' | 'economic-release' | 'volatility-change' | 'news';
  symbol?: string;
  details: Record<string, any>;
  timestamp: string;
}

export class MarketEventResponder {
  private channel: RealtimeChannel | null = null;
  private isActive = false;
  private userId: string;
  private openai: OpenAI;
  
  constructor(userId: string) {
    this.userId = userId;
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
  }
  
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.setupRealtimeListeners();
  }
  
  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.channel?.unsubscribe();
    this.channel = null;
  }
  
  private setupRealtimeListeners() {
    // Listen for market events from the backend
    this.channel = supabase
      .channel('market-events')
      .on('broadcast', { event: 'price-alert' }, (payload) => this.handleMarketEvent({
        ...payload,
        type: 'price-alert'
      }))
      .on('broadcast', { event: 'economic-release' }, (payload) => this.handleMarketEvent({
        ...payload,
        type: 'economic-release'
      }))
      .on('broadcast', { event: 'volatility-change' }, (payload) => this.handleMarketEvent({
        ...payload,
        type: 'volatility-change'
      }))
      .on('broadcast', { event: 'news' }, (payload) => this.handleMarketEvent({
        ...payload,
        type: 'news'
      }))
      .subscribe();
  }
  
  private async handleMarketEvent(payload: any) {
    if (!this.isActive) return;
    
    try {
      const event: MarketEvent = {
        id: payload.id || `event-${Date.now()}`,
        type: payload.type,
        symbol: payload.symbol,
        details: payload.details || {},
        timestamp: payload.timestamp || new Date().toISOString()
      };
      
      // Get user's positions and strategies for this symbol
      const positions = event.symbol ? await this.getUserPositions(event.symbol) : [];
      const strategies = event.symbol ? await this.getUserStrategies(event.symbol) : [];
      
      // Generate AI response
      const aiResponse = await this.generateResponse(event, positions, strategies);
      
      // Create notification with AI response
      await this.createNotification(event, aiResponse);
      
      // Log event processing
      console.log(`Processed market event: ${event.type} for ${event.symbol || 'market'}`);
    } catch (error) {
      console.error('Error handling market event:', error);
    }
  }
  
  private async getUserPositions(symbol: string) {
    const { data } = await supabase
      .from('positions')
      .select('*')
      .eq('user_id', this.userId)
      .eq('symbol', symbol);
      
    return data || [];
  }
  
  private async getUserStrategies(symbol: string) {
    const { data } = await supabase
      .from('strategies')
      .select('*')
      .eq('user_id', this.userId)
      .like('symbols', `%${symbol}%`);
    
    return data || [];
  }
  
  private async generateResponse(
    event: MarketEvent,
    positions: any[],
    strategies: any[]
  ): Promise<string> {
    const messages = [
      { 
        role: "system", 
        content: "You are a market event responder for a trading platform. Generate concise responses to market events." 
      },
      {
        role: "user",
        content: `
Event type: ${event.type}
${event.symbol ? `Symbol: ${event.symbol}` : ''}
Details: ${JSON.stringify(event.details)}
User positions for this symbol: ${positions.length}
User strategies for this symbol: ${strategies.length}

Generate a brief, insightful response to this market event.`
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
        `Market ${event.type} alert for ${event.symbol || 'the market'}. Check your trading platform for details.`;
    } catch (error) {
      console.error('Error generating AI response for market event:', error);
      return `Market ${event.type} alert for ${event.symbol || 'the market'}.`;
    }
  }
  
  private async createNotification(event: MarketEvent, message: string) {
    await supabase.from('notifications').insert({
      user_id: this.userId,
      title: this.getNotificationTitle(event),
      message: message,
      type: `market_${event.type.replace('-', '_')}`,
      metadata: {
        event_id: event.id,
        event_type: event.type,
        symbol: event.symbol,
        timestamp: event.timestamp,
        details: event.details
      },
      read: false,
      created_at: new Date().toISOString()
    });
  }
  
  private getNotificationTitle(event: MarketEvent): string {
    const symbol = event.symbol || 'Market';
    
    switch (event.type) {
      case 'price-alert':
        return `${symbol} Price Alert`;
      case 'economic-release':
        return `Economic Data Release`;
      case 'volatility-change':
        return `${symbol} Volatility Change`;
      case 'news':
        return `${symbol} News Alert`;
      default:
        return `${symbol} Alert`;
    }
  }
}
