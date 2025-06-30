import React from 'react';

interface NarratorInjectionProps {
  content: string;
  style?: 'friendly' | 'professional' | 'enthusiastic';
}

export const NarratorInjection: React.FC<NarratorInjectionProps> = ({ content, style = 'friendly' }) => {
  return (
    <div className="narrator-injection">
      <h3>Narrator ({style})</h3>
      <p>{content}</p>
    </div>
  );
};

export default NarratorInjection; 