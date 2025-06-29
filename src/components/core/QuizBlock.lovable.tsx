import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QuizFeedback from "./QuizFeedback";
import LessonBadge from "@/components/ui/LessonBadge";
import { Quiz, QuizQuestion, QuizAnswer, QuizResult, QuizFeedback as QuizFeedbackType, calculateQuizScore, getCorrectAnswer } from "@/lib/academy/quizSchema";
import { requestQuiz } from "@/api/academy/quiz";
import { LessonBlock } from "@/lib/academy/lessonSchema";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/quiz.css";

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
    return <div style={{ padding: "32px" }}>Checking access...</div>;
  }

  if (!hasProAccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("quiz-container", className)}
      >
        <Card >
          <CardContent style={{ padding: "32px" }}>
            <span style={{fontSize: '16px'}}>🔒</span>
            <div>
              <h3 >
                Unlock AI-Powered Quizzes
              </h3>
              <p style={{ color: "#9CA3AF" }}>
                Upgrade to a Pro plan to test your knowledge with quizzes tailored to each lesson.
              </p>
            </div>
            <Button onClick={generateQuiz} >
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
        <Card >
          <CardContent style={{ padding: "32px" }}>
            <span style={{fontSize: '16px'}}>🧠</span>
            <div>
              <h3 >
                Generating Quiz Questions
              </h3>
              <p style={{ color: "#9CA3AF" }}>
                AI is creating personalized questions based on the lesson content...
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div  />
              <div  style={{ animationDelay: '0.2s' }} />
              <div  style={{ animationDelay: '0.4s' }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!quiz) {
    return (
      <Card >
        <CardContent style={{ padding: "32px" }}>
          <p style={{ color: "#9CA3AF" }}>Ready to test your knowledge?</p>
          <Button onClick={generateQuiz} >
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
      <Card >
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CardTitle style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>🧠</span>
              <span>{quiz.title}</span>
            </CardTitle>
            <div style={{ color: "#9CA3AF" }}>
              {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div >
            <div 
              
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </CardHeader>

        <CardContent >
          {currentQuestion && (
            <>
              {/* Question */}
              <div >
                {currentQuestion.question}
              </div>

              {/* Options */}
              <div >
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
                      
                    >
                      <input
                        type="radio"
                        id={`${currentQuestion.id}-${option.id}`}
                        name={currentQuestion.id}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                        disabled={isSubmitted}
                        
                      />
                      <label
                        htmlFor={`${currentQuestion.id}-${option.id}`}
                        className={optionClassName}
                      >
                        <div  />
                        <span >{option.label}</span>
                      </label>
                    </motion.div>
                  );
                })}
              </div>

              {/* Submit/Next Button */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div />
                {!isQuestionAnswered ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswers[currentQuestion.id]}
                    
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <div style={{ display: "flex" }}>
                    {canProceed && (
                      <Button
                        onClick={handleNextQuestion}
                        
                      >
                        Next Question
                        <ChevronDown  />
                      </Button>
                    )}
                    {isQuizComplete && quizResult && (
                      <div >
                        <p >
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
                <QuizFeedback feedback={feedbacks[currentQuestion.id]} />
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
          
          onClick={() => setShowCompletion(false)}
        >
          <div >
            <div >
              <Trophy style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "16px" }} />
            </div>
            <h2 style={{ fontWeight: "700" }}>
              Quiz Complete!
            </h2>
            <p style={{ marginBottom: "16px" }}>
              You've mastered: {lessonBlocks[0]?.topic}
            </p>
            <p >
              Score: {quizResult.score.toFixed(0)}%
            </p>
            <Button
              onClick={() => setShowCompletion(false)}
              
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