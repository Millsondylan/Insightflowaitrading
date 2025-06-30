
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';

interface LessonBookmarkProps {
  lessonId: string;
  isBookmarked: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onBookmark: () => void;
}

const LessonBookmark: React.FC<LessonBookmarkProps> = ({
  lessonId,
  isBookmarked,
  isCompleted,
  onComplete,
  onBookmark
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={onBookmark}
        variant="ghost"
        size="sm"
        className="text-white/70 hover:text-yellow-400"
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
      
      {!isCompleted && (
        <Button
          onClick={onComplete}
          variant="outline"
          size="sm"
          className="text-white border-green-500/30 hover:bg-green-500/10"
        >
          <Check className="h-4 w-4 mr-2" />
          Mark Complete
        </Button>
      )}
      
      {isCompleted && (
        <div className="flex items-center space-x-1 text-green-400">
          <Check className="h-4 w-4" />
          <span className="text-sm">Completed</span>
        </div>
      )}
    </div>
  );
};

export default LessonBookmark;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
