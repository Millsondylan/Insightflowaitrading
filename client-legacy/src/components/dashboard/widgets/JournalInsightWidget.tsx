import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Lightbulb, TrendingUp } from 'lucide-react';

interface JournalInsight {
  id: string;
  title: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
  tags: string[];
}

interface JournalInsightWidgetProps {
  insights?: JournalInsight[];
}

const JournalInsightWidget: React.FC<JournalInsightWidgetProps> = ({ 
  insights = [
    {
      id: '1',
      title: 'Improved Risk Management',
      content: 'Your recent trades show better position sizing and stop loss placement.',
      sentiment: 'positive',
      date: '2 days ago',
      tags: ['risk', 'improvement']
    },
    {
      id: '2',
      title: 'Emotional Control',
      content: 'You maintained discipline during market volatility, avoiding impulsive trades.',
      sentiment: 'positive',
      date: '1 week ago',
      tags: ['psychology', 'discipline']
    }
  ]
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return 'text-white/60';
      default: return 'text-white/60';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingUp className="h-4 w-4 rotate-180" />;
      case 'neutral': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-cyan-400" />
          Journal Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-medium text-sm">{insight.title}</h4>
              <div className={`flex items-center gap-1 ${getSentimentColor(insight.sentiment)}`}>
                {getSentimentIcon(insight.sentiment)}
              </div>
            </div>
            <p className="text-white/60 text-xs mb-2">{insight.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {insight.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-white/40 text-xs">{insight.date}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default JournalInsightWidget;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 