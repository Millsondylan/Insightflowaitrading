import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import LessonEngine from "./LessonEngine";
import QuizEngine from "./QuizEngine";
import LessonBookmark from "./LessonBookmark";
import { useLessonProgress } from "@/hooks/use-lesson-progress";

export interface LessonData {
  id: string;
  title: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    code_example?: string;
    quiz?: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    };
  }>;
  quizId?: string;
}

interface LessonViewProps {
  lesson: LessonData;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson }) => {
  const { toast } = useToast();
  const [activeQuizId, setActiveQuizId] = React.useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string | null>(null);
  const [showQuiz, setShowQuiz] = React.useState<boolean>(false);
  const { completed, bookmarked, markComplete, toggleBookmark } = useLessonProgress();

  const isLessonCompleted = completed.includes(lesson.id);
  const isBookmarked = bookmarked.includes(lesson.id);

  // Handle section progress updates
  const handleProgressUpdate = (completedSectionIds: string[]) => {
    // Optional: you can track section completion here
    console.log("Completed sections:", completedSectionIds);
  };

  // Handle selecting a quiz from a section
  const handleTakeQuiz = (quizId: string, sectionId: string) => {
    setActiveQuizId(quizId);
    setActiveSectionId(sectionId);
    setShowQuiz(true);
    
    // Scroll to quiz section
    setTimeout(() => {
      document.getElementById("lesson-quiz")?.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  // Handle quiz completion
  const handleQuizComplete = (quizId: string, lessonId?: string) => {
    if (lessonId) {
      markComplete(lessonId);
      
      toast({
        title: "Lesson Completed!",
        description: "This lesson has been marked as complete.",
      });
    }
  };

  // Toggle bookmark
  const handleToggleBookmark = () => {
    toggleBookmark(lesson.id);
    
    toast({
      title: isBookmarked ? "Removed Bookmark" : "Lesson Bookmarked",
      description: isBookmarked
        ? "This lesson has been removed from your bookmarks." 
        : "This lesson has been added to your bookmarks.",
    });
  };

  // Handle going back to content from quiz
  const handleBackToContent = () => {
    setShowQuiz(false);
  };

  // Create lesson data for LessonEngine
  const lessonData = {
    id: lesson.id,
    courseId: lesson.id, // Using lesson.id as courseId for now
    title: lesson.title,
    description: lesson.description,
    difficulty: "beginner" as const, // Properly typed as union type
    topics: [], // Default empty array
    sections: lesson.sections.map(section => ({
      id: section.id,
      title: section.title,
      blocks: [{
        id: section.id,
        title: section.title,
        content: section.content,
        keyTakeaways: []
      }]
    }))
  };

  return (
    <div className="space-y-8">
      {/* Lesson Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
          <p className="text-white/70 mt-2">{lesson.description}</p>
        </div>
        
        <LessonBookmark
          lessonId={lesson.id}
          isBookmarked={isBookmarked}
          isCompleted={isLessonCompleted}
          onComplete={() => markComplete(lesson.id)}
          onBookmark={handleToggleBookmark}
        />
      </div>

      {/* Lesson Content */}
      {!showQuiz && (
        <LessonEngine lesson={lessonData}/>
      )}
      
      {/* Quiz Section */}
      {showQuiz && activeQuizId && (
        <div id="lesson-quiz" className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Quiz: Test Your Knowledge</h2>
            <Button 
              onClick={handleBackToContent}
              className="text-white/70 hover:text-cyan-400 text-sm"
            >
              ← Back to lesson content
            </Button>
          </div>
          
          <QuizEngine 
            quizId={activeQuizId}
            lessonId={lesson.id}
            lessonTitle={activeSectionId ? 
              lesson.sections.find(s => s.id === activeSectionId)?.title : 
              lesson.title
            }
            onComplete={handleQuizComplete}
          />
        </div>
      )}
    </div>
  );
};

export default LessonView;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
