
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface ReplayPlayerProps {
  data: any[];
  onPositionChange?: (position: number) => void;
}

const ReplayPlayer = ({ data, onPositionChange }: ReplayPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && position < data.length - 1) {
      interval = setInterval(() => {
        setPosition(prev => {
          const newPos = prev + 1;
          onPositionChange?.(newPos);
          return newPos;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, position, speed, data.length, onPositionChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setPosition(0);
    setIsPlaying(false);
    onPositionChange?.(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trade Replay</CardTitle>
        <CardDescription>
          <p>Replay your trades step by step to analyze your decisions</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress: {position + 1} / {data.length}</span>
            <span>Speed: {speed}x</span>
          </div>
          <Progress value={(position / (data.length - 1)) * 100} className="w-full" />
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={handlePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 0.5 : 1)}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReplayPlayer;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
