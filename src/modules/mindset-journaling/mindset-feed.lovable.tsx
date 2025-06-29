// TODO: implement mindset insights feed
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Heart, Brain, Target } from 'lucide-react';

interface MindsetFeedProps {
  userId?: string;
}

export const MindsetFeed: React.FC<mindsetfeedprops  > = ({ userId }) => {
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
    <card  >
      <h2 className="text-2xl font-bold mb-4">Mindset Feed</h2>
      
      <scrollarea  >
        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getTypeColor(insight.type)}`}>
                    <icon  >
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {insight.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.content}
                    </p>
                    {insight.actionable && (
                      <badge variant="outline" style={{ fontSize: "0.75rem" }}>
                        Actionable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground text-center">
          Insights generated from your journal entries and trading patterns
        </p>
      </div>
    </Card>
  );
}; 
export const lovable = { component: true };
