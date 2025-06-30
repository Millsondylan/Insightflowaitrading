export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  lessonTopic: string;
  title: string;
  questions: QuizQuestion[];
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

export interface QuizFeedback {
  isCorrect: boolean;
  explanation: string;
  hint?: string;
  encouragement: string;
  confidence: number; // 0-1 scale
}

/**
 * Calculate quiz score from answers
 */
export function calculateQuizScore(quiz: Quiz, answers: QuizAnswer[]): QuizResult {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const score = (correctAnswers / quiz.questions.length) * 100;
  const passed = score >= quiz.passingScore;

  return {
    quizId: quiz.id,
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
 * Get the correct answer for a question
 */
export function getCorrectAnswer(question: QuizQuestion): QuizOption {
  const correctOption = question.options.find(option => option.correct);
  if (!correctOption) {
    throw new Error(`No correct answer found for question: ${question.id}`);
  }
  return correctOption;
}

/**
 * Validate quiz structure
 */
export function validateQuiz(quiz: Quiz): string[] {
  const errors: string[] = [];
  
  if (!quiz.id) errors.push('Quiz must have an id');
  if (!quiz.title) errors.push('Quiz must have a title');
  if (!quiz.questions || quiz.questions.length === 0) {
    errors.push('Quiz must have at least one question');
  }
  
  quiz.questions.forEach((question, index) => {
    if (!question.id) errors.push(`Question ${index + 1} must have an id`);
    if (!question.question) errors.push(`Question ${index + 1} must have a question text`);
    if (!question.options || question.options.length < 2) {
      errors.push(`Question ${index + 1} must have at least 2 options`);
    }
    
    const correctOptions = question.options.filter(opt => opt.correct);
    if (correctOptions.length !== 1) {
      errors.push(`Question ${index + 1} must have exactly one correct answer`);
    }
  });
  
  return errors;
} 