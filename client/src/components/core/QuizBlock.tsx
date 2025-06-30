import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import QuizFeedback from "./QuizFeedback";
import { cn } from "@/lib/utils";
import { Brain, Trophy, ChevronDown, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/quiz.css";

// Legacy quiz types for backward compatibility
interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Quiz {
  id: string;
  lessonTopic: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
}

interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: Date;
}

interface QuizResult {
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number;
}

interface QuizFeedbackType {
  isCorrect: boolean;
  explanation: string;
  hint?: string;
  encouragement: string;
  confidence: number;
}

interface LessonBlock {
  topic: string;
  content: string;
}

interface QuizBlockProps {
  lessonBlocks: LessonBlock[];
  className?: string;
  onQuizComplete?: (result: QuizResult) => void;
}

const QuizBlock: React.FC<QuizBlockProps> = ({ 
  lessonBlocks, 
  className, 
  onQuizComplete 
}) => {
  const { toast } = useToast();
  const { hasProAccess, loading: authLoading } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, QuizFeedbackType>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isQuestionAnswered = currentQuestion && submittedAnswers[currentQuestion.id];
  const canProceed = currentQuestionIndex < (quiz?.questions.length || 0) - 1;
  const isQuizComplete = quiz && currentQuestionIndex === quiz.questions.length - 1 && isQuestionAnswered;

  useEffect(() => {
    if (!authLoading && hasProAccess) {
      generateQuiz();
    }
  }, [lessonBlocks, hasProAccess, authLoading]);

  const generateQuiz = async () => {
    if (!hasProAccess) {
      toast({
        variant: "destructive",
        title: "Pro Feature Locked",
        description: "You need a Pro subscription to generate AI quizzes.",
      });
      return;
    }
    if (lessonBlocks.length === 0) return;
    
    setLoading(true);
    try {
      // Mock quiz generation for now
      const mockQuiz: Quiz = {
        id: 'mock-quiz-1',
        lessonTopic: lessonBlocks[0]?.topic || 'Trading',
        title: 'Trading Knowledge Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q1',
            question: 'What is a stop loss?',
            options: [
              { id: 'q1-a', label: 'A price level to exit a losing trade', correct: true },
              { id: 'q1-b', label: 'A price level to enter a trade', correct: false },
              { id: 'q1-c', label: 'A type of chart pattern', correct: false },
              { id: 'q1-d', label: 'A trading strategy', correct: false }
            ],
            explanation: 'A stop loss is a predetermined price level at which a trader exits a losing position to limit potential losses.'
          }
        ]
      };
      
      setQuiz(mockQuiz);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setSubmittedAnswers({});
      setFeedbacks({});
      setQuizResult(null);
      setShowCompletion(false);
      
      toast({
        title: "Quiz Generated",
        description: "Test your knowledge with AI-generated questions!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Quiz Generation Failed",
        description: error.message || "Failed to generate quiz questions",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    if (submittedAnswers[questionId]) return; // Can't change after submission
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const generateFeedback = (question: QuizQuestion, selectedOptionId: string): QuizFeedbackType => {
    const correctOption = question.options.find(opt => opt.correct);
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
    const isCorrect = selectedOptionId === correctOption?.id;
    
    return {
      isCorrect,
      explanation: question.explanation,
      hint: !isCorrect ? "Review the lesson content and focus on the key takeaways." : undefined,
      encouragement: isCorrect 
        ? "Great job! You've understood this concept well." 
        : "Don't worry, learning takes practice. Keep going!",
      confidence: 0.85
    };
  };

  const calculateQuizScore = (quiz: Quiz, answers: QuizAnswer[]): QuizResult => {
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const score = (correctAnswers / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    return {
      quizId: quiz.id,
      answers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      passed,
      completedAt: new Date(),
      timeSpent: 0
    };
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedAnswers[currentQuestion.id]) return;
    
    const selectedOptionId = selectedAnswers[currentQuestion.id];
    const feedback = generateFeedback(currentQuestion, selectedOptionId);
    
    setSubmittedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
    
    setFeedbacks(prev => ({
      ...prev,
      [currentQuestion.id]: feedback
    }));

    // If this is the last question, calculate final result
    if (isQuizComplete && quiz) {
      const answers: QuizAnswer[] = quiz.questions.map(q => {
        const selectedId = q.id === currentQuestion.id 
          ? selectedOptionId 
          : selectedAnswers[q.id];
        const correctOption = q.options.find(opt => opt.correct);
        
        return {
          questionId: q.id,
          selectedOptionId: selectedId || '',
          isCorrect: selectedId === correctOption?.id,
          timestamp: new Date()
        };
      });
      
      const result = calculateQuizScore(quiz, answers);
      setQuizResult(result);
      
      if (result.passed) {
        setTimeout(() => setShowCompletion(true), 1500);
      }
      
      onQuizComplete?.(result);
    }
  };

  const handleNextQuestion = () => {
    if (canProceed) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateProgress = () => {
    if (!quiz) return 0;
    const answeredQuestions = Object.keys(submittedAnswers).length;
    return (answeredQuestions / quiz.questions.length) * 100;
  };

  if (authLoading) {
    return <div className="text-center p-8">Checking access...</div>;
  }

  if (!hasProAccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("quiz-container", className)}
      >
        <Card className="quiz-block">
          <CardContent className="p-8 text-center space-y-6">
            <Lock className="h-12 w-12 text-yellow-400 mx-auto"/>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Unlock AI-Powered Quizzes
              </h3>
              <p className="text-gray-400">
                Upgrade to a Pro plan to test your knowledge with quizzes tailored to each lesson.
              </p>
            </div>
            <Button onClick={generateQuiz} className="mt-4">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("quiz-container", className)}
      >
        <Card className="quiz-block">
          <CardContent className="p-8 text-center space-y-6">
            <Brain className="h-12 w-12 text-blue-400 mx-auto animate-pulse"/>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Generating Quiz Questions
              </h3>
              <p className="text-gray-400">
                AI is creating personalized questions based on the lesson content...
              </p>
            </div>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}/>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}/>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!quiz) {
    return (
      <Card className="quiz-block">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">Ready to test your knowledge?</p>
          <Button onClick={generateQuiz} className="mt-4">
            Generate Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("quiz-container", className)}
    >
      <Card className="quiz-block">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-blue-400"/>
              <span>{quiz.title}</span>
            </CardTitle>
            <div className="text-sm text-gray-400">
              {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="quiz-progress">
            <div 
              className="quiz-progress-fill"
              style={{ width: `${calculateProgress()}%` }}/>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentQuestion && (
            <>
              {/* Question */}
              <div className="quiz-question">
                {currentQuestion.question}
              </div>

              {/* Options */}
              <div className="quiz-options">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                  const isSubmitted = submittedAnswers[currentQuestion.id];
                  const feedback = feedbacks[currentQuestion.id];
                  
                  let optionClassName = "quiz-option-label";
                  if (isSubmitted && feedback) {
                    if (option.correct) {
                      optionClassName += " quiz-option-correct";
                    } else if (isSelected && !option.correct) {
                      optionClassName += " quiz-option-incorrect";
                    }
                  }

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * parseInt(option.id.slice(-1)), duration: 0.4 }}
                      className="quiz-option"
                    >
                      <Input type="radio"
                        id={`${currentQuestion.id}-${option.id}`}
                        name={currentQuestion.id}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                        disabled={isSubmitted}
                        className="quiz-option-input"
                      />
                      <Label htmlFor={`${currentQuestion.id}-${option.id}`}
                        className={optionClassName}>
                        <div className="quiz-option-radio"/>
                        <span className="text-gray-200">{option.label}</span>
                      </Label>
                    </motion.div>
                  );
                })}
              </div>

              {/* Submit/Next Button */}
              <div className="flex justify-between items-center">
                <div />
                {!isQuestionAnswered ? (
                  <Button onClick={handleSubmitAnswer}
                    disabled={!selectedAnswers[currentQuestion.id]}
                    className="quiz-submit-btn">
                    Submit Answer
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    {canProceed && (
                      <Button onClick={handleNextQuestion}
                        className="quiz-submit-btn">
                        Next Question
                        <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]"/>
                      </Button>
                    )}
                    {isQuizComplete && quizResult && (
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-200">
                          Score: {quizResult.score.toFixed(0)}%
                        </p>
                        <p className={cn(
                          "text-sm font-medium",
                          quizResult.passed ? "text-green-400" : "text-red-400"
                        )}>
                          {quizResult.passed ? "Passed!" : "Keep Learning"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback */}
              {feedbacks[currentQuestion.id] && (
                <QuizFeedback feedback={feedbacks[currentQuestion.id]}/>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Completion Badge */}
      {showCompletion && quizResult?.passed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="quiz-completion-badge"
          onClick={() => setShowCompletion(false)}
        >
          <div className="badge-content">
            <div className="badge-icon">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4"/>
            </div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-gray-300 mb-4">
              You've mastered: {lessonBlocks[0]?.topic}
            </p>
            <p className="text-lg font-semibold text-green-400">
              Score: {quizResult.score.toFixed(0)}%
            </p>
            <Button onClick={() => setShowCompletion(false)}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700">
              Continue Learning
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizBlock;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 