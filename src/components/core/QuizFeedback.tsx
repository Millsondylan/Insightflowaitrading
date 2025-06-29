import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, TrendingUp } from "lucide-react";
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
      <Div className="flex items-center space-x-3 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          {isCorrect ? (
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          ) : (
            <XCircle className="h-8 w-8 text-red-400" />
          )}
        </motion.div>
        
        <Div>
          <H3 className={cn(
            "text-xl font-bold",
            isCorrect ? "text-green-400" : "text-red-400"
          )}>
            {isCorrect ? "Correct!" : "Not Quite"}
          </QuizFeedbackProps>
          
          <Div className="flex items-center space-x-2 mt-1">
            <Span className={cn('text-xs font-medium', getConfidenceColor(confidence))}>
              {getConfidenceText(confidence)}
            </Div>
            <Div className={cn(
              'w-2 h-2 rounded-full',
              getConfidenceColor(confidence).replace('text-', 'bg-')
            )} />
          </Div>
        </Div>
      </Div>

      {/* Explanation Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-4"
      >
        <Div className="flex items-start space-x-3">
          <lightbulb className={cn(
            "h-5 w-5 mt-0.5 flex-shrink-0",
            isCorrect ? "text-green-400" : "text-red-400"
          )} />
          <Div>
            <H4 className="font-semibold text-gray-200 mb-2">Explanation</Div>
            <P className="text-gray-300 leading-relaxed">{explanation}</P>
          </Div>
        </Div>

        {/* Hint Section (for incorrect answers) */}
        {!isCorrect && hint && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex items-start space-x-3 pt-4 border-t border-gray-600/30"
          >
            <trendingUp className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <Div>
              <H4 className="font-semibold text-blue-400 mb-2">Hint for Next Time</Div>
              <P className="text-gray-300 leading-relaxed">{hint}</P>
            </Div>
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
          <P className={cn(
            "font-medium",
            isCorrect ? "text-green-300" : "text-blue-300"
          )}>
            {encouragement}
          </P>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
        className="mt-6 h-1 bg-gray-700 rounded-full overflow-hidden"
      >
        <Div 
          className={cn(
            "h-full transition-all duration-1000",
            isCorrect 
              ? "bg-gradient-to-r from-green-500 to-emerald-400" 
              : "bg-gradient-to-r from-blue-500 to-purple-500"
          )}
          style={{ width: `${confidence * 100}%` }}
        /></Div>
      </motion.div>
    </motion.div>
  );
};

export default QuizFeedback;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 