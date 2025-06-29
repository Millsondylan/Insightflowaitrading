import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Check, Medal, BookOpen, Code } from 'lucide-react';
import LessonBookmark from './LessonBookmark';
import LessonNarrator from './LessonNarrator';
import { useAuditLog } from '@/lib/monitoring/auditLogger';
import { updateLessonProgress } from '@/lib/db/academy';
import { useLessonProgress } from '@/hooks/use-lesson-progress';

interface LessonSection {
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
}

interface LessonData {
  id: string;
  courseId: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string[];
  sections: LessonSection[];
}

export default function LessonEngine({ lesson }: { lesson: LessonData }) {
  const { lessonId } = useParams<{ lessonId: string }>();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const { logClick } = useAuditLog();
  const navigate = useNavigate();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number | null}>({});
  const [showExplanation, setShowExplanation] = useState<{[key: string]: boolean}>({});
  const [selectedTab, setSelectedTab] = useState<'content' | 'code'>('content');
  const { markSectionCompleted, getSectionProgress, getOverallProgress } = useLessonProgress();
  
  const currentSection = lesson.sections[currentSectionIndex];
  const progress = getOverallProgress(lessonId || '');
  
  useEffect(() => {
    // Reset quiz state when section changes
    setShowExplanation({});
  }, [currentSectionIndex]);

  const handleNextSection = () => {
    const sectionId = currentSection?.id;
    if (sectionId) {
      markSectionCompleted(lessonId || '', sectionId);
      
      // Record section completion in the database
      if (lessonId) {
        updateLessonProgress(lessonId, sectionId, 'completed');
      }
      
      logClick('NextLessonSection', { 
        lessonId, 
        fromSection: currentSectionIndex,
        toSection: currentSectionIndex + 1
      });
    }
    
    if (currentSectionIndex < lesson.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setSelectedTab('content');
      window.scrollTo(0, 0);
    } else {
      // At the end of the lesson
      navigate('/academy');
    }
  };
  
  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      logClick('PrevLessonSection', { 
        lessonId, 
        fromSection: currentSectionIndex,
        toSection: currentSectionIndex - 1 
      });
      
      setCurrentSectionIndex(currentSectionIndex - 1);
      setSelectedTab('content');
      window.scrollTo(0, 0);
    }
  };
  
  const handleAnswerSelect = (sectionId: string, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [sectionId]: answerIndex });
  };
  
  const handleCheckAnswer = (sectionId: string, correctAnswer: number) => {
    setShowExplanation({ ...showExplanation, [sectionId]: true });
    
    const isCorrect = quizAnswers[sectionId] === correctAnswer;
    
    logClick('QuizAnswerSubmitted', { 
      lessonId,
      sectionId,
      isCorrect 
    });
    
    if (isCorrect) {
      // Record quiz completion in the database
      if (lessonId) {
        updateLessonProgress(lessonId, sectionId, 'quiz_completed');
      }
    }
  };
  
  const isLastSection = currentSectionIndex === lesson.sections.length - 1;

  const renderQuiz = (quiz: LessonSection['quiz'], sectionId: string) => {
    if (!quiz) return null;
    
    const selectedAnswer = quizAnswers[sectionId];
    const isAnswered = selectedAnswer !== undefined;
    const isCorrect = selectedAnswer === quiz.correctAnswer;
    const showAnswer = showExplanation[sectionId];
    
    return (
      <Div className="mt-8 space-y-4 border rounded-lg p-6 bg-gray-900">
        <H3 className="text-xl font-bold">Quiz Time</Div>
        <P className="text-gray-300 mb-4">{quiz.question}</P>
        
        <Div className="space-y-3">
          {quiz.options.map((option, idx) => (
            <Div 
              key={idx}
              onClick={() => !showAnswer && handleAnswerSelect(sectionId, idx)}
              className={`
                p-4 border rounded-md cursor-pointer transition-colors
                ${selectedAnswer === idx 
                  ? showAnswer
                    ? idx === quiz.correctAnswer 
                      ? 'bg-green-900/20 border-green-500'
                      : 'bg-red-900/20 border-red-500'
                    : 'bg-blue-900/20 border-blue-500'
                  : showAnswer && idx === quiz.correctAnswer
                    ? 'bg-green-900/20 border-green-500'
                    : 'hover:bg-gray-800 border-gray-700'
                }
              `}
            >
              <Div className="flex items-center justify-between">
                <Div>{option}</Div>
                {showAnswer && idx === quiz.correctAnswer && (
                  <Check className="text-green-500 h-5 w-5" />
                )}
              </Check>
            </Div>
          ))}
        </Div>
        
        {showAnswer ? (
          <Div className="mt-4">
            <Alert variant={isCorrect ? "default" : "destructive"} 
              className={isCorrect ? "border-green-500 bg-green-900/20" : ""}
>
              <alertTitle>{isCorrect ? "Correct!" : "Not quite right"}</Div>
              <alertDescription>
                {quiz.explanation}
              </AlertDescription />
          </Div>
        ) : (
          <Button className="mt-4" 
            disabled={selectedAnswer === undefined}
            onClick={() = /> handleCheckAnswer(sectionId, quiz.correctAnswer)}
          >
            Check Answer
          </Button>
        )}
      </Div>
    );
  };

  return (
    <Div className="container max-w-4xl mx-auto py-8 px-4">
      <Div className="flex items-center justify-between mb-6">
        <Div>
          <H1 className="text-2xl font-bold">{lesson.title}</Div>
          <P className="text-gray-400">{lesson.description}</P>
        </Div>
        
        <LessonBookmark lessonId={lessonId || ''} / />
      
      <Div className="mb-8">
        <Div className="flex items-center justify-between mb-2">
          <Div className="text-sm text-gray-400">
            Progress: {Math.round(progress)}%
          </LessonBookmark>
          <Div className="text-sm text-gray-400">
            Section {currentSectionIndex + 1} of {lesson.sections.length}
          </Div>
        </Div>
        <progress value={progress} className="h-2" />
      </Div>
      
      {currentSection && (
        <>
          <Card className="mb-8" />
            <CardHeader>
              <CardTitle className="text-xl" />{currentSection.title}</Card />
            
            {/* Include the AI lesson narrator */}
            <CardContent>
              {/* Only render narrator if we have enough content to narrate */}
              {currentSection.content && currentSection.content.length > 200 && (
                <LessonNarrator
                  lessonId={lesson.id}
                  courseId={lesson.courseId}
                  sectionId={currentSection.id}
                  sectionContent={currentSection.content}
                  title={currentSection.title}
                  difficulty={lesson.difficulty}
                  topics={lesson.topics}
                />
              )}
              
              {currentSection.code_example ? (
                <Tabs defaultValue="content" 
                  value={selectedTab}
                  onValueChange={(v) = /> setSelectedTab(v as 'content' | 'code')}
                  className="mt-4"
                >
                  <TabsList className="grid grid-cols-2 w-[400px]" />
                    <TabsTrigger value="content" className="flex items-center gap-2" />
                      <bookOpen className="h-4 w-4" /> Content
                    </Card>
                    <TabsTrigger value="code" className="flex items-center gap-2" />
                      <Code className="h-4 w-4" /> Code Example
                    </TabsTrigger />
                  
                  <TabsContent value="content" className="mt-6" />
                    <Div className="prose prose-invert max-w-none">
                      <Div dangerouslySetInnerHTML={{ __html: currentSection.content }} / />
                    
                    {currentSection.quiz && renderQuiz(currentSection.quiz, currentSection.id)}
                  </TabsTrigger>
                  
                  <TabsContent value="code" className="mt-6" />
                    <Div className="bg-gray-900 p-4 rounded-md overflow-auto">
                      <Pre className="text-sm">
                        <Code>{currentSection.code_example}</TabsContent />
                    </div />
                </TabsContent>
              ) : (
                <>
                  <Div className="prose prose-invert max-w-none">
                    <Div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
                  </Div>
                  
                  {currentSection.quiz && renderQuiz(currentSection.quiz, currentSection.id)}
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-6" />
              <Button variant="outline"
                onClick={handlePrevSection}
                disabled={currentSectionIndex === 0}
              />
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </CardFooter>
              
              <Button onClick={handleNextSection}
                disabled={currentSection.quiz && !showExplanation[currentSection.id]}
   >
                {isLastSection ? (
                  <>
                    <Medal className="mr-2 h-4 w-4" /> Complete Lesson
                  </>
                ) : (
                  <>
                    Next <arrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button />
          </Button>
        </>
      )}
    </Div>
  );
} 