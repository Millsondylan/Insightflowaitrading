// /lib/journal/generateReflection.ts

type Reflection = {
  summary: string;
  emotion: string;
  improvement?: string;
};

export function generateReflection(entry: string): Reflection {
  if (entry.includes("revenge") || entry.includes("double down")) {
    return {
      summary: "You acted emotionally, possibly trying to recover losses.",
      emotion: "Revenge",
      improvement: "Pause after losses; reset your state before re-entry.",
    };
  }

  if (entry.includes("waited") && entry.includes("confirmation")) {
    return {
      summary: "Disciplined approach; you followed your setup and stayed patient.",
      emotion: "Disciplined",
    };
  }

  return {
    summary: "Entry logged. Consider annotating specific decisions or triggers.",
    emotion: "Neutral",
  };
} 