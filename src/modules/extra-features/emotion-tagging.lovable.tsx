// TODO: implement emotion tagging system
import React from 'react';

interface EmotionTaggingProps {
  onTagSelect?: (emotion: string) => void;
}

export const EmotionTagging: React.FC<EmotionTaggingProps> = ({ onTagSelect }) => {
  const emotions = [
    { id: 'confident', label: 'Confident', icon: TrendingUp, color: 'text-green-500' },
    { id: 'anxious', label: 'Anxious', icon: Brain, color: 'text-yellow-500' },
    { id: 'fearful', label: 'Fearful', icon: TrendingDown, color: 'text-red-500' },
    { id: 'excited', label: 'Excited', icon: Zap, color: 'text-purple-500' },
    { id: 'calm', label: 'Calm', icon: Heart, color: 'text-blue-500' }
  ];

  const [selectedEmotion, setSelectedEmotion] = React.useState<string | null>(null);
  const [recentTags, setRecentTags] = React.useState([
    { emotion: 'confident', context: 'After successful BTC trade', time: '2 hours ago' },
    { emotion: 'anxious', context: 'Before FOMC announcement', time: '1 day ago' },
    { emotion: 'calm', context: 'During morning routine', time: '2 days ago' }
  ]);

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    onTagSelect?.(emotionId);
    // TODO: Connect to tagEmotion function
  };

  return (
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Emotion Tagging</h2>
      
      <div >
        <div>
          <p >
            How are you feeling about your trading?
          </p>
          <div >
            {emotions.map((emotion) => {
              const Icon = emotion.icon;
              return (
                <Button
                  key={emotion.id}
                  variant={selectedEmotion === emotion.id ? 'default' : 'outline'}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  onClick={() => handleEmotionSelect(emotion.id)}
                >
                  <Icon className={`h-6 w-6 ${emotion.color}`} />
                  <span >{emotion.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {selectedEmotion && (
          <div style={{ padding: "16px" }}>
            <p >
              You're feeling <strong>{emotions.find(e => e.id === selectedEmotion)?.label}</strong>.
              This emotion will be tagged with your current trading activity.
            </p>
          </div>
        )}

        <div>
          <h3 >Recent Emotion Tags</h3>
          <div >
            {recentTags.map((tag, i) => {
              const emotion = emotions.find(e => e.id === tag.emotion);
              const Icon = emotion?.icon || Heart;
              
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", border: "1px solid #374151" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Icon className={`h-5 w-5 ${emotion?.color}`} />
                    <div>
                      <p >{emotion?.label}</p>
                      <p >{tag.context}</p>
                    </div>
                  </div>
                  <span >{tag.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "16px" }}>
          <h4 >Emotion Insights</h4>
          <p >
            Your best trades happen when you're feeling <span >confident</span> and <span >calm</span>.
            Consider meditation before trading to maintain emotional balance.
          </p>
        </div>
      </div>
    </Card>
  );
}; 