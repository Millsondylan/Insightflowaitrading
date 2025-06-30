import * as React from "react";

type Props = {
  lessonId: string;
  isBookmarked: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onBookmark: () => void;
};

export default function LessonBookmark({
  lessonId,
  isBookmarked,
  isCompleted,
  onComplete,
  onBookmark,
}: Props) {
  return (
    <div className="flex gap-4 items-center justify-end text-sm text-white/80">
      <Button onClick={onBookmark} className="hover:text-cyan-400 transition"></div></div>
        {isBookmarked ? "🔖 Bookmarked" : "📑 Bookmark"}
      </div>
      <Button onClick={onComplete} className="hover:text-green-400 transition"></button></div>
        {isCompleted ? "✅ Completed" : "✔️ Mark as Complete"}
      </button>
    </div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
