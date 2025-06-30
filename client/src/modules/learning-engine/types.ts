// Learning Engine module types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
}

export interface LearningProgress {
  userId: string;
  pathId: string;
  completedLessons: string[];
  currentLesson?: string;
  progress: number; // percentage
  startedAt: string;
  lastAccessed: string;
}

export interface LearningRecommendation {
  lessonId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  basedOn: string[];
} 