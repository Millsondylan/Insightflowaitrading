
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
