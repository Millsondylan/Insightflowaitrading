import React from 'react';

type Props = {
  summary: string;
  emotion: string;
  suggestions: string[];
};

const emotionStyles: { [key: string]: string } = {
  Disciplined: 'bg-green-700 text-white',
  Aggressive: 'bg-red-700 text-white',
  Fearful: 'bg-yellow-600 text-yellow-100',
  Neutral: 'bg-blue-700 text-white',
};

const getEmotionStyle = (emotion: string) => {
  return emotionStyles[emotion] || 'bg-gray-600 text-gray-100';
};

const StrategySummaryAI = ({ summary, emotion, suggestions }: Props) => {
  return (
    <div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-white/90">AI Analysis</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionStyle(emotion)}`}>
          {emotion}
        </span>
      </div>
      
      <p className="italic text-white/80">
        "{summary}"
      </p>

      {suggestions && suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-white/80 mb-2">💡 Suggestions</h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-white/70">
                <span className="mt-1">✅</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StrategySummaryAI; 