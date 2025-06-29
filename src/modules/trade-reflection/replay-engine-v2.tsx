// TODO: implement trade replay with annotations
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Tag } from 'lucide-react';

interface ReplayEngineV2Props {
  tradeId: string;
}

export const ReplayEngineV2: React.FC<ReplayEngineV2Props> = ({ tradeId }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const [currentTime, setCurrentTime] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);
  const [annotations, setAnnotations] = React.useState<any[]>([]);

  const totalDuration = 300; // 5 minutes in seconds

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const addAnnotation = () => {
    const newAnnotation = {
      id: Date.now(),
      time: currentTime,
      type: 'manual',
      text: 'Custom annotation'
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  return (
    <Card className="theme-card p-6">
      <h2 className="text-2xl font-bold mb-4">Trade Replay</h2>
      
      <div className="space-y-4">
        {/* Chart placeholder */}
        <div className="bg-secondary/20 rounded-lg h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Chart visualization here</p>
        </div>

        {/* Playback controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline"
              size="icon"
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline"
              size="icon"
              onClick={togglePlayback}
           >
              {isPlaying ? <pause className="h-4 w-4" /> : <play className="h-4 w-4" />}
            </Button>
            <Button variant="outline"
              size="icon"
              onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <div className="flex-1 mx-4">
              <Slider
                value={[currentTime]}
                max={totalDuration}
                step={1}
                onValueChange={(value) => setCurrentTime(value[0])}
              />
            </div>
            <span className="text-sm text-muted-foreground min-w-[60px]">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              {[0.5, 1, 2, 4].map((s) => (
                <Button key={s}
                  variant={speed === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addAnnotation}>
              <Tag className="h-4 w-4 mr-2" />
              Add Annotation
            </Button>
          </div>
        </div>

        {/* Annotations */}
        {annotations.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Annotations</h3>
            {annotations.map((ann) => (
              <div key={ann.id} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {Math.floor(ann.time / 60)}:{(ann.time % 60).toString().padStart(2, '0')}
                </span>
                <span>{ann.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}; 