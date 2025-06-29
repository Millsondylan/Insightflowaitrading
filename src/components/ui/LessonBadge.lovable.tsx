import React from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonBadgeProps {
  lessonName: string;
  unlocked?: boolean;
  className?: string;
}

const LessonBadge: React.FC<Lessonbadgeprops > = ({
  lessonName,
  unlocked = false,
  className,
}) => {
  return (
    <div className={cn(
        "text-center transition-all duration-700 ease-in-out",
        unlocked
          ? "transform scale-100 opacity-100"
          : "transform scale-50 opacity-0",
        className
      )}
    />
      <div className="relative inline-block">
        <Award >
        {unlocked && (
          <div className="absolute top-0 left-0 w-full h-full animate-ping-slow">
            <Award  />
          </div>
        )}
      </div>
      <p className="mt-2 text-lg font-semibold">{lessonName}</p>
      <p className="text-sm text-gray-400">Lesson Complete!</p>
    </div>
  );
};

export default LessonBadge; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
