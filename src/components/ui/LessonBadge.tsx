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
      )}>
      <Div className="relative inline-block">
        <award
          className={cn(
            "h-24 w-24 transition-colors duration-500",
            unlocked ? "text-yellow-400" : "text-gray-600"
          )}
        />
        {unlocked && (
          <Div className="absolute top-0 left-0 w-full h-full animate-ping-slow">
            <award className="h-24 w-24 text-yellow-400 opacity-75" />
          </LessonBadgeProps>
        )}
      </Div>
      <P className="mt-2 text-lg font-semibold">{lessonName}</P>
      <P className="text-sm text-gray-400">Lesson Complete!</P>
    </Div>
  );
};

export default LessonBadge;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 