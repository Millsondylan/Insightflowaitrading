import { supabase } from '@/integrations/supabase/client';
import { config } from '../config';
import { nanoid } from 'nanoid';

export interface PineScriptGenerateOptions {
  prompt: string;
  userId: string;
  scriptType: 'strategy' | 'indicator' | 'library';
  timeframe?: string;
  isPremium?: boolean;
  additionalContext?: string;
}

export interface PineScriptResult {
  id: string;
  code: string;
  requestId: string;
  syntaxValid: boolean;
  hasErrors: boolean;
  errorDetails?: {
    line?: number;
    message?: string;
    suggestion?: string;
  };
}

export interface PineScriptQuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  isLimited: boolean;
  resetDate?: Date;
}

/**
 * Checks if a user has available quota for generating Pine Scripts
 */
export async function checkPineScriptQuota(userId: string): Promise<pineScriptQuotaInfo> {
  // Get the user's profile to check if they are limited
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error checking Pine Script quota:', profileError);
    throw new Error('Failed to check Pine Script quota');
  }

  // Check if the limit_pinescript field exists, if not assume the user is limited
  const isLimited = profile.limit_pinescript === undefined ? true : profile.limit_pinescript;
  
  // If the user doesn't have limits (premium user), return unlimited quota
  if (!isLimited) {
    return {
      used: profile.pinescript_monthly_requests || 0,
      limit: Infinity,
      remaining: Infinity,
      isLimited: false
    };
  }

  // For limited users, check their quota
  const freeUserMonthlyLimit = config.limits.freeUserPineScriptLimit || 1;
  const used = profile.pinescript_monthly_requests || 0;
  const remaining = Math.max(0, freeUserMonthlyLimit - used);

  // Calculate reset date (first day of next month)
  const resetDate = new Date();
  resetDate.setMonth(resetDate.getMonth() + 1);
  resetDate.setDate(1);
  resetDate.setHours(0, 0, 0, 0);

  return {
    used,
    limit: freeUserMonthlyLimit,
    remaining,
    isLimited: true,
    resetDate
  };
}

/**
 * Generates Pine Script code from a natural language prompt
 */
export async function generatePineScript(options: PineScriptGenerateOptions): Promise<pineScriptResult> {
  const startTime = Date.now();
  
  // Check quota first
  const quota = await checkPineScriptQuota(options.userId);
  
  if (quota.isLimited && quota.remaining <= 0) {
    throw new Error('Monthly Pine Script generation limit reached. Please upgrade to continue.');
  }
  
  try {
    // Create request record
    const { data: request, error: requestError } = await supabase
      .from('pinescript_requests')
      .insert({
        user_id: options.userId,
        prompt: options.prompt,
        is_premium: options.isPremium || false,
        script_type: options.scriptType,
        metadata: {
          timeframe: options.timeframe || '1D',
          additionalContext: options.additionalContext || ''
        }
      })
      .select('id')
      .single();
    
    if (requestError) {
      throw new Error(`Failed to record Pine Script request: ${requestError.message}`);
    }
    
    // Use OpenAI API to generate Pine Script
    const model = options.isPremium ? 'gpt-4' : 'gpt-3.5-turbo';
    
    // Construct the prompt for GPT
    const systemPrompt = createPineScriptSystemPrompt(options.scriptType);
    const userPrompt = createPineScriptUserPrompt(options);
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.aiProviders.openai}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const aiResponse = await response.json();
    const generatedCode = aiResponse.choices[0].message.content.trim();
    
    // Validate the syntax (basic validation)
    const { isValid, errors } = validatePineScriptSyntax(generatedCode);
    
    // Store the generated code
    const { data: output, error: outputError } = await supabase
      .from('pinescript_outputs')
      .insert({
        request_id: request.id,
        user_id: options.userId,
        code: generatedCode,
        syntax_valid: isValid,
        has_errors: errors.length > 0,
        error_details: errors.length > 0 ? { errors } : null
      })
      .select('id')
      .single();
    
    if (outputError) {
      throw new Error(`Failed to store Pine Script output: ${outputError.message}`);
    }
    
    // Update request status and processing time
    await supabase
      .from('pinescript_requests')
      .update({
        status: 'completed',
        processing_time_ms: Date.now() - startTime
      })
      .eq('id', request.id);
    
    return {
      id: output.id,
      code: generatedCode,
      requestId: request.id,
      syntaxValid: isValid,
      hasErrors: errors.length > 0,
      errorDetails: errors.length > 0 ? errors[0] : undefined
    };
    
  } catch (error) {
    // Handle errors
    console.error('Pine Script generation error:', error);
    
    // Update request status to 'error'
    if (error.requestId) {
      await supabase
        .from('pinescript_requests')
        .update({
          status: 'error',
          processing_time_ms: Date.now() - startTime
        })
        .eq('id', error.requestId);
    }
    
    throw error;
  }
}

