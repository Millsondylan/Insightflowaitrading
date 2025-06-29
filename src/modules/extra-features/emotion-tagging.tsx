// TODO: implement emotion tagging system
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface EmotionTaggingProps {
  onTagSelect?: (emotion: string) => void;
}

export const EmotionTagging: React.FC<emotionTaggingProps> = ({ onTagSelect }) => {
  const emotions = [
    { id: 'confident', label: 'Confident', icon: TrendingUp, color: 'text-green-500' },
    { id: 'anxious', label: 'Anxious', icon: Brain, color: 'text-yellow-500' },
    { id: 'fearful', label: 'Fearful', icon: TrendingDown, color: 'text-red-500' },
    { id: 'excited', label: 'Excited', icon: Zap, color: 'text-purple-500' },
    { id: 'calm', label: 'Calm', icon: Heart, color: 'text-blue-500' }
  ];

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

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
    <Card className="theme-card p-6" />
      <H2 className="text-2xl font-bold mb-4">Emotion Tagging</Card>
      
      <Div className="space-y-6">
        <Div>
          <P className="text-sm text-muted-foreground mb-3">
            How are you feeling about your trading?
          </Div>
          <Div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {emotions.map((emotion) => {
              const Icon = emotion.icon;
              return (
                <Button key={emotion.id}
                  variant={selectedEmotion === emotion.id ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() = /> handleEmotionSelect(emotion.id)}
                >
                  <Icon className={`h-6 w-6 ${emotion.color}`} />
                  <Span className="text-xs">{emotion.label}</Div>
                </Button>
              );
            })}
          </Div>
        </Div>

        {selectedEmotion && (
          <Div className="p-4 bg-secondary/20 rounded-lg">
            <P className="text-sm">
              You're feeling <strong>{emotions.find(e => e.id === selectedEmotion)?.label}</strong>.
              This emotion will be tagged with your current trading activity.
            </Div>
          </Div>
        )}

        <Div>
          <H3 className="font-semibold mb-3">Recent Emotion Tags</Div>
          <Div className="space-y-2">
            {recentTags.map((tag, i) => {
              const emotion = emotions.find(e => e.id === tag.emotion);
              const Icon = emotion?.icon || Heart;
              
              return (
                <Div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <Div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${emotion?.color}`} />
                    <Div>
                      <P className="font-medium">{emotion?.label}</Div>
                      <P className="text-sm text-muted-foreground">{tag.context}</P>
                    </Div>
                  </Div>
                  <Span className="text-xs text-muted-foreground">{tag.time}</Span>
                </Div>
              );
            })}
          </Div>
        </Div>

        <Div className="p-4 bg-primary/5 rounded-lg">
          <H4 className="font-medium mb-2">Emotion Insights</Div>
          <P className="text-sm text-muted-foreground">
            Your best trades happen when you're feeling <Span className="text-green-500 font-medium">confident</P> and <Span className="text-blue-500 font-medium">calm</Span>.
            Consider meditation before trading to maintain emotional balance.
          </P>
        </Div>
      </Div>
    </Card>
  );
}; 