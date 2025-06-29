import * as React from "react";
import LessonEngine, { LessonSection } from "./LessonEngine";
import QuizEngine from "./QuizEngine";
import LessonBookmark from "./LessonBookmark";
import { useLessonProgress } from "@/hooks/use-lesson-progress";

export interface LessonData {
  id: string;
  title: string;
  description: string;
  sections: LessonSection[];
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

  return (
    <div style={{ marginTop: "32px" }}>
      {/* Lesson Header */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>{lesson.title}</h1>
          <p >{lesson.description}</p>
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
        <LessonEngine 
          sections={lesson.sections}
          onProgressUpdate={handleProgressUpdate}
          onTakeQuiz={handleTakeQuiz}
        />
      )}
      
      {/* Quiz Section */}
      {showQuiz && activeQuizId && (
        <div id="lesson-quiz" >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ fontWeight: "700", color: "white" }}>Quiz: Test Your Knowledge</h2>
            <button 
              onClick={handleBackToContent}
              
            >
              ← Back to lesson content
            </button>
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