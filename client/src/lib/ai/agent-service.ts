import { supabase } from '@/lib/db/supabase-client';
import { OpenAI } from 'openai';
import { Groq } from '@/lib/ai/groq-client';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Agent types
export type AgentType = 'onboarding' | 'strategy' | 'market' | 'journal' | 'alert';

// Suggestion format
export interface AgentSuggestion {
  title: string;
  description: string;
  action?: {
    type: 'navigate' | 'execute' | 'apply' | 'dismiss';
    data: unknown;
  };
}

// Initialize AI clients
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// AI Model providers
export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'groq';

// Define agent prompts by type
const agentPrompts: Record<AgentType, string> = {
  onboarding: `You are an onboarding assistant for InsightFlow AI Trading platform. 
    Based on the user's profile and platform usage, suggest relevant features 
    to try and steps to take to get the most value from the platform. 
    Consider their experience level and interests.`,
  
  strategy: `You are a trading strategy assistant. Based on the user's preferences,
    past strategies, and current market conditions, suggest viable trading strategies.
    Include specific indicator settings, entry/exit rules, and risk parameters that match
    their trading style and risk tolerance.`,
  
  market: `You are a real-time market analysis assistant. Based on current market data,
    news events, and technical patterns, provide insights about market conditions.
    Highlight potential opportunities or risks, and explain why they matter to the user's
    portfolios and strategies.`,
  
  journal: `You are a trading journal assistant. Analyze the user's recent trades and
    overall performance patterns. Provide objective feedback on strengths and weaknesses,
    suggest improvements, and help them identify recurring patterns in their trading.`,
  
  alert: `You are a market alert assistant. Based on current market conditions, saved
    alerts, and user preferences, determine if any situations require immediate attention.
    Be specific about why this alert matters to the user and what action they might consider.`
};

class AIAgentService {
  /**
   * Create a new agent session with context
   */
  async createAgent(
    userId: string, 
    agentType: AgentType, 
    context: Record<string, any>, 
    triggeredBy?: string
  ): Promise<string> {
    try {
      // Insert agent record
      const { data, error } = await supabase
        .from('ai_agents')
        .insert({
          user_id: userId,
          agent_type: agentType,
          context,
          triggered_by: triggeredBy,
          created_by: userId,
          status: 'pending'
        })
        .select('id')
        .single();

      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  /**
   * Process an agent's task and generate suggestions
   */
  async processAgent(
    agentId: string, 
    modelProvider: ModelProvider = 'openai'
  ): Promise<AgentSuggestion[]> {
    try {
      // Mark agent as processing
      await supabase
        .from('ai_agents')
        .update({ status: 'processing' })
        .eq('id', agentId);

      // Get agent data
      const { data: agent, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error || !agent) {
        throw new Error(`Agent not found: ${error?.message}`);
      }

      // Format prompt based on agent type and context
      const prompt = `${agentPrompts[agent.agent_type as AgentType]}
        
        USER CONTEXT:
        ${JSON.stringify(agent.context, null, 2)}
        
        Generate 3-5 specific, actionable suggestions in JSON format. Each suggestion should have:
        - A brief, specific title
        - A detailed description with reasoning
        - An action object with type and relevant data
        
        Response format:
        [
          {
            "title": "Clear suggestion title",
            "description": "Detailed explanation with context and reasoning",
            "action": {
              "type": "navigate|execute|apply|dismiss",
              "data": {}
            }
          }
        ]`;

      // Generate suggestions using selected AI provider
      let suggestions: AgentSuggestion[] = [];
      
      try {
        suggestions = await this.generateSuggestions(prompt, modelProvider);
      } catch (aiError) {
        console.error(`Error with ${modelProvider}, falling back to OpenAI:`, aiError);
        suggestions = await this.generateSuggestions(prompt, 'openai');
      }

      // Update agent with suggestions
      await supabase
        .from('ai_agents')
        .update({
          suggestions,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', agentId);

      return suggestions;
    } catch (error) {
      console.error('Error processing agent:', error);
      
      // Update agent with error
      await supabase
        .from('ai_agents')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', agentId);
      
      throw error;
    }
  }

  /**
   * Generate suggestions using different AI providers
   */
  private async generateSuggestions(
    prompt: string, 
    provider: ModelProvider
  ): Promise<AgentSuggestion[]> {
    switch (provider) {
      case 'openai':
        return this.generateWithOpenAI(prompt);
      case 'anthropic':
        return this.generateWithAnthropic(prompt);
      case 'google':
        return this.generateWithGemini(prompt);
      case 'groq':
        return this.generateWithGroq(prompt);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Generate suggestions with OpenAI
   */
  private async generateWithOpenAI(prompt: string): Promise<AgentSuggestion[]> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are an AI trading assistant generating actionable suggestions.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message.content;
    if (!content) throw new Error('Empty response from OpenAI');
    
    try {
      const parsedContent = JSON.parse(content);
      return Array.isArray(parsedContent) ? parsedContent : parsedContent.suggestions || [];
    } catch (e) {
      console.error('Error parsing OpenAI response:', e, content);
      throw new Error('Invalid JSON response from OpenAI');
    }
  }

  /**
   * Generate suggestions with Anthropic/Claude
   */
  private async generateWithAnthropic(prompt: string): Promise<AgentSuggestion[]> {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      system: 'You are an AI trading assistant generating actionable suggestions in JSON format.'
    });

    const content = response.content[0]?.text;
    if (!content) throw new Error('Empty response from Anthropic');
    
    try {
      // Extract JSON from potential markdown or text
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        [null, content];
                        
      const jsonContent = jsonMatch[1] || content;
      const parsed = JSON.parse(jsonContent.trim());
      return Array.isArray(parsed) ? parsed : parsed.suggestions || [];
    } catch (e) {
      console.error('Error parsing Anthropic response:', e, content);
      throw new Error('Invalid JSON response from Anthropic');
    }
  }

  /**
   * Generate suggestions with Google Gemini
   */
  private async generateWithGemini(prompt: string): Promise<AgentSuggestion[]> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });

    const content = response.response.text();
    if (!content) throw new Error('Empty response from Gemini');
    
    try {
      // Extract JSON from potential markdown or text
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        [null, content];
                        
      const jsonContent = jsonMatch[1] || content;
      const parsed = JSON.parse(jsonContent.trim());
      return Array.isArray(parsed) ? parsed : parsed.suggestions || [];
    } catch (e) {
      console.error('Error parsing Gemini response:', e, content);
      throw new Error('Invalid JSON response from Gemini');
    }
  }

  /**
   * Generate suggestions with Groq
   */
  private async generateWithGroq(prompt: string): Promise<AgentSuggestion[]> {
    const client = new Groq();
    
    const response = await client.completion({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are an AI trading assistant generating actionable suggestions in JSON format.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message.content;
    if (!content) throw new Error('Empty response from Groq');
    
    try {
      // Extract JSON from potential markdown or text
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        [null, content];
                        
      const jsonContent = jsonMatch[1] || content;
      const parsed = JSON.parse(jsonContent.trim());
      return Array.isArray(parsed) ? parsed : parsed.suggestions || [];
    } catch (e) {
      console.error('Error parsing Groq response:', e, content);
      throw new Error('Invalid JSON response from Groq');
    }
  }

  /**
   * Get agent by ID
   */
  async getAgentById(agentId: string) {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get recent agents for a user
   */
  async getRecentAgents(userId: string, agentType?: AgentType, limit = 5) {
    let query = supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (agentType) {
      query = query.eq('agent_type', agentType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

export const agentService = new AIAgentService();

export default agentService; 