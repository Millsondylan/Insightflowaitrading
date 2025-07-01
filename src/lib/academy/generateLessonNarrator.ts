import { supabase } from '@/integrations/supabase/client';

// Types
export interface NarratorOptions {
  voice: 'friendly' | 'professional' | 'enthusiastic' | 'calm';
  pace: 'slow' | 'medium' | 'fast';
  style: 'conversational' | 'educational' | 'coaching';
  personalityTraits: string[];
  adaptToUser: boolean;
  useMemory: boolean;
}

export interface NarratorContext {
  lessonSection: string;
  lessonTitle: string;
  difficulty: string;
  topics: string[];
  userProgress?: {
    previousSections: string[];
    completedLessons: string[];
    learningStrengths: string[];
    learningWeaknesses: string[];
    studyTime: number; // in minutes
  };
  userInterests?: string[];
}

/**
 * Generates personalized narrator commentary for a lesson section
 * This is the main function for creating AI-powered lesson narration
 */
export async function generateLessonNarration(
  userId: string,
  courseId: string,
  sectionContent: string,
  context: NarratorContext,
  options: Partial<NarratorOptions> = {}
): Promise<string> {
  // Default narrator options
  const narrationOptions: NarratorOptions = {
    voice: options.voice || 'friendly',
    pace: options.pace || 'medium',
    style: options.style || 'educational',
    personalityTraits: options.personalityTraits || ['helpful', 'encouraging', 'clear'],
    adaptToUser: options.adaptToUser !== undefined ? options.adaptToUser : true,
    useMemory: options.useMemory !== undefined ? options.useMemory : true,
  };

  // Get user's preferred narrator style from settings if adaptToUser is enabled
  if (narrationOptions.adaptToUser) {
    const userPreferences = await getUserNarratorPreferences(userId);
    if (userPreferences) {
      narrationOptions.voice = userPreferences.voice || narrationOptions.voice;
      narrationOptions.style = userPreferences.style || narrationOptions.style;
      // Keep other options as they might be lesson-specific
    }
  }

  try {
    // Generate the narration using AI
    const narration = await generateNarrationWithAI(sectionContent, context, narrationOptions);
    
    // Store the narration for future reference and analytics
    await storeNarrationInDatabase(userId, courseId, context.lessonSection, narration, narrationOptions);
    
    return narration;
  } catch (error) {
    console.error('Error generating lesson narration:', error);
    // Return a fallback narration if AI generation fails
    return generateFallbackNarration(context);
  }
}

/**
 * Gets user's narrator preferences from their settings
 */
async function getUserNarratorPreferences(userId: string): Promise<{
  voice?: 'friendly' | 'professional' | 'enthusiastic' | 'calm';
  style?: 'conversational' | 'educational' | 'coaching';
} | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('narrator_preferences')
      .eq('user_id', userId)
      .single();

    if (error || !data?.narrator_preferences) return null;
    
    return data.narrator_preferences as {
      voice?: 'friendly' | 'professional' | 'enthusiastic' | 'calm';
      style?: 'conversational' | 'educational' | 'coaching';
    };
  } catch (error) {
    console.error('Error fetching user narrator preferences:', error);
    return null;
  }
}

/**
 * Stores the generated narration in the database for analytics and reuse
 */
async function storeNarrationInDatabase(
  userId: string,
  courseId: string,
  lessonSection: string,
  narration: string,
  options: NarratorOptions
): Promise<void> {
  try {
    await supabase
      .from('lesson_commentary')
      .insert({
        user_id: userId,
        course_id: courseId,
        lesson_section: lessonSection,
        narrator_style: options.voice,
        generated_commentary: narration,
        user_context: {
          adaptToUser: options.adaptToUser,
          useMemory: options.useMemory,
          style: options.style,
          pace: options.pace,
          personalityTraits: options.personalityTraits
        }
      });
  } catch (error) {
    console.error('Error storing narration in database:', error);
  }
}

/**
 * Generates narration using AI based on content and context
 * This would integrate with an LLM like GPT-4/Claude
 */
async function generateNarrationWithAI(
  content: string,
  context: NarratorContext,
  options: NarratorOptions
): Promise<string> {
  // This is where you'd make a call to an AI service like OpenAI or Claude
  // For now, we'll use a simulated response
  const prompt = buildNarratorPrompt(content, context, options);
  
  // In a real implementation, this would call your AI service
  // const response = await openai.createCompletion({ model: "gpt-4", prompt });
  // return response.choices[0].text;
  
  // For development, return simulated AI response
  return simulateAINarration(content, context, options);
}

/**
 * Builds the prompt for the AI narration
 */
