import { supabase } from '@/lib/db/supabase-client';
import { OpenAI } from 'openai';
import { runStrategyEvolutionJob } from '../strategy/strategy-evolution';
import { generateLearningPath } from '../academy/generateLearningPath';
import { generateTradingSuggestions } from '../ai/trading-suggestions';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export interface Job {
  id: string;
  type: 'payment_verification' | 'auto_journaling' | 'pnl_insights' | string;
  payload: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  result?: Record<string, any>;
  error?: string;
}

interface JobSchedule {
  jobId: string;
  jobName: string;
  lastRun: Date | null;
  frequency: number; // in hours
  enabled: boolean;
  handler: () => Promise<void>;
}

// Define all background jobs
const JOBS: JobSchedule[] = [
  {
    jobId: 'strategy-evolution',
    jobName: 'Strategy Evolution',
    lastRun: null,
    frequency: 24, // Run once per day
    enabled: true,
    handler: async () => {
      console.log('Running strategy evolution job...');
      await runStrategyEvolutionJob();
    }
  },
  {
    jobId: 'learning-path-generation',
    jobName: 'Learning Path Generation',
    lastRun: null,
    frequency: 48, // Run every 2 days
    enabled: true,
    handler: async () => {
      console.log('Running learning path generation job...');
      const { data: users } = await supabase
        .from('user_profiles')
        .select('user_id, ai_preferences')
        .eq('ai_preferences->learning_path', true);
      
      if (!users) return;
      
      for (const user of users) {
        try {
          await generateLearningPath(user.user_id);
        } catch (error) {
          console.error(`Error generating learning path for user ${user.user_id}:`, error);
        }
      }
    }
  },
  {
    jobId: 'trading-suggestions',
    jobName: 'Trading Suggestions',
    lastRun: null,
    frequency: 72, // Run every 3 days
    enabled: true,
    handler: async () => {
      console.log('Running trading suggestions job...');
      const { data: users } = await supabase
        .from('user_profiles')
        .select('user_id, ai_preferences')
        .eq('ai_preferences->ai_suggestions', true);
      
      if (!users) return;
      
      for (const user of users) {
        try {
          await generateTradingSuggestions(user.user_id);
        } catch (error) {
          console.error(`Error generating trading suggestions for user ${user.user_id}:`, error);
        }
      }
    }
  }
];

/**
 * Check if a job should run now
 */
