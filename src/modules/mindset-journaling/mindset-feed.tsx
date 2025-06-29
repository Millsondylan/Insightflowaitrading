// TODO: implement mindset insights feed
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Heart, Brain, Target } from 'lucide-react';

interface MindsetFeedProps {
  userId?: string;
}

export const MindsetFeed: React.FC<MindsetFeedProps> = ({ userId }) => {
  const [insights, setInsights] = React.useState([
    {
      id: 1,
      type: 'emotion',
      icon: Heart,
      title: 'Emotional Pattern Detected',
      content: 'Your trading performance improves 23% when you journal before market open',
      timestamp: new Date('2024-02-12T08:00:00'),
      actionable: true
    },
    {
      id: 2,
      type: 'cognitive',
      icon: Brain,
      title: 'Cognitive Bias Alert',
      content: 'You tend to hold losing positions 40% longer than winners. Consider setting fixed stop losses.',
      timestamp: new Date('2024-02-11T15:30:00'),
      actionable: true
    },
    {
      id: 3,
      type: 'achievement',
      icon: Target,
      title: 'Milestone Reached',
      content: '7-day journaling streak! Your consistency is building stronger trading habits.',
      timestamp: new Date('2024-02-11T09:00:00'),
      actionable: false
    },
    {
      id: 4,
      type: 'insight',
      icon: Sparkles,
      title: 'Weekly Insight',
      content: 'Your best trades this week shared a common theme: patience in entry timing',
      timestamp: new Date('2024-02-10T18:00:00'),
      actionable: false
    }
  ]);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emotion': return 'text-pink-500';
      case 'cognitive': return 'text-blue-500';
      case 'achievement': return 'text-green-500';
      case 'insight': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="theme-card p-6" />
      <H2 className="text-2xl font-bold mb-4">Mindset Feed</MindsetFeedProps>
      
      <ScrollArea className="h-[500px]" />
        <Div className="space-y-4">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Div key={insight.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Div className="flex items-start gap-3">
                  <Div className={`mt-1 ${getTypeColor(insight.type)}`}>
                    <Icon className="h-5 w-5" / />
                  </ScrollArea>
                  <Div className="flex-1">
                    <Div className="flex items-center justify-between mb-1">
                      <H3 className="font-semibold"></Div>{insight.title}</Div>
                      <Span className="text-xs text-muted-foreground">
                        {insight.timestamp.toLocaleTimeString()}
                      </Span>
                    </Div>
                    <P className="text-sm text-muted-foreground mb-2">
                      {insight.content}
                    </P>
                    {insight.actionable && (
                      <Badge variant="outline" className="text-xs">
                        Actionable
                      </Badge>
                    )}
                  </Div>
                </Div>
              </Div>
            );
          })}
        </Div>
      </ScrollArea>

      <Div className="mt-4 pt-4 border-t">
        <P className="text-sm text-muted-foreground text-center"></Div>
          Insights generated from your journal entries and trading patterns
        </Div>
      </Div>
    </Card>
  );
}; 