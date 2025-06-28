import * as React from "react";

export function useLessonProgress() {
  const [completed, setCompleted] = React.useState<string[]>([]);
  const [bookmarked, setBookmarked] = React.useState<string[]>([]);

  React.useEffect(() => {
    const c = localStorage.getItem("academy-completed");
    const b = localStorage.getItem("academy-bookmarked");
    if (c) setCompleted(JSON.parse(c));
    if (b) setBookmarked(JSON.parse(b));
  }, []);

  const markComplete = (id: string) => {
    const updated = Array.from(new Set([...completed, id]));
    localStorage.setItem("academy-completed", JSON.stringify(updated));
    setCompleted(updated);
  };

  const toggleBookmark = (id: string) => {
    const updated = bookmarked.includes(id)
      ? bookmarked.filter((x) => x !== id)
      : [...bookmarked, id];
    localStorage.setItem("academy-bookmarked", JSON.stringify(updated));
    setBookmarked(updated);
  };

  return { completed, bookmarked, markComplete, toggleBookmark };
} 