/**
 * Generates the system prompt for GPT to create Pine Script
 */
function createPineScriptSystemPrompt(scriptType: string): string {
  return `You are a Pine Script expert that creates high-quality, production-ready ${scriptType} code for TradingView. 
Your task is to generate Pine Script v5 code based on user requirements.

Guidelines:
1. Always use Pine Script version 5 syntax
2. Include proper error handling and parameter validation
3. Write clean, optimized, and well-commented code
4. For strategies, include risk management parameters
5. For indicators, ensure proper visualization settings
6. For libraries, create reusable, well-documented functions
7. Always follow TradingView's best practices and coding standards
8. All code must be complete, well-tested, and ready to be pasted directly into TradingView

Format your response as valid Pine Script code only, without any additional explanation text or markdown formatting.`;
}

/**
 * Generates the user prompt for GPT to create Pine Script
 */
function createPineScriptUserPrompt(options: PineScriptGenerateOptions): string {
  let prompt = `Create a Pine Script v5 ${options.scriptType} that does the following:\n\n${options.prompt}\n\n`;
  
  if (options.timeframe) {
    prompt += `The script should work on ${options.timeframe} timeframe by default.\n`;
  }
  
  if (options.additionalContext) {
    prompt += `Additional context: ${options.additionalContext}\n`;
  }
  
  return prompt;
}

/**
 * Basic validation for Pine Script syntax
 */
function validatePineScriptSyntax(code: string): { isValid: boolean; errors: any[] } {
  // This is a simple validation - in a real implementation, you'd want a more
  // comprehensive parser or to use TradingView's API if available
  const errors = [];
  
  // Check for common syntax issues
  if (!code.includes('//@version=5')) {
    errors.push({
      line: 1,
      message: 'Missing version declaration',
      suggestion: 'Add //@version=5 at the top of the script'
    });
  }
  
  // Check for missing semicolons at the end of statements
  // (This is a very basic check and would need to be improved in a real implementation)
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('//') && 
        !trimmedLine.endsWith(')') && 
        !trimmedLine.endsWith('}') && 
        !trimmedLine.endsWith('{') && 
        !trimmedLine.endsWith('=>') && 
        !trimmedLine.endsWith(',') && 
        !trimmedLine.endsWith('/') && 
        !trimmedLine.endsWith('*/') && 
        !trimmedLine.match(/^\s*[a-zA-Z0-9_]+:/) &&
        !trimmedLine.endsWith(':') && 
        !trimmedLine.endsWith('=')) {
      if (!trimmedLine.endsWith('→')) {
        errors.push({
          line: index + 1,
          message: 'Possible missing operator or delimiter',
          suggestion: 'Check this line for syntax errors'
        });
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Fixes common Pine Script errors using AI
 */
export async function fixPineScriptErrors(pineScriptId: string, userId: string): Promise<pineScriptResult> {
  // Get the original script
  const { data: original, error: originalError } = await supabase
    .from('pinescript_outputs')
    .select('*, pinescript_requests(prompt, script_type)')
    .eq('id', pineScriptId)
    .eq('user_id', userId)
    .single();
  
  if (originalError || !original) {
    throw new Error('Pine Script not found or you do not have access');
  }
  
  try {
    // Use OpenAI to fix errors
    const systemPrompt = `You are a Pine Script expert. You need to fix errors in the provided Pine Script code.`;
    const userPrompt = `Fix the following Pine Script errors in this code. Only return the complete, fixed code without any explanations:
    
Error details: ${JSON.stringify(original.error_details)}

Original code:
${original.code}`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.aiProviders.openai}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const aiResponse = await response.json();
    const fixedCode = aiResponse.choices[0].message.content.trim();
    
    // Validate the fixed code
    const { isValid, errors } = validatePineScriptSyntax(fixedCode);
    
    // Store the fixed code as a new version
    const { data: output, error: outputError } = await supabase
      .from('pinescript_outputs')
      .insert({
        request_id: original.request_id,
        user_id: userId,
        code: fixedCode,
        version: original.version + 1,
        syntax_valid: isValid,
        has_errors: errors.length > 0,
        error_details: errors.length > 0 ? { errors } : null
      })
      .select('id')
      .single();
    
    if (outputError) {
      throw new Error(`Failed to store fixed Pine Script: ${outputError.message}`);
    }
    
    return {
      id: output.id,
      code: fixedCode,
      requestId: original.request_id,
      syntaxValid: isValid,
      hasErrors: errors.length > 0,
      errorDetails: errors.length > 0 ? errors[0] : undefined
    };
  } catch (error) {
    console.error('Pine Script fix error:', error);
    throw error;
  }
}

/**
 * Creates a shareable link for a Pine Script
 */
export async function createPineScriptShare(pineScriptId: string, userId: string, isPublic: boolean = false, expiresInDays?: number): Promise<string> {
  // Check if user owns this script
  const { data: script, error: scriptError } = await supabase
    .from('pinescript_outputs')
    .select('id')
    .eq('id', pineScriptId)
    .eq('user_id', userId)
    .single();
  
  if (scriptError || !script) {
    throw new Error('Pine Script not found or you do not have access');
  }
  
  // Create a share token
  const shareToken = nanoid(12);
  
  // Calculate expiration date if needed
  let expiresAt = null;
  if (expiresInDays) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  }
  
  // Store the share record
  const { data: share, error: shareError } = await supabase
    .from('pinescript_shares')
    .insert({
      pinescript_id: pineScriptId,
      user_id: userId,
      share_token: shareToken,
      is_public: isPublic,
      expires_at: expiresAt ? expiresAt.toISOString() : null
    })
    .select('share_token')
    .single();
  
  if (shareError) {
    throw new Error(`Failed to create share: ${shareError.message}`);
  }
  
  return share.share_token;
}

