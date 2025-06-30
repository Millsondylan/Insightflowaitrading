import { AI_PROVIDERS } from '@/lib/config';
import { generateQuizPrompt, validateQuizResponse, createFallbackQuiz, QuizGenerationParams } from '@/lib/academy/generateQuizPrompt';
import { Quiz } from '@/lib/academy/quizSchema';

/**
 * AI Provider types (reusing from journal reflect API)
 */
type AIProvider = 'openai' | 'groq' | 'gemini';

/**
 * Configuration for each AI provider (same as journal reflect)
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
      max_tokens: 2000,
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
      max_tokens: 2000,
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
        maxOutputTokens: 2000,
      }
    }),
    extractResponse: (data: any) => data.candidates[0]?.content?.parts[0]?.text,
  }
};

/**
 * Determines which AI provider to use based on availability
 */
function getAvailableProvider(): AIProvider | null {
  if (AI_PROVIDERS.openai) return 'openai';
  if (AI_PROVIDERS.groq) return 'groq';
  if (AI_PROVIDERS.gemini) return 'gemini';
  return null;
}

/**
 * Makes API request to the specified AI provider
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
 * Generates a quiz using AI based on lesson content
 */
export async function generateQuiz(params: QuizGenerationParams): Promise<Quiz> {
  const provider = getAvailableProvider();
  
  if (!provider) {
    console.warn('No AI provider available, using fallback quiz');
    return createFallbackQuiz(params.lessonBlocks[0]?.topic || 'Trading');
  }
  
  try {
    // Build the prompt
    const prompt = generateQuizPrompt(params);
    
    // Get AI response
    const aiResponse = await callAIProvider(provider, prompt);
    
    // Validate and parse the response
    const quiz = validateQuizResponse(aiResponse);
    
    return quiz;
  } catch (error) {
    console.error('Error generating AI quiz:', error);
    console.warn('Falling back to default quiz');
    return createFallbackQuiz(params.lessonBlocks[0]?.topic || 'Trading');
  }
}

/**
 * Express-style handler for the quiz generation API endpoint
 */
export async function handleQuizRequest(requestData: any): Promise<{ success: boolean; data?: Quiz; error?: string }> {
  try {
    const { lessonBlocks, questionCount, difficulty, focusAreas } = requestData;
    
    if (!lessonBlocks || !Array.isArray(lessonBlocks) || lessonBlocks.length === 0) {
      return {
        success: false,
        error: 'Lesson blocks are required to generate quiz'
      };
    }
    
    const quiz = await generateQuiz({
      lessonBlocks,
      questionCount,
      difficulty,
      focusAreas
    });
    
    return {
      success: true,
      data: quiz
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to generate quiz'
    };
  }
}

/**
 * Client-side function to request quiz generation
 */
export async function requestQuiz(params: QuizGenerationParams): Promise<Quiz> {
  try {
    // For now, call the AI directly from client side
    // In production, you'd want to route this through your backend
    const quiz = await generateQuiz(params);
    
    return quiz;
  } catch (error: any) {
    console.error('Quiz request failed:', error);
    throw new Error(error.message || 'Failed to generate quiz');
  }
} 