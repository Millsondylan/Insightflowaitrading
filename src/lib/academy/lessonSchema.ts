
export interface LessonBlock {
  id: string;
  title: string;
  content: string;
  keyTakeaways: string[];
}

export interface LessonSection {
  id: string;
  title: string;
  blocks: LessonBlock[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  sections: LessonSection[];
}
