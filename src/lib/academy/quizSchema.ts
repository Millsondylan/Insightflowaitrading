// Question type definitions
export type QuestionType = 'multiple-choice' | 'true-false' | 'matching';

export interface FeedbackMap {
  [option: string]: string;
}

// Base question interface
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  explanation: string;
}

// Multiple choice question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
  feedback?: FeedbackMap;
}

// True/False question
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

// Matching question
export interface MatchingPair {
  item: string;
  match: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

// Union type for all question types
export type Question = MultipleChoiceQuestion | TrueFalseQuestion | MatchingQuestion;

// Quiz definition
export interface Quiz {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
}

// Legacy interfaces for backward compatibility
export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface LegacyQuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LegacyQuiz {
  id: string;
  lessonTopic: string;
  title: string;
  questions: LegacyQuizQuestion[];
  passingScore: number; // percentage needed to pass
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface QuizResult {
  quizId: string;
  answers: QuizAnswer[];
  score: number; // percentage correct
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number; // in seconds
}

/**
 * Calculate quiz score from answers
 */
export function calculateQuizScore(quiz: Quiz, answers: QuizAnswer[]): QuizResult {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const score = (correctAnswers / quiz.questions.length) * 100;
  const passed = score >= 70; // Default passing score is 70%

  return {
    quizId: quiz.title.toLowerCase().replace(/\s+/g, '-'),
    answers,
    score,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    passed,
    completedAt: new Date(),
    timeSpent: 0 // This would be calculated by the UI component
  };
}

/**
 * Convert legacy quiz format to new format
 */
export function convertLegacyQuiz(legacyQuiz: LegacyQuiz): Quiz {
  return {
    title: legacyQuiz.title,
    description: `Quiz about ${legacyQuiz.lessonTopic}`,
    difficulty: 'intermediate',
    questions: legacyQuiz.questions.map(q => {
      const correctOption = q.options.find(o => o.correct);
      
      return {
        id: q.id,
        type: 'multiple-choice' as const,
        question: q.question,
        options: q.options.map(o => o.label),
        correctAnswer: correctOption ? correctOption.label : '',
        explanation: q.explanation
      };
    })
  };
}

/**
 * Check if a given answer is correct for a question
 */
export function isAnswerCorrect(question: Question, answer: any): boolean {
  switch(question.type) {
    case 'multiple-choice':
      return question.correctAnswer === answer;
    
    case 'true-false':
      return question.correctAnswer === answer;
    
    case 'matching':
      if (!Array.isArray(answer) || answer.length !== question.pairs.length) {
        return false;
      }
      // Check if all pairs match correctly
      return answer.every((match, index) => 
        match.item === question.pairs[index].item && 
        match.match === question.pairs[index].match
      );
      
    default:
      return false;
  }
}

/**
 * Validate quiz structure
 */
export function validateQuiz(quiz: Quiz): string[] {
  const errors: string[] = [];
  
  if (!quiz.title) errors.push('Quiz must have a title');
  if (!quiz.description) errors.push('Quiz must have a description');
  if (!quiz.questions || quiz.questions.length === 0) {
    errors.push('Quiz must have at least one question');
  }
  
  quiz.questions.forEach((question, index) => {
    if (!question.id) errors.push(`Question ${index + 1} must have an id`);
    if (!question.question) errors.push(`Question ${index + 1} must have question text`);
    
    if (question.type === 'multiple-choice') {
      if (!question.options || question.options.length < 2) {
        errors.push(`Question ${index + 1} must have at least 2 options`);
      }
      if (!question.correctAnswer) {
        errors.push(`Question ${index + 1} must have a correct answer`);
      }
      if (!question.options.includes(question.correctAnswer)) {
        errors.push(`Question ${index + 1} correct answer must be in options`);
      }
    } else if (question.type === 'matching') {
      if (!question.pairs || question.pairs.length < 2) {
        errors.push(`Question ${index + 1} must have at least 2 matching pairs`);
      }
    }
  });
  
  return errors;
} 