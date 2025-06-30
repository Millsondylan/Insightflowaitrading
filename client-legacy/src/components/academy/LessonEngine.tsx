
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lesson } from '@/lib/academy/lessonSchema';

interface LessonEngineProps {
  lesson: Lesson;
}

const LessonEngine: React.FC<LessonEngineProps> = ({ lesson }) => {
  return (
    <div className="space-y-6">
      {lesson.sections.map((section) => (
        <Card key={section.id} className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.blocks.map((block) => (
              <div key={block.id} className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{block.title}</h3>
                <p className="text-gray-300">{block.content}</p>
                {block.keyTakeaways.length > 0 && (
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    {block.keyTakeaways.map((takeaway, index) => (
                      <li key={index}>{takeaway}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LessonEngine;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
