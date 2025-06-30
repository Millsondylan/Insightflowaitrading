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
    <div>
      <Link to="/journal" style={{ display: "flex", alignItems: "center" }}>
        <ArrowLeft>
        Back to Journal
      </div>
      
      <div className="space-y-6">
        <header>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/10 p-2 rounded-lg"><Rss /></div>
                Your Insight Feed
            </h1>
            <p className="text-gray-400 mt-1">Personalized insights generated from your trading activity.</p />

        {mockInsights.map(insight => (
            <div key={insight.id} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm flex justify-between items-center">
                <p className="text-gray-200">{insight.text}</p>
                <Button variant="ghost" size="icon">
                    <Eye /></button></div>
                </button>
            </div>
        ))}
      </div>
    </div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
