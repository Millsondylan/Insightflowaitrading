
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface LessonNarratorProps {
  lesson: {
    id: string;
    title: string;
    content: string;
  };
}

const LessonNarrator: React.FC<LessonNarratorProps> = ({ lesson }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSection(0);
  };

  return (
    <Card className="bg-black/30 border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Lesson Narrator</h3>
          <div className="flex gap-2">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="sm"
              className="text-white border-white/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="text-white border-white/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-white/80">
          <p className="text-sm">
            AI-powered lesson narration for {lesson.title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonNarrator;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