function shouldRunJob(job: JobSchedule): boolean {
  if (!job.enabled) return false;
  
  if (!job.lastRun) return true;
  
  const now = new Date();
  const hoursSinceLastRun = (now.getTime() - job.lastRun.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceLastRun >= job.frequency;
}

/**
 * Update job's last run time
 */
function updateJobLastRun(jobId: string): void {
  const job = JOBS.find(j => j.jobId === jobId);
  if (job) {
    job.lastRun = new Date();
  }
}

/**
 * Process jobs that are due to run
 */
export async function processJobs(): Promise<void> {
  console.log('Processing background jobs...', new Date().toISOString());
  
  for (const job of JOBS) {
    try {
      if (shouldRunJob(job)) {
        console.log(`Running job: ${job.jobName}`);
        await job.handler();
        updateJobLastRun(job.jobId);
        console.log(`Completed job: ${job.jobName}`);
      }
    } catch (error) {
      console.error(`Error processing job ${job.jobName}:`, error);
    }
  }
}

/**
 * Initialize job processor
 * This function should be called during app startup
 */
export function initJobProcessor(): void {
  // Start processing jobs every hour
  setInterval(processJobs, 60 * 60 * 1000);
  
  // Also run once at startup
  processJobs();
}

// This would run in a serverless function triggered by a CRON job
export async function processJobsOld() {
  // Get pending jobs
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(10);
    
  if (error || !jobs || jobs.length === 0) {
    console.log("No pending jobs to process");
    return;
  }
  
  console.log(`Processing ${jobs.length} jobs...`);
  
  for (const job of jobs) {
    try {
      // Mark job as processing
      await updateJobStatus(job.id, 'processing');
      
      // Process based on job type
      let result: Record<string, any> | undefined;
      
      switch (job.type) {
        case 'payment_verification':
          result = await processPaymentVerification(job.payload);
          break;
        case 'auto_journaling':
          result = await processAutoJournaling(job.payload);
          break;
        case 'pnl_insights':
          result = await processPnLInsights(job.payload);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }
      
      // Mark job as completed
      await updateJobStatus(job.id, 'completed', result);
      
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      await updateJobStatus(job.id, 'failed', undefined, error.message);
    }
  }
}

async function updateJobStatus(
  jobId: string, 
  status: Job['status'], 
  result?: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: string
) {
  interface UpdateData {
    status: Job['status'];
    updated_at: string;
    started_at?: string;
    completed_at?: string;
    result?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    error?: string;
  }
  
  const updateData: UpdateData = {
    status,
    updated_at: new Date().toISOString()
  };
  
  if (status === 'processing') {
    updateData.started_at = new Date().toISOString();
  }
  
  if (status === 'completed' || status === 'failed') {
    updateData.completed_at = new Date().toISOString();
  }
  
  if (result) {
    updateData.result = result;
  }
  
  if (error) {
    updateData.error = error;
  }
  
  await supabase
    .from('jobs')
    .update(updateData)
    .eq('id', jobId);
}

async function processPaymentVerification(payload: unknown) {
  const { tx_id, tx_hash, cryptocurrency } = payload;
  
  console.log(`Verifying ${cryptocurrency} transaction: ${tx_hash}`);
  
  // In a real implementation, this would call blockchain APIs
  // Simulate blockchain API response for demo purposes
  const blockchainResponse = await simulateBlockchainVerification(tx_hash, cryptocurrency);
  
  // Update transaction status in database
  const { error } = await supabase
    .from('wallet_transactions')
    .update({
      status: blockchainResponse.status,
      confirmations: blockchainResponse.confirmations,
      verified_at: new Date().toISOString(),
      verification_details: blockchainResponse
    })
    .eq('id', tx_id);
    
  if (error) {
    throw new Error(`Failed to update transaction status: ${error.message}`);
  }
  
  // If payment confirmed, update subscription status
  if (blockchainResponse.status === 'confirmed') {
    // Get transaction details
    const { data: txData } = await supabase
      .from('wallet_transactions')
      .select('user_id, amount, currency, payment_for')
      .eq('id', tx_id)
      .single();
      
    if (txData?.payment_for === 'subscription') {
      await activateUserSubscription(txData.user_id);
    }
  }
  
  return blockchainResponse;
}

async function simulateBlockchainVerification(txHash: string, cryptocurrency: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses for different cryptocurrencies
  const mockResponses: Record<string, any> = {
    BTC: {
      status: 'confirmed',
      confirmations: 6,
      required_confirmations: 6,
      amount: '0.005 BTC',
      timestamp: new Date().toISOString()
    },
    ETH: {
      status: 'confirmed',
      confirmations: 12,
      required_confirmations: 12,
      amount: '0.1 ETH',
      timestamp: new Date().toISOString()
    },
    USDT_ERC20: {
      status: 'confirmed',
      confirmations: 12,
      required_confirmations: 12,
      amount: '100 USDT',
      timestamp: new Date().toISOString()
    }
  };
  
  return mockResponses[cryptocurrency] || {
    status: 'pending',
    confirmations: 2,
    required_confirmations: 6,
    timestamp: new Date().toISOString()
  };
}

async function processAutoJournaling(payload: unknown) {
  const { trade_id, user_id } = payload;
  
  // Get trade details
  const { data: trade, error } = await supabase
    .from('trades')
    .select('*')
    .eq('id', trade_id)
    .single();
    
  if (error || !trade) {
    throw new Error(`Failed to get trade details: ${error?.message}`);
  }
  
  // Get user's previous journal entries to provide context
  const { data: previousEntries } = await supabase
    .from('journal_entries')
    .select('content, emotions, lessons_learned')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(5);
  
  // Generate journal entry using AI
  const journalEntry = await generateTradeJournalEntry(trade, previousEntries || []);
  
  // Save the generated journal entry
  const { error: saveError } = await supabase
    .from('journal_entries')
    .insert({
      user_id,
      trade_id: trade_id,
      content: journalEntry.content,
      emotions: journalEntry.emotions,
      lessons_learned: journalEntry.lessons_learned,
      auto_generated: true
    });
    
  if (saveError) {
    throw new Error(`Failed to save journal entry: ${saveError.message}`);
  }
  
  return { journalEntry };
}

async function generateTradeJournalEntry(
  trade: any // eslint-disable-line @typescript-eslint/no-explicit-any, // eslint-disable-line @typescript-eslint/no-explicit-any
  previousEntries: any // eslint-disable-line @typescript-eslint/no-explicit-any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const messages = [
    { 
      role: "system", 
      content: "You are an AI trade journal assistant that helps traders reflect on their trades. Generate a thoughtful journal entry for a completed trade." 
    },
    {
      role: "user",
      content: `
Generate a trade journal entry for the following trade:
Symbol: ${trade.symbol}
Type: ${trade.trade_type}
Entry Price: ${trade.entry_price}
Exit Price: ${trade.exit_price || 'N/A'}
P&L: ${trade.pnl || 'Unknown'}
Opened At: ${trade.opened_at}
Closed At: ${trade.closed_at || 'N/A'}
Notes: ${trade.notes || 'None'}

Previous emotions experienced: ${previousEntries.map(e => e.emotions).join(', ')}

Format your response as JSON with the following fields:
- content: The main journal reflection (1-2 paragraphs)
- emotions: A comma-separated list of emotions the trader likely experienced
- lessons_learned: 2-3 bullet points of key lessons
`
    }
  ];
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const parsedResponse = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      content: parsedResponse.content || `Trade journal for ${trade.symbol}`,
      emotions: parsedResponse.emotions || "neutral",
      lessons_learned: parsedResponse.lessons_learned || ["Review this trade further"]
    };
  } catch (error) {
    console.error("Error generating journal entry:", error);
    return {
      content: `Trade completed: ${trade.symbol} ${trade.trade_type} (Auto-generated)`,
      emotions: "neutral",
      lessons_learned: ["System generated entry - please add your own insights"]
    };
  }
}

