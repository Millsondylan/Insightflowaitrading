import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { updateCoachSessionTranscript } from '../../lib/db/ai-coaching';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Check for required data
    const { sessionId, message, marketContext, strategyId } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Create a Supabase client with the user's token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabaseClient = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Get the authenticated user
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Verify the coaching session belongs to this user
    const { data: sessionData } = await supabaseClient
      .from('coach_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userData.user.id)
      .single();
    
    if (!sessionData) {
      return res.status(403).json({ error: 'Session not found or not owned by user' });
    }
    
    // Get user profile for personalized coaching
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();
    
    // Get strategy details if a strategy ID was provided
    let strategyDetails = null;
    if (strategyId) {
      const { data: strategy } = await supabaseClient
        .from('strategies')
        .select('*')
        .eq('id', strategyId)
        .single();
      
      if (strategy) {
        strategyDetails = strategy;
      }
    }
    
    // Get previous conversation to maintain context
    const { data: previousSession } = await supabaseClient
      .from('coach_sessions')
      .select('transcript')
      .eq('id', sessionId)
      .single();
    
    const previousMessages: ChatMessage[] = previousSession?.transcript || [];
    
    // Build the system prompt
    const systemPrompt = `
You are a professional trading coach assisting a trader with the following profile:
- Experience Level: ${profile?.experience_level || 'Intermediate'}
- Trading Style: ${profile?.trading_style || 'Not specified'}
- Preferred Markets: ${profile?.preferred_markets?.join(', ') || 'Not specified'}
- Preferred Timeframes: ${profile?.preferred_timeframes?.join(', ') || 'Not specified'}
- Risk Tolerance: ${profile?.risk_tolerance || 'Medium'}

${marketContext ? `
Current Market Context:
- Symbol: ${marketContext.symbol}
- Timeframe: ${marketContext.timeframe}
- Current Price: ${marketContext.price || 'Not provided'}
` : ''}

${strategyDetails ? `
The trader is using this strategy:
${JSON.stringify(strategyDetails, null, 2)}
` : ''}

Respond as a knowledgeable but conversational trading coach. Focus on helping the trader make better decisions, manage risk, and improve their trading psychology. Keep responses concise, practical and actionable.
`;

    // Build messages for GPT
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];
    
    // Add previous conversation for context
    previousMessages.forEach((msg: ChatMessage) => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });
    
    // Add the current message
    messages.push({
      role: 'user',
      content: message
    });
    
    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('OpenAI API error:', error);
      return res.status(500).json({ error: 'Failed to generate coaching response' });
    }
    
    const openaiData = await openaiResponse.json();
    const responseContent = openaiData.choices[0].message.content;
    
    // Return the response
    res.status(200).json({ response: responseContent });
  } catch (error) {
    console.error('Coaching API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 