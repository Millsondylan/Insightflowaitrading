import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/quiz.css";

// Quiz data structure based on the existing schema
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizProps {
  quizId: string;
  lessonId?: string;
  lessonTitle?: string;
  onComplete?: (quizId: string, lessonId?: string) => void;
}

const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What does RSI > 70 typically indicate?",
    options: ["Oversold", "Overbought", "Neutral", "Breakout"],
    correctIndex: 1,
    explanation: "RSI above 70 suggests overbought conditions."
  },
  {
    id: "q2",
    question: "Which pattern suggests a trend reversal?",
    options: ["Ascending Triangle", "Double Top", "Bull Flag", "Rising Wedge"],
    correctIndex: 1,
    explanation: "Double Top is a bearish reversal pattern that forms after an extended uptrend."
  },
  {
    id: "q3",
    question: "What timeframe is most suitable for day trading?",
    options: ["Weekly", "Daily", "4-hour", "5-minute"],
    correctIndex: 3,
    explanation: "Day traders typically use shorter timeframes like 5-minute charts to capture intraday price movements."
  },
  {
    id: "q4",
    question: "Which indicator is best for identifying trend direction?",
    options: ["RSI", "Moving Average", "Stochastic", "Bollinger Bands"],
    correctIndex: 1,
    explanation: "Moving Averages are excellent for determining the overall trend direction and strength."
  },
  {
    id: "q5",
    question: "What is considered a healthy profit-to-loss ratio?",
    options: ["1:1", "2:1", "3:1", "0.5:1"],
    correctIndex: 2,
    explanation: "A 3:1 profit-to-loss ratio is generally considered healthy, allowing traders to be profitable even with a lower win rate."
  }
];

const QuizEngine: React.FC<QuizProps> = ({ quizId, lessonId, lessonTitle, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  const [quizComplete, setQuizComplete] = React.useState<boolean>(false);
  const [userAnswers, setUserAnswers] = React.useState<Record<string, number>>({});
  const [hasPassedQuiz, setHasPassedQuiz] = React.useState<boolean>(false);

  // Current question from mock data
  const currentQuestion = mockQuestions[currentQuestionIndex];
  
  // Handle quiz completion
  React.useEffect(() => {
    if (quizComplete && isPassed() && !hasPassedQuiz) {
      setHasPassedQuiz(true);
      if (onComplete) {
        onComplete(quizId, lessonId);
      }
    }
  }, [quizComplete, onComplete, quizId, lessonId, hasPassedQuiz]);
  
  // Reset quiz state
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
    setUserAnswers({});
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };

  // Submit answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    // Record user answer
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption
    }));
    
    // Check if answer is correct and update score
    if (selectedOption === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
    
    setIsAnswered(true);
  };

  // Move to next question
  const handleNextQuestion = () => {
    // If we're at the last question, end the quiz
    if (currentQuestionIndex === mockQuestions.length - 1) {
      setQuizComplete(true);
      return;
    }
    
    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // Calculate percentage score
  const calculatePercentage = (): number => {
    return Math.round((score / mockQuestions.length) * 100);
  };

  // Check if quiz is passed (over 70%)
  const isPassed = (): boolean => {
    return calculatePercentage() >= 70;
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
      {/* Quiz Header */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ color: "white", fontWeight: "700" }}>
          {lessonTitle || "Quiz"} 
          <span style={{ color: "#9CA3AF" }}>
            ({currentQuestionIndex + 1} of {mockQuestions.length})
          </span>
        </h2>
        
        {/* Progress bar */}
        <div >
          <motion.div 
            
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / mockQuestions.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Quiz Content */}
      {!quizComplete ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            
          >
            {/* Question */}
            <h3 style={{ color: "white" }}>
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div >
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className={`
                    w-full text-left bg-white/10 hover:bg-cyan-600 text-white px-4 py-2 rounded-full
                    transition-all duration-300 flex items-center justify-between
                    ${selectedOption === index ? "bg-cyan-600" : ""}
                    ${isAnswered && index === currentQuestion.correctIndex ? "bg-green-500" : ""}
                    ${isAnswered && index === selectedOption && index !== currentQuestion.correctIndex ? "bg-red-500" : ""}
                  `}
                >
                  <span>{option}</span>
                  
                  {isAnswered && (
                    index === currentQuestion.correctIndex ? (
                      <span style={{fontSize: '16px'}}>✅</span>
                    ) : (
                      index === selectedOption && <span style={{fontSize: '16px'}}>❌</span>
                    )
                  )}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`p-4 rounded-lg ${
                  selectedOption === currentQuestion.correctIndex
                    ? "bg-green-500/20 border-l-4 border-green-500"
                    : "bg-red-500/20 border-l-4 border-red-500"
                }`}
              >
                <p style={{ color: "white" }}>
                  {selectedOption === currentQuestion.correctIndex ? "✅ " : "❌ "}
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex" }}>
              {!isAnswered ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  style={{ color: "white" }}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  style={{ color: "white" }}
                >
                  {currentQuestionIndex === mockQuestions.length - 1
                    ? "See Results"
                    : (
                      <>
                        Next Question
                        <ChevronRight  />
                      </>
                    )
                  }
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        // Quiz Summary
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`text-5xl font-bold ${isPassed() ? "text-green-400" : "text-red-400"}`}
          >
            {calculatePercentage()}%
          </motion.div>

          <p style={{ color: "white" }}>
            You got <span style={{ fontWeight: "700" }}>{score}</span> out of <span style={{ fontWeight: "700" }}>{mockQuestions.length}</span> questions correct
          </p>
          
          {isPassed() ? (
            <div >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                
              >
                Congratulations! You've passed the quiz. 🎉
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 720 }}
                transition={{ delay: 0.8, duration: 1 }}
                
              >
                🏆
              </motion.div>
            </div>
          ) : (
            <p >
              You need at least 70% to pass. Try again!
            </p>
          )}

          <div >
            <Button
              onClick={resetQuiz}
              style={{ color: "white" }}
            >
              <RefreshCw  />
              Retry Quiz
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuizEngine; 