async function processPnLInsights(payload: unknown) {
  const { user_id } = payload;
  
  // Get user's closed trades from the last 30 days
  const { data: trades, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user_id)
    .eq('status', 'closed')
    .gte('closed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
  if (error) {
    throw new Error(`Failed to get user trades: ${error.message}`);
  }
  
  // Generate PnL insights using AI
  const insights = await generatePnLInsights(trades || []);
  
  // Save insights as a notification
  const { error: saveError } = await supabase
    .from('notifications')
    .insert({
      user_id,
      title: "Your 30-Day Trading Performance Insights",
      message: insights.summary,
      type: 'pnl_insights',
      metadata: {
        detailed_insights: insights.details,
        improvement_areas: insights.improvement_areas,
        strengths: insights.strengths
      }
    });
    
  if (saveError) {
    throw new Error(`Failed to save PnL insights: ${saveError.message}`);
  }
  
  return insights;
}

async function generatePnLInsights(trades: any // eslint-disable-line @typescript-eslint/no-explicit-any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (trades.length === 0) {
    return {
      summary: "No trades found in the last 30 days. Complete some trades to get performance insights.",
      keyMetrics: {},
      suggestions: []
    };
  }
  
  const messages = [
    { 
      role: "system", 
      content: "You are an AI trading coach that analyzes trading performance and provides insightful feedback." 
    },
    {
      role: "user",
      content: `
Analyze these trades from the last 30 days:
${JSON.stringify(trades.slice(0, 20))}

Provide performance insights in JSON format with these fields:
- summary: A brief summary of overall performance (2-3 sentences)
- keyMetrics: Object containing key performance metrics
- suggestions: Array of actionable suggestions for improvement
`
    }
  ];
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.5,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });
    
    const parsedResponse = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      summary: parsedResponse.summary || "Performance analysis for your recent trades.",
      keyMetrics: parsedResponse.keyMetrics || {},
      suggestions: parsedResponse.suggestions || []
    };
  } catch (error) {
    console.error("Error generating PnL insights:", error);
    return {
      summary: "Performance analysis is currently unavailable.",
      keyMetrics: {},
      suggestions: ["Consider reviewing your trades manually"]
    };
  }
}

async function activateUserSubscription(userId: string) {
  const now = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(now.getFullYear() + 1);
  
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      status: 'active',
      plan: 'pro',
      start_date: now.toISOString(),
      end_date: oneYearLater.toISOString(),
      payment_method: 'crypto'
    }, {
      onConflict: 'user_id'
    });
} 