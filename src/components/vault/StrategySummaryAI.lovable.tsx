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
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151" }}>
      <div style={{ display: "flex" }}>
        <h3 >AI Analysis</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionStyle(emotion)}`}>
          {emotion}
        </span>
      </div>
      
      <p >
        "{summary}"
      </p>

      {suggestions && suggestions.length > 0 && (
        <div>
          <h4 >💡 Suggestions</h4>
          <ul >
            {suggestions.map((suggestion, index) => (
              <li key={index} style={{ display: "flex" }}>
                <span >✅</span>
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