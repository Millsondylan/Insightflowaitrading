import React from "react";
import { cn } from "@/lib/utils";

interface LessonBadgeProps {
  lessonName: string;
  unlocked?: boolean;
  className?: string;
}

const LessonBadge: React.FC<LessonBadgeProps> = ({
  lessonName,
  unlocked = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "text-center transition-all duration-700 ease-in-out",
        unlocked
          ? "transform scale-100 opacity-100"
          : "transform scale-50 opacity-0",
        className
      )}
    >
      <div >
        <Award
          className={cn(
            "h-24 w-24 transition-colors duration-500",
            unlocked ? "text-yellow-400" : "text-gray-600"
          )}
        />
        {unlocked && (
          <div style={{ width: "100%" }}>
            <Award  />
          </div>
        )}
      </div>
      <p >{lessonName}</p>
      <p style={{ color: "#9CA3AF" }}>Lesson Complete!</p>
    </div>
  );
};

export default LessonBadge; 