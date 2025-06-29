import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import QuizFeedback from "./QuizFeedback";
import LessonBadge from "@/components/ui/LessonBadge";
import { Quiz, QuizQuestion, QuizAnswer, QuizResult, QuizFeedback as QuizFeedbackType, calculateQuizScore, getCorrectAnswer } from "@/lib/academy/quizSchema";
import { requestQuiz } from "@/api/academy/quiz";
import { LessonBlock } from "@/lib/academy/lessonSchema";
import { cn } from "@/lib/utils";
import { Brain, Trophy, ChevronDown, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/quiz.css";

interface QuizBlockProps {
  lessonBlocks: LessonBlock[];
  className?: string;
  onQuizComplete?: (result: QuizResult) => void;
}

const QuizBlock: React.FC<Quizblockprops > = ({ 
  lessonBlocks, 
  className, 
  onQuizComplete 
}) => {
  const { toast } = useToast();
  const { hasProAccess, loading: authLoading } = useAuth();
  const [quiz, setQuiz] = useState<Quiz  />(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<record  >>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<record  >>({});
  const [feedbacks, setFeedbacks] = useState<record  >>({});
  const [quizResult, setQuizResult] = useState<quizresult  >(null);
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
      const generatedQuiz = await requestQuiz({
        lessonBlocks,
        questionCount: 4,
        difficulty: 'medium'
      });
      
      setQuiz(generatedQuiz);
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
    const correctAnswer = getCorrectAnswer(question);
    const isCorrect = selectedOptionId === correctAnswer.id;
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
    
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
        const correctAnswer = getCorrectAnswer(q);
        
        return {
          questionId: q.id,
          selectedOptionId: selectedId,
          isCorrect: selectedId === correctAnswer.id,
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
        <card  >
          <cardcontent  >
            <lock  >
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Unlock AI-Powered Quizzes
              </h3>
              <p className="text-gray-400">
                Upgrade to a Pro plan to test your knowledge with quizzes tailored to each lesson.
              </p>
            </div>
            <button  >
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
        <card  >
          <cardcontent  >
            <brain  >
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Generating Quiz Questions
              </h3>
              <p className="text-gray-400">
                AI is creating personalized questions based on the lesson content...
              </p>
            </div>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!quiz) {
    return (
      <card  >
        <cardcontent  >
          <p className="text-gray-400">Ready to test your knowledge?</p>
          <button  >
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
      <card  >
        <cardheader  >
          <div className="flex items-center justify-between">
            <cardtitle  style={{ display: "flex", alignItems: "center" }}>
              <brain  >
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
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </CardHeader>

        <cardcontent  >
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
                      <input
                        type="radio"
                        id={`${currentQuestion.id}-${option.id}`}
                        name={currentQuestion.id}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                        disabled={isSubmitted}
                        className="quiz-option-input"
                      />
                      <label
                        htmlFor={`${currentQuestion.id}-${option.id}`}
                        className={optionClassName}
                      >
                        <div className="quiz-option-radio" />
                        <span className="text-gray-200">{option.label}</span>
                      </label>
                    </motion.div>
                  );
                })}
              </div>

              {/* Submit/Next Button */}
              <div className="flex justify-between items-center">
                <div />
                {!isQuestionAnswered ? (
                  <button  >
                    Submit Answer
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    {canProceed && (
                      <button  >
                        Next Question
                        <chevrondown  >
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
                <quizfeedback  >
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
              <trophy  >
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
            <button  > setShowCompletion(false)}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700"
            >
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
