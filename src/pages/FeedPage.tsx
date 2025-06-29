import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rss, Eye } from 'lucide-react';

const mockInsights = [
    { id: 1, text: "You tend to over-leverage on Tuesday mornings. Consider reducing your position size." },
    { id: 2, text: "Your highest win rate is on tickers in the Technology sector." },
    { id: 3, text: "A 15-minute meditation before market open correlates with a 5% increase in your profitability." },
];

export default function FeedPage() {
  return (
    <Div>
      <Link to="/journal" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors" />
        <ArrowLeft size={16} />
        Back to Journal
      </Div>
      
      <Div className="space-y-6">
        <Header>
            <H1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Span className="bg-white/10 p-2 rounded-lg"><Rss className="text-blue-400" /></Div>
                Your Insight Feed
            </H1>
            <P className="text-gray-400 mt-1">Personalized insights generated from your trading activity.</p />

        {mockInsights.map(insight => (
            <Div key={insight.id} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm flex justify-between items-center">
                <P className="text-gray-200">{insight.text}</P>
                <Button variant="ghost" size="icon" />
                    <Eye size={18} /></Button></Button></Button></Button></Button></Button></Button></Button></Button></Button>
                </Button>
            </Div>
        ))}
      </Div>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 