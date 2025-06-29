import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { createStrategyVersion } from '../../lib/db/ai-coaching';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if method is POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate the user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create a Supabase client with the user's token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabaseClient = createClient(
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
    
    const authenticatedUserId = userData.user.id;

    // Check for required params
    const { prompt, strategyId, userId } = req.body;
    
    if (!prompt || !strategyId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Verify the user is authorized to modify this strategy
    if (authenticatedUserId !== userId) {
      return res.status(403).json({ error: 'Forbidden - you can only modify your own strategies' });
    }

    // Call OpenAI API to generate improved strategy
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading strategy optimizer that improves underperforming trading strategies. You analyze trade history and performance metrics to suggest improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('OpenAI API error:', error);
      return res.status(500).json({ error: 'Failed to generate strategy' });
    }

    const openaiData = await openaiResponse.json();
    const improvedStrategy = openaiData.choices[0].message.content;

    // Return the improved strategy
    res.status(200).json({ improvedStrategy });
  } catch (error) {
    console.error('Error in improve-strategy API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 