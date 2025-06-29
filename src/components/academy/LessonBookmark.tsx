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
    <Div className="flex gap-4 items-center justify-end text-sm text-white/80">
      <Button onClick={onBookmark} className="hover:text-cyan-400 transition">
        {isBookmarked ? "🔖 Bookmarked" : "📑 Bookmark"}
      </Div>
      <Button onClick={onComplete} className="hover:text-green-400 transition">
        {isCompleted ? "✅ Completed" : "✔️ Mark as Complete"}
      </Button>
    </Div>
  );

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
} 