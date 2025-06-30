import React from 'react';

interface LessonPlaygroundProps {
  lessonId: string;
  content: string;
}

export const LessonPlayground: React.FC<LessonPlaygroundProps> = ({ lessonId, content }) => {
  return (
    <div className="lesson-playground">
      <h3>Lesson Playground</h3>
      <p>Interactive lesson content for: {lessonId}</p>
      <div className="content">{content}</div>
    </div>
  );
};

export default LessonPlayground; 