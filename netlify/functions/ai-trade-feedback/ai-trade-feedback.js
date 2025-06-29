// Trade Feedback Bot
// This function runs on a schedule to analyze user's worst trades and provide feedback

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

    // Get users who have trades
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email');
      
    if (usersError) throw usersError;
    
    // Process each user (limit processing to avoid timeouts)
    const processPromises = users.slice(0, 10).map(async (user) => {
      try {
        await processUserTrades(user.id, user.email);
      } catch (err) {
        console.error(`Error processing user ${user.id}:`, err);
      }
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Trade feedback generated successfully',
        processed: processPromises.length
      })
    };
    
  } catch (error) {
    console.error('Error in trade feedback function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate trade feedback' })
    };
  }
};

async function processUserTrades(userId, userEmail) {
  // Get user's worst trades in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: trades, error: tradesError } = await supabase
    .from('trades')
    .select('*, journal_entries(*)') // Include related journal entries
    .eq('user_id', userId)
    .gt('created_at', thirtyDaysAgo.toISOString())
    .order('profit_loss', { ascending: true }) // Get worst trades first
    .limit(3);
    
  if (tradesError) throw tradesError;
  if (!trades || trades.length === 0) return; // Skip if no trades
  
  // Format trades for GPT analysis
  const formattedTrades = trades.map((trade, index) => {
    const journal = trade.journal_entries?.[0] || {};
    
    return `Trade ${index + 1}: ${trade.symbol}
Direction: ${trade.direction}
Entry Price: ${trade.entry_price}
Exit Price: ${trade.exit_price}
Profit/Loss: ${trade.profit_loss} ${trade.currency || 'USD'} (${trade.profit_loss_percent}%)
Time in Market: ${calculateTimeInMarket(trade.entry_time, trade.exit_time)}
Trade Date: ${new Date(trade.entry_time).toLocaleDateString()}
Market Conditions: ${journal.market_conditions || 'Not recorded'}
Reason for Entry: ${journal.entry_reason || 'Not recorded'}
Trader Notes: ${journal.notes || 'No notes provided'}
Emotional State: ${journal.emotional_state || 'Not recorded'}
`;
  }).join('\n\n');
  
  // Generate GPT feedback
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { 
        role: "system", 
        content: "You are an expert trading coach providing constructive feedback on a trader's unsuccessful trades. Be supportive but honest, focusing on specific improvements they could make. Your goal is to help them learn from these trades, not discourage them." 
      },
      { 
        role: "user", 
        content: `Here are details of some losing trades for a trader:\n\n${formattedTrades}\n\nProvide constructive feedback on what went wrong and 3 specific, actionable tips for improvement. Be supportive but direct. Keep your feedback under 300 words.`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  const feedback = completion.choices[0].message.content;
  
  // Store the feedback in the database
  const { error: insertError } = await supabase
    .from('ai_notifications')
    .insert([
      {
        user_id: userId,
        type: 'trade_feedback',
        title: 'Trading Performance Insights',
        content: feedback,
        created_at: new Date().toISOString(),
        read: false,
        data: { 
          trade_count: trades.length,
          analyzed_trades: trades.map(t => t.id)
        }
      }
    ]);
    
  if (insertError) throw insertError;
  
  // Send email notification (would use a proper email service in production)
  console.log(`[EMAIL] To: ${userEmail}, Subject: Your Trading Performance Insights, Body: ${feedback}`);
  
  return feedback;
}

function calculateTimeInMarket(entryTime, exitTime) {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const diffMs = exit - entry;
  
  // Convert to hours and minutes
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
} 