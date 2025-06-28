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
      <button onClick={onBookmark} className="hover:text-cyan-400 transition">
        {isBookmarked ? "🔖 Bookmarked" : "📑 Bookmark"}
      </button>
      <button onClick={onComplete} className="hover:text-green-400 transition">
        {isCompleted ? "✅ Completed" : "✔️ Mark as Complete"}
      </button>
    </div>
  );
} 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
