import React, { useState, useEffect, useMemo, useRef } from "react";
import LessonBlock from "@/components/core/LessonBlock";
import QuizBlock from "@/components/core/QuizBlock";
import ProgressSidebar from "@/components/ui/ProgressSidebar";
import LessonBadge from "@/components/ui/LessonBadge";
import { academyLessons } from "@/lib/academy/lessonData";
import { QuizResult } from "@/lib/academy/quizSchema";
import { BookOpen } from "lucide-react";
import "@/styles/quiz.css";

const AcademyPage: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState<string>(
    academyLessons[0]?.id || ""
  );
  const [progress, setProgress] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const lessonContainerRef = useRef<HTMLDivElement>(null);

  const blocksForSidebar = useMemo(
    () =>
      academyLessons.map((b) => ({
        id: b.id,
        title: b.title,
        topic: b.topic,
      })),
    []
  );

  // Group lessons by topic for quiz generation
  const lessonsByTopic = useMemo(() => {
    const grouped: Record<string, typeof academyLessons> = {};
    academyLessons.forEach(lesson => {
      if (!grouped[lesson.topic]) {
        grouped[lesson.topic] = [];
      }
      grouped[lesson.topic].push(lesson);
    });
    return grouped;
  }, []);

  const handleQuizComplete = (topic: string, result: QuizResult) => {
    setQuizResults(prev => ({
      ...prev,
      [topic]: result
    }));
  };

  const handleScroll = () => {
    const container = lessonContainerRef.current;
    if (!container) return;

    // Determine active block
    const scrollPosition = window.scrollY + window.innerHeight * 0.4;
    let currentActiveBlock = activeBlock;
    for (const block of academyLessons) {
      const element = document.getElementById(block.id);
      if (element && element.offsetTop <= scrollPosition) {
        currentActiveBlock = block.id;
      }
    }
    setActiveBlock(currentActiveBlock);

    // Calculate progress
    const containerRect = container.getBoundingClientRect();
    const scrollHeight = containerRect.height - window.innerHeight;
    const currentScroll = window.scrollY - containerRect.top;
    const scrollProgress = (currentScroll / scrollHeight) * 100;
    setProgress(Math.min(100, Math.max(0, scrollProgress)));

    // Check for completion
    const lastElement = document.getElementById(
      academyLessons[academyLessons.length - 1].id
    );
    if (lastElement) {
      const rect = lastElement.getBoundingClientRect();
      if (rect.bottom < window.innerHeight) {
        if (!lessonComplete) setLessonComplete(true);
      } else {
        if (lessonComplete) setLessonComplete(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lessonComplete]);

  const handleBlockClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - window.innerHeight * 0.3;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">
          Insight Flow Academy
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Your journey to trading mastery starts here. Learn key concepts, from
          technical analysis to risk management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
        <div className="hidden lg:block lg:col-span-3">
          <ProgressSidebar
            blocks={blocksForSidebar}
            activeBlock={activeBlock}
            progress={progress}
            onBlockClick={handleBlockClick}
          />
        </div>

        <main ref={lessonContainerRef} className="lg:col-span-9">
          {Object.entries(lessonsByTopic).map(([topic, topicLessons], topicIndex) => (
            <div key={topic} className="mb-16">
              {/* Topic Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-blue-400 mb-2">{topic}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>

              {/* Lessons for this topic */}
              {topicLessons.map((block) => (
                <LessonBlock key={block.id} block={block} />
              ))}

              {/* Quiz for this topic */}
              <div className="mt-12">
                <QuizBlock
                  lessonBlocks={topicLessons}
                  onQuizComplete={(result) => handleQuizComplete(topic, result)}
                />
              </div>

              {/* Topic Completion Badge */}
              {quizResults[topic]?.passed && (
                <div className="flex justify-center py-8">
                  <LessonBadge
                    lessonName={`${topic} Mastery`}
                    unlocked={true}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Overall Completion Badge */}
          <div className="flex justify-center py-16">
            <LessonBadge
              lessonName="Trading Foundations"
              unlocked={Object.keys(quizResults).length === Object.keys(lessonsByTopic).length && 
                        Object.values(quizResults).every(result => result.passed)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AcademyPage; 