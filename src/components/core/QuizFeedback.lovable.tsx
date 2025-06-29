import React from "react";
import { motion } from "framer-motion";
import { QuizFeedback as QuizFeedbackType } from "@/lib/academy/quizSchema";
import { cn } from "@/lib/utils";
import "@/styles/quiz.css";

interface QuizFeedbackProps {
  feedback: QuizFeedbackType;
  className?: string;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({ feedback, className }) => {
  const { isCorrect, explanation, hint, encouragement, confidence } = feedback;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "quiz-feedback",
        isCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect",
        className
      )}
    >
      {/* Header with Icon and Status */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          {isCorrect ? (
            <span style={{fontSize: '16px'}}>✅</span>
          ) : (
            <span style={{fontSize: '16px'}}>❌</span>
          )}
        </motion.div>
        
        <div>
          <h3 className={cn(
            "text-xl font-bold",
            isCorrect ? "text-green-400" : "text-red-400"
          )}>
            {isCorrect ? "Correct!" : "Not Quite"}
          </h3>
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className={cn('text-xs font-medium', getConfidenceColor(confidence))}>
              {getConfidenceText(confidence)}
            </span>
            <div className={cn(
              'w-2 h-2 rounded-full',
              getConfidenceColor(confidence).replace('text-', 'bg-')
            )} />
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        
      >
        <div style={{ display: "flex" }}>
          <span style={{fontSize: '16px'}}>💡</span>
          <div>
            <h4 >Explanation</h4>
            <p >{explanation}</p>
          </div>
        </div>

        {/* Hint Section (for incorrect answers) */}
        {!isCorrect && hint && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{ display: "flex" }}
          >
            <span style={{fontSize: '16px'}}>📈</span>
            <div>
              <h4 >Hint for Next Time</h4>
              <p >{hint}</p>
            </div>
          </motion.div>
        )}

        {/* Encouragement Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className={cn(
            "p-4 rounded-lg border-l-4",
            isCorrect 
              ? "bg-green-500/5 border-green-400/50" 
              : "bg-blue-500/5 border-blue-400/50"
          )}
        >
          <p className={cn(
            "font-medium",
            isCorrect ? "text-green-300" : "text-blue-300"
          )}>
            {encouragement}
          </p>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
        
      >
        <div 
          className={cn(
            "h-full transition-all duration-1000",
            isCorrect 
              ? "bg-gradient-to-r from-green-500 to-emerald-400" 
              : "bg-gradient-to-r from-blue-500 to-purple-500"
          )}
          style={{ width: `${confidence * 100}%` }}
        />
      </motion.div>
    </motion.div>
  );
};

export default QuizFeedback; 