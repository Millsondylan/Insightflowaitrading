const { createClient } = require('@supabase/supabase-js');
const { Configuration, OpenAIApi } = require('openai');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Handler function
exports.handler = async (event, context) => {
  console.log('Starting trade summarization job');
  
  try {
    // 1. Get trades that need summarization (have no tags or summary)
    const { data: trades, error: tradesError } = await supabase
      .from('journal_entries')
      .select(`
        id, 
        user_id, 
        trade_date, 
        symbol, 
        entry_price, 
        exit_price, 
        position_size, 
        profit_loss, 
        trade_duration, 
        notes,
        trade_tags,
        trade_summary
      `)
      .is('trade_tags', null)
      .is('trade_summary', null)
      .limit(10);  // Process batches of 10 trades at a time
    
    if (tradesError) {
      throw new Error(`Error fetching trades: ${tradesError.message}`);
    }
    
    console.log(`Found ${trades.length} trades to summarize`);
    
    if (trades.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No trades to process' })
      };
    }
    
    // Group trades by user for better context
    const tradesByUser = trades.reduce((acc, trade) => {
      if (!acc[trade.user_id]) {
        acc[trade.user_id] = [];
      }
      acc[trade.user_id].push(trade);
      return acc;
    }, {});
    
    // Process each user's trades
    const results = [];
    
    for (const [userId, userTrades] of Object.entries(tradesByUser)) {
      // Get additional context about the user's trading style/preferences
      const { data: user, error: userError } = await supabase
        .from('user_profiles')
        .select('experience_level, trading_style, risk_tolerance, preferred_timeframes')
        .eq('user_id', userId)
        .single();
        
      if (userError && userError.code !== 'PGRST116') { // Not found is okay
        console.warn(`Error fetching user profile for ${userId}: ${userError.message}`);
      }
      
      // Process each trade
      for (const trade of userTrades) {
        try {
          // Generate summary and tags using GPT
          const { summary, tags } = await generateTradeSummary(trade, user);
          
          // Update the trade with AI-generated summary and tags
          const { error: updateError } = await supabase
            .from('journal_entries')
            .update({
              trade_summary: summary,
              trade_tags: tags,
              ai_processed: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', trade.id);
            
          if (updateError) {
            throw new Error(`Error updating trade ${trade.id}: ${updateError.message}`);
          }
          
          results.push({
            tradeId: trade.id,
            symbol: trade.symbol,
            summary: summary,
            tags: tags,
            status: 'success'
          });
          
        } catch (error) {
          console.error(`Error processing trade ${trade.id}:`, error);
          
          results.push({
            tradeId: trade.id,
            symbol: trade.symbol,
            status: 'error',
            error: error.message
          });
        }
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        processed: trades.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length,
        results
      })
    };
    
  } catch (error) {
    console.error('Error summarizing trades:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to summarize trades' })
    };
  }
};

// Generate summary and tags for a trade using AI
async function generateTradeSummary(trade, userProfile = null) {
  // Create a prompt that includes all relevant trade information
  const prompt = `
    Please analyze this trade and provide a concise summary and relevant tags.
    
    Trade Details:
    - Symbol: ${trade.symbol}
    - Date: ${trade.trade_date}
    - Entry Price: ${trade.entry_price}
    - Exit Price: ${trade.exit_price}
    - Position Size: ${trade.position_size}
    - Profit/Loss: ${trade.profit_loss} (${trade.profit_loss > 0 ? 'profit' : 'loss'})
    - Duration: ${trade.trade_duration || 'Not specified'}
    - Trader Notes: ${trade.notes || 'No notes provided'}
    
    ${userProfile ? `
    Trader Profile:
    - Experience Level: ${userProfile.experience_level || 'Not specified'}
    - Trading Style: ${userProfile.trading_style || 'Not specified'}
    - Risk Tolerance: ${userProfile.risk_tolerance || 'Not specified'}
    - Preferred Timeframes: ${userProfile.preferred_timeframes || 'Not specified'}
    ` : ''}
    
    Please provide:
    1. A brief but insightful summary of this trade (2-3 sentences)
    2. A JSON array of relevant trading tags (e.g., ["breakout", "trend-following", "overtraded", "good-risk-reward"])
    
    Format your response as JSON with "summary" and "tags" fields.
  `;
  
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert trading coach and journal assistant. Analyze trades objectively and provide insightful summaries and relevant tags."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }
    
    // Extract the JSON data from the response
    let jsonMatch;
    try {
      // First try parsing the whole response as JSON
      jsonMatch = JSON.parse(content);
    } catch (e) {
      // If that fails, try to extract JSON from the text
      const jsonRegex = /{[\s\S]*}/;
      const match = content.match(jsonRegex);
      
      if (match) {
        jsonMatch = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse JSON from response');
      }
    }
    
    return {
      summary: jsonMatch.summary || 'No summary generated',
      tags: Array.isArray(jsonMatch.tags) ? jsonMatch.tags : []
    };
    
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
} 