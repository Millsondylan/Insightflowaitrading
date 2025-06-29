import React from "react";
import { Award } from "lucide-react";
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
    <Div className={cn(
        "text-center transition-all duration-700 ease-in-out",
        unlocked
          ? "transform scale-100 opacity-100"
          : "transform scale-50 opacity-0",
        className
      )}
   >
      <div className="relative inline-block">
        <Award
          className={cn(
            "h-24 w-24 transition-colors duration-500",
            unlocked ? "text-yellow-400" : "text-gray-600"
          )}
        />
        {unlocked && (
          <div className="absolute top-0 left-0 w-full h-full animate-ping-slow">
            <Award className="h-24 w-24 text-yellow-400 opacity-75" />
          </div>
        )}
      </div>
      <p className="mt-2 text-lg font-semibold">{lessonName}</p>
      <p className="text-sm text-gray-400">Lesson Complete!</p>
    </div>
  );
};

export default LessonBadge; 