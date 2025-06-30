// Learning Engine (Academy 2.0) - Type Definitions

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  prerequisites: string[];
  sections: LessonSection[];
  quizzes: Quiz[];
  resources: Resource[];
  completionReward?: CompletionReward;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'code';
  duration: number; // in minutes
  narratorPrompt?: string; // For AI narration
  codeSnippets?: CodeSnippet[];
  interactiveElements?: InteractiveElement[];
}

export interface CodeSnippet {
  id: string;
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css';
  code: string;
  isEditable: boolean;
  solution?: string;
  hints?: string[];
}

export interface InteractiveElement {
  id: string;
  type: 'chart' | 'slider' | 'button' | 'input' | 'dropdown';
  config: Record<string, any>;
  defaultValue?: any;
  onChange?: string; // Function name to call on change
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // in seconds
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'code';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'website';
  url: string;
  description: string;
}

export interface CompletionReward {
  type: 'badge' | 'certificate' | 'points';
  value: number | string;
  image?: string;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  lastAccessed: string;
}

export interface MemoryRecord {
  userId: string;
  lessonId: string;
  conceptId: string;
  strength: number; // 0-1, representing memory strength
  lastReviewed: string;
  nextReviewDue: string;
  reviewHistory: {
    timestamp: string;
    performance: 'poor' | 'fair' | 'good' | 'excellent';
  }[];
}

export interface NarratorConfig {
  voice: 'friendly' | 'professional' | 'enthusiastic' | 'calm';
  pace: 'slow' | 'medium' | 'fast';
  style: 'conversational' | 'educational' | 'coaching';
  personalityTraits: string[];
  adaptToUser: boolean;
  useMemory: boolean;
  maxResponseLength: number;
}

// Academy module types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
} 