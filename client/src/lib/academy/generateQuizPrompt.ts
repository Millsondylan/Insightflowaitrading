
import { LessonBlock } from './lessonSchema';
import { Quiz, Question } from './quizSchema';

export interface QuizGenerationParams {
  lessonBlocks: LessonBlock[];
  questionCount?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  focusAreas?: string[];
}

/**
 * Generates a prompt for AI to create a quiz based on lesson content
 */
export function generateQuizPrompt(params: QuizGenerationParams): string {
  const {
    lessonBlocks,
    questionCount = 5,
    difficulty = 'intermediate',
    focusAreas = []
  } = params;

  // Extract all content and key takeaways
  const allContent = lessonBlocks.map(block => block.content).join('\n\n');
  const allTakeaways = lessonBlocks.map(block => block.keyTakeaways).flat();
  
  // Format focus areas if provided
  const focusAreasText = focusAreas.length > 0 
    ? `Focus particularly on these areas: ${focusAreas.join(', ')}.` 
    : '';
  
  // Create a comprehensive prompt for AI
  return `You are an expert trading educator creating a quiz about ${lessonBlocks[0]?.topic || 'trading strategies'}.
  
Create a ${difficulty} level quiz with exactly ${questionCount} questions based on the following lesson content:

${allContent}

Key takeaways to emphasize:
${allTakeaways.map(takeaway => `- ${takeaway}`).join('\n')}

${focusAreasText}

Create a diverse mix of question types:
- Multiple choice questions (60%)
- True/false questions (20%)
- Matching or completion questions (20%)

For each question:
1. Write a clear, concise question that tests understanding (not just recall)
2. Provide 4 options for multiple-choice questions (only 1 correct)
3. For true/false, make sure the statement is clearly true or false
4. For matching questions, provide 3-4 pairs to match
5. Include a detailed explanation for why the answer is correct
6. Include specific feedback for common misconceptions for wrong answers

Response format (JSON):
{
  "title": "Quiz title related to the topic",
  "description": "Brief description of what this quiz covers",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Detailed explanation why Option A is correct",
      "feedback": {
        "Option B": "Specific feedback addressing this misconception",
        "Option C": "Specific feedback addressing this misconception",
        "Option D": "Specific feedback addressing this misconception"
      }
    },
    {
      "id": "q2",
      "type": "true-false",
      "question": "Statement that is either true or false",
      "correctAnswer": true,
      "explanation": "Why this statement is true/false with reference to lesson content"
    },
    {
      "id": "q3", 
      "type": "matching",
      "question": "Match the following concepts to their descriptions",
      "pairs": [
        {"item": "Term 1", "match": "Definition 1"},
        {"item": "Term 2", "match": "Definition 2"},
        {"item": "Term 3", "match": "Definition 3"}
      ],
      "explanation": "Explanation of the correct matches and their significance"
    }
  ]
}

Ensure the quiz is challenging but fair, focused on practical understanding rather than obscure details.`;
}

/**
 * Validates AI-generated quiz response and converts it to Quiz object
 */
export function validateQuizResponse(aiResponse: string): Quiz {
  try {
    // Try to parse the JSON response
    let quizData: any;
    
    // Extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      quizData = JSON.parse(jsonMatch[1]);
    } else {
      // Try to parse the whole response
      quizData = JSON.parse(aiResponse);
    }
    
    // Basic validation to ensure required fields are present
    if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz format: missing title or questions array');
    }
    
    // Validate each question has the necessary fields
    quizData.questions.forEach((q: any, index: number) => {
      if (!q.id) q.id = `q${index + 1}`;
      if (!q.question) throw new Error(`Question ${index + 1} missing question text`);
      if (!q.type) throw new Error(`Question ${index + 1} missing type`);
      
      // Validate based on question type
      if (q.type === 'multiple-choice') {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Question ${index + 1} has invalid options`);
        }
        if (q.correctAnswer === undefined) {
          throw new Error(`Question ${index + 1} missing correctAnswer`);
        }
        if (!q.options.includes(q.correctAnswer)) {
          throw new Error(`Question ${index + 1} correctAnswer not in options`);
        }
      } else if (q.type === 'true-false') {
        if (typeof q.correctAnswer !== 'boolean') {
          throw new Error(`Question ${index + 1} correctAnswer must be boolean`);
        }
      } else if (q.type === 'matching') {
        if (!q.pairs || !Array.isArray(q.pairs) || q.pairs.length < 2) {
          throw new Error(`Question ${index + 1} has invalid pairs`);
        }
        q.pairs.forEach((pair: any) => {
          if (!pair.item || !pair.match) {
            throw new Error(`Question ${index + 1} contains incomplete pair`);
          }
        });
      }
      
      // Ensure explanation is present
      if (!q.explanation) {
        q.explanation = "Explanation not provided";
      }
    });
    
    return quizData as Quiz;
  } catch (error: any) {
    console.error('Error validating quiz response:', error.message);
    throw new Error(`Invalid quiz format: ${error.message}`);
  }
}

/**
 * Creates a fallback quiz if AI generation fails
 */
export function createFallbackQuiz(topic: string): Quiz {
  const topicName = topic || 'Trading Strategies';
  
  return {
    title: `${topicName} Quiz`,
    description: `Test your knowledge of ${topicName.toLowerCase()}.`,
    difficulty: 'intermediate',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: `What is the main benefit of studying ${topicName.toLowerCase()}?`,
        options: [
          'Improved trading results',
          'Understanding market dynamics',
          'Better risk management',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: `Studying ${topicName.toLowerCase()} helps improve trading results by enhancing your understanding of market dynamics and implementing better risk management practices.`
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Risk management is more important than having profitable strategies.',
        correctAnswer: true,
        explanation: 'Even the most profitable strategy will eventually fail without proper risk management. Protecting capital is the first priority of successful traders.'
      }
    ]
  };
}
