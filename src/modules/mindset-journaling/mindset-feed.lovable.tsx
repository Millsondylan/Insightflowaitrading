// TODO: implement mindset insights feed
import React from 'react';

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
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Mindset Feed</h2>
      
      <ScrollArea >
        <div >
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} style={{ padding: "16px", border: "1px solid #374151" }}>
                <div style={{ display: "flex" }}>
                  <div className={`mt-1 ${getTypeColor(insight.type)}`}>
                    <Icon  />
                  </div>
                  <div >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h3 >{insight.title}</h3>
                      <span >
                        {insight.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p >
                      {insight.content}
                    </p>
                    {insight.actionable && (
                      <Badge variant="outline" >
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

      <div >
        <p >
          Insights generated from your journal entries and trading patterns
        </p>
      </div>
    </Card>
  );
}; 