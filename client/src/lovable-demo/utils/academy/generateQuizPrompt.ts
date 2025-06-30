import { LessonBlock } from './lessonSchema';
import { Quiz } from './quizSchema';

export interface QuizGenerationParams {
  lessonBlocks: LessonBlock[];
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  focusAreas?: string[];
}

/**
 * Generates a structured prompt for AI to create quiz questions from lesson content
 */
export function generateQuizPrompt(params: QuizGenerationParams): string {
  const { lessonBlocks, questionCount = 4, difficulty = 'medium', focusAreas } = params;
  
  if (lessonBlocks.length === 0) {
    throw new Error('At least one lesson block is required to generate quiz questions');
  }

  const topic = lessonBlocks[0].topic;
  const lessonContent = lessonBlocks
    .map((block, index) => `
LESSON ${index + 1}: ${block.title}
${block.content}

Key Takeaways:
${block.keyTakeaways.map(takeaway => `• ${takeaway}`).join('\n')}
`).join('\n\n');

  const focusSection = focusAreas && focusAreas.length > 0 
    ? `\nFOCUS AREAS: Please emphasize questions about: ${focusAreas.join(', ')}`
    : '';

  return `You are an expert trading education specialist creating quiz questions to test comprehension of trading concepts.

LESSON TOPIC: ${topic}

LESSON CONTENT:
${lessonContent}

INSTRUCTIONS:
Create ${questionCount} multiple-choice questions (difficulty: ${difficulty}) based on the lesson content above. Each question should test practical understanding, not just memorization.

${focusSection}

REQUIREMENTS:
- Questions should be clear and unambiguous
- Each question must have exactly 4 answer options (A, B, C, D)
- Only ONE option should be correct
- Include practical scenarios when possible
- Provide detailed explanations for the correct answer
- Explanations should be educational and help reinforce learning

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:

{
  "quiz": {
    "id": "quiz-${topic.toLowerCase().replace(/\s+/g, '-')}",
    "lessonTopic": "${topic}",
    "title": "Quiz: ${topic}",
    "passingScore": 75,
    "questions": [
      {
        "id": "q1",
        "question": "Your question here?",
        "options": [
          {"id": "a", "label": "Option A", "correct": false},
          {"id": "b", "label": "Option B", "correct": true},
          {"id": "c", "label": "Option C", "correct": false},
          {"id": "d", "label": "Option D", "correct": false}
        ],
        "explanation": "Detailed explanation of why option B is correct and why the others are wrong.",
        "difficulty": "${difficulty}"
      }
    ]
  }
}

Focus on creating questions that:
1. Test understanding of key concepts
2. Include practical trading scenarios
3. Help identify common mistakes
4. Reinforce the lesson's key takeaways

Make sure the JSON is valid and follows the exact structure above.`;
}

/**
 * Validates the AI-generated quiz response
 */
export function validateQuizResponse(response: string): Quiz {
  try {
    const parsed = JSON.parse(response);
    
    if (!parsed.quiz) {
      throw new Error('Response must contain a "quiz" object');
    }
    
    const quiz = parsed.quiz as Quiz;
    
    // Basic validation
    if (!quiz.id || !quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
      throw new Error('Invalid quiz structure');
    }
    
    // Validate each question
    quiz.questions.forEach((question, index) => {
      if (!question.id || !question.question || !question.options || !question.explanation) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }
      
      if (!Array.isArray(question.options) || question.options.length < 2) {
        throw new Error(`Question ${index + 1} must have at least 2 options`);
      }
      
      const correctOptions = question.options.filter(opt => opt.correct);
      if (correctOptions.length !== 1) {
        throw new Error(`Question ${index + 1} must have exactly one correct answer`);
      }
      
      // Ensure all options have required fields
      question.options.forEach((option, optIndex) => {
        if (!option.id || !option.label || typeof option.correct !== 'boolean') {
          throw new Error(`Question ${index + 1}, option ${optIndex + 1} is missing required fields`);
        }
      });
    });
    
    return quiz;
  } catch (error) {
    console.error('Failed to validate quiz response:', error);
    throw new Error('Invalid quiz response format');
  }
}

/**
 * Creates a fallback quiz for when AI generation fails
 */
export function createFallbackQuiz(lessonTopic: string): Quiz {
  return {
    id: `fallback-${lessonTopic.toLowerCase().replace(/\s+/g, '-')}`,
    lessonTopic,
    title: `Quiz: ${lessonTopic}`,
    passingScore: 75,
    questions: [
      {
        id: 'fallback-q1',
        question: `What is the most important principle when learning about ${lessonTopic}?`,
        options: [
          { id: 'a', label: 'Memorizing all the rules', correct: false },
          { id: 'b', label: 'Understanding the underlying concepts', correct: true },
          { id: 'c', label: 'Following others blindly', correct: false },
          { id: 'd', label: 'Ignoring risk management', correct: false }
        ],
        explanation: 'Understanding the underlying concepts is crucial for applying knowledge effectively in real trading situations.',
        difficulty: 'easy' as const
      }
    ]
  };
} 