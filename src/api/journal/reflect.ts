import { AI_PROVIDERS } from '@/lib/config';
import { buildReflectionPrompt, validateAIReflection, AIReflection, AIPromptData } from '@/lib/journal/promptBuilder';

/**
 * AI Provider types
 */
type AIProvider = 'openai' | 'groq' | 'gemini';

/**
 * Configuration for each AI provider
 */
const AI_CONFIGS = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    payload: (prompt: string) => ({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
    extractResponse: (data: any) => data.choices[0]?.message?.content,
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-70b-8192',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    payload: (prompt: string) => ({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
    extractResponse: (data: any) => data.choices[0]?.message?.content,
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
    }),
    payload: (prompt: string) => ({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    }),
    extractResponse: (data: any) => data.candidates[0]?.content?.parts[0]?.text,
  }
};

/**
 * Determines which AI provider to use based on availability
 * @returns Available AI provider or null if none available
 */
function getAvailableProvider(): AIProvider | null {
  if (AI_PROVIDERS.openai) return 'openai';
  if (AI_PROVIDERS.groq) return 'groq';
  if (AI_PROVIDERS.gemini) return 'gemini';
  return null;
}

/**
 * Makes API request to the specified AI provider
 * @param provider AI provider to use
 * @param prompt Formatted prompt string
 * @returns AI response content
 */
async function callAIProvider(provider: AIProvider, prompt: string): Promise<string> {
  const config = AI_CONFIGS[provider];
  const apiKey = AI_PROVIDERS[provider];
  
  if (!apiKey) {
    throw new Error(`API key not found for provider: ${provider}`);
  }
  
  // Build URL with API key for Gemini (uses query param)
  const url = provider === 'gemini' 
    ? `${config.url}?key=${apiKey}`
    : config.url;
  
  const headers = config.headers(apiKey);
  const payload = config.payload(prompt);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const content = config.extractResponse(data);
    
    if (!content) {
      throw new Error('No content received from AI provider');
    }
    
    return content;
  } catch (error) {
    console.error(`Error calling ${provider} API:`, error);
    throw error;
  }
}

/**
 * Generates AI reflection for a journal entry
 * @param promptData Journal entry data for reflection
 * @returns AI reflection analysis
 */
export async function generateReflection(promptData: AIPromptData): Promise<aIReflection> {
  const provider = getAvailableProvider();
  
  if (!provider) {
    throw new Error('No AI provider available. Please configure OpenAI, Groq, or Gemini API keys.');
  }
  
  try {
    // Build the prompt
    const prompt = buildReflectionPrompt(promptData);
    
    // Get AI response
    const aiResponse = await callAIProvider(provider, prompt);
    
    // Validate and parse the response
    const reflection = validateAIReflection(aiResponse);
    
    return reflection;
  } catch (error) {
    console.error('Error generating AI reflection:', error);
    throw new Error('Failed to generate AI reflection. Please try again.');
  }
}

/**
 * Express-style handler for the reflection API endpoint
 * This can be adapted based on your backend framework
 */
export async function handleReflectionRequest(requestData: any): Promise<{ success: boolean; data?: AIReflection; error?: string }> {
  try {
    const { entry, additionalContext } = requestData;
    
    if (!entry) {
      return {
        success: false,
        error: 'Journal entry is required'
      };
    }
    
    const reflection = await generateReflection({
      entry,
      additionalContext
    });
    
    return {
      success: true,
      data: reflection
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to generate reflection'
    };
  }
}

/**
 * Client-side function to call the reflection API
 * @param entry Journal entry to analyze
 * @param additionalContext Optional additional context
 * @returns Promise with AI reflection result
 */
export async function requestReflection(
  entry: any, 
  additionalContext?: string
): Promise<aIReflection> {
  try {
    // For now, call the AI directly from client side
    // In production, you'd want to route this through your backend
    const reflection = await generateReflection({
      entry,
      additionalContext
    });
    
    return reflection;
  } catch (error: any) {
    console.error('Reflection request failed:', error);
    throw new Error(error.message || 'Failed to get AI reflection');
  }
} 