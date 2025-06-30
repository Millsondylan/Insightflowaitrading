import React, { useState, useEffect } from 'react';

type JournalEntry = {
  title: string;
  date: string;
  tags: string[];
  notes: string;
  strategyId?: string;
};

type AIFeedback = {
  summary: string;
  emotion: string;
  suggestions: string[];
};

type JournalCoachProps = {
  entry: JournalEntry;
  onFeedbackReady?: (feedback: AIFeedback) => void;
};

const mockAIFeedback: AIFeedback = {
  summary: "You executed a breakout scalp but exited early due to fear of a reversal, missing further gains.",
  emotion: "Anxious",
  suggestions: [
    "Consider defining exit rules more clearly before entering a trade.",
    "Practice visualizing the trade playing out to full profit target to build confidence.",
    "Review your risk management; was the position size too large, causing fear?"
  ]
};

// Mock function to simulate an API call to an AI model
const getAIFeedback = (entry: JournalEntry): Promise<AIFeedback> => {
  console.log("Analyzing entry:", entry.title);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockAIFeedback);
    }, 1500);
  });
};

const getEmotionBadgeStyle = (emotion: string): string => {
    const lowerEmotion = emotion.toLowerCase();
    switch (lowerEmotion) {
        case 'anxious':
        case 'fearful':
        case 'frustrated':
            return 'bg-red-900/50 text-red-300 border-red-500/30';
        case 'overconfident':
        case 'hesitant':
            return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30';
        case 'disciplined':
        case 'confident':
        case 'patient':
            return 'bg-green-900/50 text-green-300 border-green-500/30';
        default:
            return 'bg-gray-700 text-gray-300 border-gray-500/30';
    }
};


const JournalCoach = ({ entry, onFeedbackReady }: JournalCoachProps) => {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!entry?.notes) {
        setFeedback(null);
        return;
    };

    setIsLoading(true);
    setFeedback(null);

    const timer = setTimeout(() => {
        getAIFeedback(entry).then(newFeedback => {
            setFeedback(newFeedback);
            if (onFeedbackReady) {
              onFeedbackReady(newFeedback);
            }
            setIsLoading(false);
        });
    }, 500); // Give a small buffer before fetching

    return () => clearTimeout(timer);

  }, [entry, onFeedbackReady]);

  if (!entry?.notes) {
    return null;
  }
  
  const renderContent = () => {
      if (isLoading) {
          return <div className="text-center text-white/50 animate-pulse">The AI coach is analyzing your entry...</div>;
      }

      if (!feedback) {
          return null;
      }
      
      return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                    <span role="img" aria-label="brain">🧠</span> AI Summary
                </h3>
                <p className="text-white/80 text-sm">{feedback.summary}</p>
            </div>
            <div>
                <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                    <span role="img" aria-label="masks">🎭</span> Dominant Emotion
                </h3>
                <div className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getEmotionBadgeStyle(feedback.emotion)}`}>
                    {feedback.emotion}
                </div>
            </div>
            <div>
                <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                    <span role="img" aria-label="light bulb">💡</span> Coaching Suggestions
                </h3>
                <ul className="space-y-2 text-sm text-white/80">
                    {feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="text-green-400 mt-1">✅</span>
                            <span>{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      );
  }

  return (
    <div className="rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow-lg min-h-[200px] flex items-center justify-center">
        {renderContent()}
    </div>
  );
};

export default JournalCoach; 