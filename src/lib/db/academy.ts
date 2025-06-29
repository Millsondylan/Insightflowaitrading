import { supabase } from '@/integrations/supabase/client';
import { comprehensiveCourses } from '@/lib/academy/comprehensiveLessonData';

// Types
export interface AcademyCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
  color_scheme: {
    primary: string;
    secondary: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AcademyCourse {
  id: string;
  category_id?: string;
  title: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  course_type: string[];
  icon?: string;
  duration_hours: number;
  modules_count: number;
  enrolled_count: number;
  rating: number;
  tags: string[];
  prerequisites: string[];
  learning_objectives: any[];
  author_info: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademyProgress {
  id: string;
  user_id: string;
  course_id: string;
  started_at: string;
  last_accessed_at: string;
  completed_at?: string;
  progress_percentage: number;
  module_checkpoints: Record<string, any>;
  quiz_answers: any[];
  time_spent_seconds: number;
  reflection_timestamps: string[];
  notes: string[];
}

// Category Management
export async function getCategories(): Promise<academyCategory[]> {
  try {
    const { data, error } = await supabase
      .from('academy_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(cat => ({
      ...cat,
      color_scheme: cat.color_scheme as { primary: string; secondary: string }
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Course Management
export async function getCourses(options: {
  categoryId?: string;
  difficulty?: string;
  search?: string;
} = {}): Promise<academyCourse[]> {
  try {
    let query = supabase
      .from('academy_courses')
      .select('*')
      .eq('is_active', true);

    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options.difficulty) {
      query = query.eq('difficulty', options.difficulty);
    }

    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(course => ({
      ...course,
      difficulty: course.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined,
      learning_objectives: course.learning_objectives as any[],
      author_info: course.author_info as Record<string, any>
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourse(courseId: string): Promise<academyCourse | null> {
  try {
    const { data, error } = await supabase
      .from('academy_courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

// Progress Tracking
export async function getUserProgress(userId: string, courseId?: string): Promise<academyProgress[]> {
  try {
    let query = supabase
      .from('academy_progress')
      .select('*')
      .eq('user_id', userId);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
}

export async function startCourse(userId: string, courseId: string): Promise<academyProgress | null> {
  try {
    // Check if already started
    const existing = await getUserProgress(userId, courseId);
    if (existing.length > 0) {
      return existing[0];
    }

    const { data, error } = await supabase
      .from('academy_progress')
      .insert({
        user_id: userId,
        course_id: courseId,
        progress_percentage: 0,
        module_checkpoints: {},
        quiz_answers: [],
        time_spent_seconds: 0,
        reflection_timestamps: [],
        notes: []
      })
      .select()
      .single();

    if (error) throw error;

    // Increment enrolled count
    await supabase.rpc('increment', {
      table_name: 'academy_courses',
      column_name: 'enrolled_count',
      row_id: courseId
    });

    return data;
  } catch (error) {
    console.error('Error starting course:', error);
    return null;
  }
}

export async function updateProgress(
  progressId: string,
  updates: {
    progress_percentage?: number;
    module_checkpoints?: Record<string, any>;
    quiz_answers?: any[];
    time_spent_seconds?: number;
    notes?: string[];
    completed_at?: string;
  }
): Promise<academyProgress | null> {
  try {
    const updateData: any = {
      ...updates,
      last_accessed_at: new Date().toISOString()
    };

    // If progress is 100%, mark as completed
    if (updates.progress_percentage === 100 && !updates.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('academy_progress')
      .update(updateData)
      .eq('id', progressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating progress:', error);
    return null;
  }
}

// Module checkpoint tracking
export async function updateModuleCheckpoint(
  progressId: string,
  moduleId: string,
  checkpoint: {
    completed: boolean;
    timestamp: string;
    score?: number;
    attempts?: number;
  }
): Promise<boolean> {
  try {
    // Get current progress
    const { data: progress, error: fetchError } = await supabase
      .from('academy_progress')
      .select('module_checkpoints')
      .eq('id', progressId)
      .single();

    if (fetchError) throw fetchError;

    const currentCheckpoints = progress.module_checkpoints || {};
    currentCheckpoints[moduleId] = checkpoint;

    const { error: updateError } = await supabase
      .from('academy_progress')
      .update({
        module_checkpoints: currentCheckpoints,
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', progressId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error updating module checkpoint:', error);
    return false;
  }
}

// Quiz tracking
export async function saveQuizAttempt(
  progressId: string,
  quizAttempt: {
    quiz_id: string;
    answers: Record<string, any>;
    score: number;
    time_taken: number;
    completed_at: string;
  }
): Promise<boolean> {
  try {
    // Get current progress
    const { data: progress, error: fetchError } = await supabase
      .from('academy_progress')
      .select('quiz_answers')
      .eq('id', progressId)
      .single();

    if (fetchError) throw fetchError;

    const quizAnswers = progress.quiz_answers || [];
    quizAnswers.push(quizAttempt);

    const { error: updateError } = await supabase
      .from('academy_progress')
      .update({
        quiz_answers: quizAnswers,
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', progressId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return false;
  }
}

// Course feedback
export async function submitCourseFeedback(
  feedback: {
    user_id: string;
    course_id: string;
    rating?: number;
    difficulty_rating?: 'too_easy' | 'just_right' | 'too_hard';
    comment?: string;
    helpful_modules?: string[];
    improvement_suggestions?: string;
    would_recommend?: boolean;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_course_feedback')
      .upsert(feedback, {
        onConflict: 'user_id,course_id'
      });

    if (error) throw error;

    // Update course rating
    if (feedback.rating) {
      await updateCourseRating(feedback.course_id);
    }

    return true;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }
}

async function updateCourseRating(courseId: string): Promise<void> {
  try {
    const { data: feedbacks, error } = await supabase
      .from('user_course_feedback')
      .select('rating')
      .eq('course_id', courseId)
      .not('rating', 'is', null);

    if (error) throw error;

    if (feedbacks && feedbacks.length > 0) {
      const avgRating = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length;
      
      await supabase
        .from('academy_courses')
        .update({ rating: avgRating })
        .eq('id', courseId);
    }
  } catch (error) {
    console.error('Error updating course rating:', error);
  }
}

// Migration function to sync existing courses to database
export async function migrateCoursesToDatabase(): Promise<void> {
  try {
    // Get categories first
    const categories = await getCategories();
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

    // Map and insert courses
    for (const course of comprehensiveCourses) {
      const categoryName = getCategoryFromCourse(course);
      const categoryId = categoryMap.get(categoryName.toLowerCase());

      const dbCourse = {
        id: course.id,
        category_id: categoryId,
        title: course.title,
        description: course.description,
        difficulty: course.category,
        course_type: extractCourseTypes(course),
        icon: course.icon,
        duration_hours: parseInt(course.duration.split(' ')[0]) || 0,
        modules_count: course.lessons.length,
        enrolled_count: course.enrolled,
        rating: course.rating,
        tags: extractTags(course),
        prerequisites: [],
        learning_objectives: course.lessons.map(l => l.keyTakeaways).flat(),
        author_info: {},
        is_active: true
      };

      await supabase
        .from('academy_courses')
        .upsert(dbCourse, {
          onConflict: 'id'
        });
    }
  } catch (error) {
    console.error('Error migrating courses:', error);
  }
}

function getCategoryFromCourse(course: any): string {
  // Map course topics to categories
  const topicMap: Record<string, string> = {
    'technical-analysis': 'Stocks',
    'risk-management': 'Psychology',
    'crypto': 'Crypto',
    'algorithmic': 'Futures',
    'forex': 'Forex',
    'psychology': 'Psychology',
    'market-analysis': 'Stocks',
    'quantitative': 'Options',
    'institutional': 'Futures'
  };

  for (const [key, category] of Object.entries(topicMap)) {
    if (course.id.includes(key)) {
      return category;
    }
  }

  return 'Stocks'; // Default
}

function extractCourseTypes(course: any): string[] {
  const types = [];
  const content = JSON.stringify(course).toLowerCase();

  if (content.includes('emotion')) types.push('emotion_control');
  if (content.includes('technical')) types.push('technical');
  if (content.includes('option')) types.push('options');
  if (content.includes('psycholog')) types.push('psychology');
  if (content.includes('macro')) types.push('macro');
  if (content.includes('sentiment')) types.push('sentiment');
  if (content.includes('risk')) types.push('risk_theory');

  return types.length > 0 ? types : ['technical'];
}

function extractTags(course: any): string[] {
  const tags = new Set<string>();
  
  // Add difficulty as tag
  tags.add(course.category);
  
  // Extract from title and description
  const keywords = ['trading', 'analysis', 'strategy', 'risk', 'crypto', 'forex', 'options', 'futures'];
  const text = `${course.title} ${course.description}`.toLowerCase();
  
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      tags.add(keyword);
    }
  });

  return Array.from(tags);
} 