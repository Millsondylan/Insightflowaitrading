
// TODO: implement emotion tagging system
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Zap, TrendingUp, TrendingDown } from 'lucide-react';

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
    <Card className="theme-card p-6">
      <h2 className="text-2xl font-bold mb-4">Emotion Tagging</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            How are you feeling about your trading?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {emotions.map((emotion) => {
              const Icon = emotion.icon;
              return (
                <Button key={emotion.id}
                  variant={selectedEmotion === emotion.id ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handleEmotionSelect(emotion.id)}
                >
                  <Icon className={`h-6 w-6 ${emotion.color}`}/>
                  <span className="text-xs">{emotion.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {selectedEmotion && (
          <div className="p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm">
              You're feeling <strong>{emotions.find(e => e.id === selectedEmotion)?.label}</strong>.
              This emotion will be tagged with your current trading activity.
            </p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-3">Recent Emotion Tags</h3>
          <div className="space-y-2">
            {recentTags.map((tag, i) => {
              const emotion = emotions.find(e => e.id === tag.emotion);
              const Icon = emotion?.icon || Heart;
              
              return (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${emotion?.color}`} />
                    <div>
                      <p className="font-medium">{emotion?.label}</p>
                      <p className="text-sm text-muted-foreground">{tag.context}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{tag.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg">
          <h4 className="font-medium mb-2">Emotion Insights</h4>
          <p className="text-sm text-muted-foreground">
            Your best trades happen when you're feeling <span className="text-green-500 font-medium">confident</span> and <span className="text-blue-500 font-medium">calm</span>.
            Consider meditation before trading to maintain emotional balance.
          </p>
        </div>
      </div>
    </Card>
  );
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
