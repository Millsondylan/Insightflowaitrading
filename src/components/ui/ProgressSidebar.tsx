
import React from 'react';
import { Button } from '@/components/ui/button';

interface LessonProgress {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressSidebarProps {
  lessons: LessonProgress[];
  onLessonSelect: (lessonId: string) => void;
}

const ProgressSidebar = ({ lessons, onLessonSelect }: ProgressSidebarProps) => {
  const completedCount = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedCount / lessons.length) * 100;

  return (
    <aside className="w-64 bg-gray-50 border-r p-4">
      <nav className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Progress ({completedCount}/{lessons.length})
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="relative">
              <Button
                variant={lesson.current ? "default" : "ghost"}
                size="sm"
                onClick={() => onLessonSelect(lesson.id)}
                className="w-full justify-start text-left"
              >
                <span className={`mr-2 ${lesson.completed ? 'text-green-500' : 'text-gray-400'}`}>
                  {lesson.completed ? '✓' : '○'}
                </span>
                <span className="truncate">{lesson.title}</span>
              </Button>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default ProgressSidebar;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
