import React from 'react';
import { Link } from 'react-router-dom';

const mockInsights = [
    { id: 1, text: "You tend to over-leverage on Tuesday mornings. Consider reducing your position size." },
    { id: 2, text: "Your highest win rate is on tickers in the Technology sector." },
    { id: 3, text: "A 15-minute meditation before market open correlates with a 5% increase in your profitability." },
];

export default function FeedPage() {
  return (
    <div>
      <Link to="/journal" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Journal
      </Link>
      
      <div className="space-y-6">
        <header>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/10 p-2 rounded-lg"><Rss className="text-blue-400" /></span>
                Your Insight Feed
            </h1>
            <p className="text-gray-400 mt-1">Personalized insights generated from your trading activity.</p>
        </header>

        {mockInsights.map(insight => (
            <div key={insight.id} className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm flex justify-between items-center">
                <p className="text-gray-200">{insight.text}</p>
                <Button variant="ghost" size="icon">
                    <span style={{fontSize: '16px'}}>👁️</span>
                </Button>
            </div>
        ))}
      </div>
    </div>
  );
} 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default $(basename "${FILE%.*}" | sed 's/\.lovable//');
