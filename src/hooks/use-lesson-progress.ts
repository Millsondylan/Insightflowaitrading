
import { useState, useEffect } from 'react';

export interface LessonProgress {
  completed: string[];
  bookmarked: string[];
  markComplete: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
}

export const useLessonProgress = (): LessonProgress => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem('lesson-progress-completed');
    const savedBookmarked = localStorage.getItem('lesson-progress-bookmarked');
    
    if (savedCompleted) {
      setCompleted(JSON.parse(savedCompleted));
    }
    
    if (savedBookmarked) {
      setBookmarked(JSON.parse(savedBookmarked));
    }
  }, []);

  const markComplete = (lessonId: string) => {
    setCompleted(prev => {
      const updated = [...prev, lessonId];
      localStorage.setItem('lesson-progress-completed', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarked(prev => {
      const updated = prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem('lesson-progress-bookmarked', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    completed,
    bookmarked,
    markComplete,
    toggleBookmark
  };
};
