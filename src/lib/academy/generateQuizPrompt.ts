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
    let quizData: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
    
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
    quizData.questions.forEach((q: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, index: number) => {
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
        q.pairs.forEach((pair: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any) => {
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
  } catch (error: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any) {
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
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What should you always define before entering a trade?',
        options: [
          'Your entry price only',
          'Your exit price only',
          'Both your entry and exit prices',
          'The market sentiment'
        ],
        correctAnswer: 'Both your entry and exit prices',
        explanation: 'Defining both entry and exit prices (including stop-loss and take-profit) before entering a trade is crucial for proper risk management and removing emotional decision-making.'
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which timeframe is generally best for day trading?',
        options: [
          'Weekly charts',
          'Daily charts',
          'Hourly and lower timeframes',
          'Monthly charts'
        ],
        correctAnswer: 'Hourly and lower timeframes',
        explanation: 'Day traders typically use hourly, 15-minute, 5-minute, or even 1-minute charts to make trading decisions, as they need to analyze shorter-term price movements.'
      },
      {
        id: 'q5',
        type: 'true-false',
        question: 'Technical analysis works because price patterns tend to repeat due to similar market psychology over time.',
        correctAnswer: true,
        explanation: 'Technical analysis is based on the premise that historical price patterns tend to repeat due to consistent human psychology and behavior in the markets.'
      }
    ]
  };
}

/**
 * Enhanced function to generate quiz questions with more diverse question types
 * and better feedback for incorrect answers
 */
export function createEnhancedQuizQuestions(topic: string, lessonContent: string[], keyTakeaways: string[]): Question[] {
  // This is a template function to manually create diverse questions
  // In a real implementation, we would use AI to generate these dynamically
  
  const questions: Question[] = [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: `Which of the following best describes the concept of risk management in trading?`,
      options: [
        'Maximizing profits on every trade',
        'Protecting capital through position sizing and stop-losses',
        'Trading only blue-chip stocks and established cryptocurrencies',
        'Always using leverage to amplify returns'
      ],
      correctAnswer: 'Protecting capital through position sizing and stop-losses',
      explanation: 'Risk management is primarily concerned with protecting trading capital through proper position sizing, setting stop-losses, and managing overall exposure to the market.',
      feedback: {
        'Maximizing profits on every trade': 'While profit is the goal, focusing solely on maximization often leads to excessive risk-taking.',
        'Trading only blue-chip stocks and established cryptocurrencies': 'Asset selection is important but doesn\'t address how much capital is at risk.',
        'Always using leverage to amplify returns': 'Leverage amplifies both gains and losses, and using it always increases risk rather than managing it.'
      }
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'A breakout trading strategy should always enter a position as soon as price touches a key resistance level.',
      correctAnswer: false,
      explanation: 'Breakout traders should wait for confirmation that the breakout is valid, such as a candle closing beyond the level or increased volume, rather than entering immediately when price touches resistance.'
    },
    {
      id: 'q3',
      type: 'matching',
      question: 'Match these technical indicators with their primary uses',
      pairs: [
        {item: 'RSI', match: 'Identifying overbought or oversold conditions'},
        {item: 'MACD', match: 'Showing the relationship between two moving averages'},
        {item: 'Bollinger Bands', match: 'Measuring volatility and potential price boundaries'},
        {item: 'Volume', match: 'Confirming strength of price movements'}
      ],
      explanation: 'Each technical indicator provides specific insights: RSI measures momentum and identifies extreme conditions, MACD shows trend direction and strength, Bollinger Bands display volatility, and Volume confirms the conviction behind price movements.'
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'What is the primary benefit of journaling your trades?',
      options: [
        'It makes you look professional',
        'It creates a tax record',
        'It helps identify patterns in your trading behavior and results',
        'It satisfies regulatory requirements'
      ],
      correctAnswer: 'It helps identify patterns in your trading behavior and results',
      explanation: 'Trade journaling creates a record that allows you to analyze your decisions, identify recurring patterns (both positive and negative), and refine your strategy based on actual results.',
      feedback: {
        'It makes you look professional': 'While journaling is a professional practice, its value comes from the insights it provides, not appearances.',
        'It creates a tax record': 'While useful for taxes, this is a secondary benefit not the primary purpose.',
        'It satisfies regulatory requirements': 'Retail traders typically aren\'t subject to regulatory journaling requirements.'
      }
    },
    {
      id: 'q5',
      type: 'true-false',
      question: 'The risk-to-reward ratio measures the potential profit of a trade relative to its potential loss.',
      correctAnswer: true,
      explanation: 'The risk-to-reward ratio compares what you stand to gain (reward) versus what you stand to lose (risk) on a trade, typically expressed as 1:X where X represents the reward multiple of your risk.'
    },
    {
      id: 'q6',
      type: 'multiple-choice',
      question: 'Which market phase is characterized by sideways price action after a downtrend, with institutional investors beginning to accumulate positions?',
      options: [
        'Distribution phase',
        'Markup phase',
        'Accumulation phase',
        'Markdown phase'
      ],
      correctAnswer: 'Accumulation phase',
      explanation: 'The accumulation phase occurs after a downtrend when "smart money" begins buying, creating a relatively flat, range-bound market as larger players build positions before the next uptrend (markup phase).',
      feedback: {
        'Distribution phase': 'Distribution occurs after an uptrend when smart money begins selling positions to retail investors.',
        'Markup phase': 'Markup is the uptrend phase that follows accumulation.',
        'Markdown phase': 'Markdown is the downtrend phase that follows distribution.'
      }
    },
    {
      id: 'q7',
      type: 'matching',
      question: 'Match these trading psychology challenges with their appropriate solutions',
      pairs: [
        {item: 'Fear of missing out (FOMO)', match: 'Strict trading plan with specific entry criteria'},
        {item: 'Revenge trading after losses', match: 'Taking a break and following fixed risk parameters'},
        {item: 'Analysis paralysis', match: 'Creating a structured decision-making checklist'},
        {item: 'Overconfidence after wins', match: 'Consistent position sizing regardless of recent results'}
      ],
      explanation: 'Each psychological challenge requires specific countermeasures: FOMO is addressed through discipline and predefined criteria, revenge trading is prevented by breaks and risk limits, analysis paralysis is solved with structured decision processes, and overconfidence is countered by mechanical position sizing rules.'
    }
  ];
  
  return questions;
} 