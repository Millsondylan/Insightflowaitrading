export interface LessonProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  streak: number;
  completedLessons: number;
  tradingDays: number;
  winRate: number;
  lastUpdated: Date;
  responses: LessonResponse[];
}

export interface LessonResponse {
  questionId: string;
  answer: string;
  correct: boolean;
  timestamp: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  category: LessonCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  estimatedTime: number;
  points: number;
  questions: LessonQuestion[];
}

export interface LessonQuestion {
  id: string;
  type: 'multiple_choice' | 'text' | 'code';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export type LessonCategory = 
  | 'technical_analysis'
  | 'fundamental_analysis'
  | 'risk_management'
  | 'trading_psychology'
  | 'strategy_development'; 