/**
 * Gets a shared Pine Script by token
 */
export async function getPineScriptByShareToken(shareToken: string): Promise<any> {
  // Get the share record and associated script
  const { data: share, error: shareError } = await supabase
    .from('pinescript_shares')
    .select('*, pinescript_outputs(*)')
    .eq('share_token', shareToken)
    .single();
  
  if (shareError || !share) {
    throw new Error('Shared script not found');
  }
  
  // Check if share has expired
  if (share.expires_at && new Date(share.expires_at) < new Date()) {
    throw new Error('This shared script has expired');
  }
  
  // Increment view count
  await supabase
    .from('pinescript_shares')
    .update({ views_count: (share.views_count || 0) + 1 })
    .eq('id', share.id);
  
  return share.pinescript_outputs;
}

/**
 * Get all Pine Scripts for a user
 */
export async function getUserPineScripts(userId: string): Promise<any[]> {
  const { data: scripts, error } = await supabase
    .from('pinescript_outputs')
    .select(`
      *,
      pinescript_requests(
        prompt,
        script_type,
        created_at,
        is_premium
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to fetch user's Pine Scripts: ${error.message}`);
  }
  
  return scripts;
}

/**
 * Converts a Vault strategy to Pine Script
 */
export async function convertStrategyToPineScript(strategyId: string, userId: string): Promise<pineScriptResult> {
  // Fetch the strategy
  const { data: strategy, error: strategyError } = await supabase
    .from('trading_strategies')
    .select('*')
    .eq('id', strategyId)
    .eq('user_id', userId)
    .single();
  
  if (strategyError || !strategy) {
    throw new Error('Strategy not found or you do not have access');
  }
  
  // Create a prompt based on the strategy
  const prompt = `Convert this strategy to Pine Script:
  
Strategy Name: ${strategy.name}
Description: ${strategy.description || 'N/A'}
  
Code:
${strategy.code}`;
  
  // Generate the Pine Script using the same generator function
  return generatePineScript({
    prompt,
    userId,
    scriptType: 'strategy',
    additionalContext: `This is a conversion from a stored strategy (ID: ${strategy.id})`
  });
} 