function buildNarratorPrompt(
  content: string,
  context: NarratorContext,
  options: NarratorOptions
): string {
  const { voice, pace, style, personalityTraits } = options;
  
  return `
You are an expert trading educator with the following characteristics:
- Voice style: ${voice}
- Teaching pace: ${pace}
- Instructional approach: ${style}
- Personality: ${personalityTraits.join(', ')}

CONTEXT:
- Lesson title: ${context.lessonTitle}
- Difficulty level: ${context.difficulty}
- Topics covered: ${context.topics.join(', ')}
${context.userProgress ? `
- Student's progress: 
  - Previously completed sections: ${context.userProgress.previousSections.join(', ')}
  - Completed lessons: ${context.userProgress.completedLessons.join(', ')}
  - Learning strengths: ${context.userProgress.learningStrengths.join(', ')}
  - Learning weaknesses: ${context.userProgress.learningWeaknesses.join(', ')}
  - Total study time: ${context.userProgress.studyTime} minutes
` : ''}
${context.userInterests ? `- Student's areas of interest: ${context.userInterests.join(', ')}` : ''}

CONTENT TO NARRATE:
${content}

Please provide a narration for this content that:
1. Explains the concepts clearly and accurately
2. Uses analogies and examples to illustrate complex ideas
3. Connects to previously learned concepts when relevant
4. Maintains the specified voice, pace, and style
5. Encourages the student to engage with the material
6. Asks thought-provoking questions that help cement understanding
7. Highlights the most important takeaways

Your narration should be informative yet engaging, and suitable for an adult learning about trading.
`;
}

/**
 * Generates a fallback narration when AI generation fails
 */
function generateFallbackNarration(context: NarratorContext): string {
  return `
In this section on ${context.lessonTitle}, we'll explore key concepts related to ${context.topics.join(', ')}.

As you progress through this ${context.difficulty} level material, focus on understanding the core principles and how they apply to real trading scenarios.

Let's dive into the content and explore these concepts together.
`;
}

/**
 * Simulates AI narration for development purposes
 * This function creates realistic-seeming narrated content based on the voice and style
 */
function simulateAINarration(
  content: string,
  context: NarratorContext,
  options: NarratorOptions
): string {
  const { voice, pace, style } = options;
  
  let narration = '';
  
  // Introduction based on style
  if (style === 'conversational') {
    narration += `Hey there! Let's talk about ${context.lessonTitle}. `;
  } else if (style === 'educational') {
    narration += `Welcome to this lesson on ${context.lessonTitle}. `;
  } else if (style === 'coaching') {
    narration += `Alright, let's improve your understanding of ${context.lessonTitle}. `;
  }
  
  // Add voice characteristic
  if (voice === 'friendly') {
    narration += `I'm excited to guide you through this material! `;
  } else if (voice === 'professional') {
    narration += `We'll examine these concepts systematically. `;
  } else if (voice === 'enthusiastic') {
    narration += `This is absolutely fascinating material that can transform your trading! `;
  } else if (voice === 'calm') {
    narration += `Take your time to absorb these important concepts. `;
  }
  
  // Extract key points from content (simulated)
  const keyPoints = extractSimulatedKeyPoints(content);
  
  // Add content walkthrough
  narration += `\n\nThrough this section, we'll cover ${keyPoints.join(', ')}. `;
  
  // Add pace-specific guidance
  if (pace === 'slow') {
    narration += `\n\nLet's take our time with each concept. First, ${keyPoints[0]} is important because it forms the foundation for everything else. `;
  } else if (pace === 'medium') {
    narration += `\n\nLet's break this down step by step. The key thing to understand about ${keyPoints[0]} is how it relates to practical trading scenarios. `;
  } else if (pace === 'fast') {
    narration += `\n\nMoving efficiently through the material, note particularly how ${keyPoints.join(' connects with ')}. `;
  }
  
  // Reference previous knowledge if available
  if (context.userProgress?.previousSections.length) {
    narration += `\n\nYou'll notice this builds on what you learned earlier about ${context.userProgress.previousSections[context.userProgress.previousSections.length - 1]}. `;
  }
  
  // Add interactive element
  narration += `\n\nAs you read through this section, ask yourself: "How would I apply ${keyPoints[0]} in my own trading strategy?" This reflection will help cement your understanding. `;
  
  // Add conclusion
  narration += `\n\nBy the end of this section, you should be comfortable with these concepts and ready to apply them to your trading practice. Let's continue!`;
  
  return narration;
}

function extractSimulatedKeyPoints(content: string): string[] {
  // In a real implementation, you'd extract actual key points
  // For simulation, generate some generic trading-related points
  return [
    'risk management principles',
    'market structure analysis',
    'entry and exit strategies',
    'psychological discipline'
  ];
} 