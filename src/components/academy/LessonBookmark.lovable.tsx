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
    <div style={{ display: "flex", alignItems: "center" }}>
      <button onClick={onBookmark} >
        {isBookmarked ? "🔖 Bookmarked" : "📑 Bookmark"}
      </button>
      <button onClick={onComplete} >
        {isCompleted ? "✅ Completed" : "✔️ Mark as Complete"}
      </button>
    </div>
  );
} 