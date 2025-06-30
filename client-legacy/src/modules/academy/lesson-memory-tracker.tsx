import React from 'react';

interface LessonMemoryTrackerProps {
  userId: string;
  lessonId: string;
}

export const LessonMemoryTracker: React.FC<LessonMemoryTrackerProps> = ({ userId, lessonId }) => {
  return (
    <div className="lesson-memory-tracker">
      <h3>Memory Tracker</h3>
      <p>Tracking learning progress for user: {userId}</p>
      <p>Lesson: {lessonId}</p>
    </div>
  );
};

export default LessonMemoryTracker; 