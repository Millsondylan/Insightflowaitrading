// Strategy Summary Bot
// This function runs on a schedule to analyze user strategies and provide summaries

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler = async (event, context) => {
  try {
    // Check if this is a scheduled event or manual trigger
    const isScheduled = event.body === null || event.httpMethod === undefined;
    
    // If API request (not scheduled), validate token
    if (!isScheduled) {
      // For manual triggers, we should have an auth token
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

    // Get active users who have strategies in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email');
      
    if (usersError) throw usersError;
    
    // Process each user (limit processing to avoid timeouts)
    const processPromises = users.slice(0, 10).map(async (user) => {
      try {
        await processUserStrategies(user.id, user.email);
      } catch (err) {
        console.error(`Error processing user ${user.id}:`, err);
      }
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Strategy summaries generated successfully',
        processed: processPromises.length
      })
    };
    
  } catch (error) {
    console.error('Error in strategy summary function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate strategy summaries' })
    };
  }
};

async function processUserStrategies(userId, userEmail) {
  // Get user's top strategies
  const { data: strategies, error: strategiesError } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (strategiesError) throw strategiesError;
  if (!strategies || strategies.length === 0) return; // Skip if no strategies
  
  // Format strategies for GPT analysis
  const formattedStrategies = strategies.map((strategy, index) => {
    return `Strategy ${index + 1}: ${strategy.name}
Description: ${strategy.description || 'No description provided'}
Rules: ${JSON.stringify(strategy.rules || {})}
Performance: ${strategy.performance ? `Win rate: ${strategy.performance.win_rate}%, Profit Factor: ${strategy.performance.profit_factor}` : 'No performance data'}
Created: ${new Date(strategy.created_at).toLocaleDateString()}
`;
  }).join('\n\n');
  
  // Generate GPT summary
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { 
        role: "system", 
        content: "You are an expert trading assistant analyzing a trader's strategies. Provide an insightful summary of their trading approach based on their strategies, highlighting strengths, potential improvements, and common patterns." 
      },
      { 
        role: "user", 
        content: `Here are the top strategies for a trader:\n\n${formattedStrategies}\n\nProvide a concise summary of their trading approach, strengths, and one suggested improvement. Keep your summary under 300 words.`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  const summary = completion.choices[0].message.content;
  
  // Store the summary in the database
  const { error: insertError } = await supabase
    .from('ai_notifications')
    .insert([
      {
        user_id: userId,
        type: 'strategy_summary',
        title: 'Your Trading Strategy Analysis',
        content: summary,
        created_at: new Date().toISOString(),
        read: false,
        data: { 
          strategy_count: strategies.length,
          analyzed_strategies: strategies.map(s => s.id)
        }
      }
    ]);
    
  if (insertError) throw insertError;
  
  // Send email (in production, you would use a proper email service)
  console.log(`[EMAIL] To: ${userEmail}, Subject: Your Weekly Strategy Analysis, Body: ${summary}`);
  
  return summary;
} 