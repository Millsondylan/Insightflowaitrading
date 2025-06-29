// TODO: implement trade replay with annotations
import React from 'react';

interface ReplayEngineV2Props {
  tradeId: string;
}

export const ReplayEngineV2: React.FC<ReplayEngineV2Props> = ({ tradeId }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
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
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Trade Replay</h2>
      
      <div >
        {/* Chart placeholder */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p >Chart visualization here</p>
        </div>

        {/* Playback controls */}
        <div >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            >
              <SkipBack  />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause  /> : <Play  />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}
            >
              <SkipForward  />
            </Button>
            <div >
              <Slider
                value={[currentTime]}
                max={totalDuration}
                step={1}
                onValueChange={(value) => setCurrentTime(value[0])}
              />
            </div>
            <span >
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Speed:</span>
              {[0.5, 1, 2, 4].map((s) => (
                <Button
                  key={s}
                  variant={speed === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addAnnotation}>
              <Tag  />
              Add Annotation
            </Button>
          </div>
        </div>

        {/* Annotations */}
        {annotations.length > 0 && (
          <div >
            <h3 >Annotations</h3>
            {annotations.map((ann) => (
              <div key={ann.id} style={{ display: "flex", alignItems: "center" }}>
                <span >
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