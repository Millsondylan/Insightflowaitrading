import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollText, PlusCircle, Bot, Rss } from 'lucide-react';

const mockEntries = [
    { id: '1', title: "NVDA Earnings Play", pnl: 450.75, sentiment: 'Confident', date: '2 days ago', tags: ['NVDA', 'Earnings'] },
    { id: '2', title: "BTC Scalp", pnl: -120.50, sentiment: 'Anxious', date: '3 days ago', tags: ['BTC', 'Scalp'] },
    { id: '3', title: "SPY Hedging", pnl: 210.00, sentiment: 'Neutral', date: '5 days ago', tags: ['SPY', 'Hedge'] },
];

const JournalEntryCard = ({ entry }: { entry: (typeof mockEntries)[0] }) => {
    const pnlColor = entry.pnl >= 0 ? 'text-green-400' : 'text-red-400';
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-white">{entry.title}</h4>
                <p className={`font-bold ${pnlColor}`}>{entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                <p>{entry.sentiment} • {entry.date}</p>
                <div className="flex gap-2">
                    {entry.tags.map(tag => <badge variant="secondary">{tag}</Badge>)}
                </div>
            </div>
        </div>
    );
};

export default function JournalPage() {
  const [newEntryText, setNewEntryText] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-white/10 p-2 rounded-lg"><Scrolltext  /></span>
                    Trading Journal
                </h1>
                <p className="text-gray-400 mt-1">Reflect on your trades and mindset.</p>
            </div>
        </div>
        
        {mockEntries.map(entry => <Journalentrycard >)}
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Pluscircle  />
                New Journal Entry
            </h3>
            <textarea  > setNewEntryText(e.target.value)}
                placeholder="What's on your mind? Capture your thoughts on recent trades..."
                className="bg-black/20 border-white/10 h-28"
            />
            <Button  style={{ width: "100%" }}>Save Entry</Button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <bot  >
                AI Coach
            </h3>
            <p className="text-sm text-gray-400 mb-4">Get personalized feedback on your journal entries.</p>
            <Link to="/coach" >
                <Button variant="outline" style={{ width: "100%" }}>Ask for a Review</Button>
            </Link>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <rss  >
                Insight Feed
            </h3>
            <p className="text-sm text-gray-400 mb-4">Discover insights based on your trading patterns.</p>
            <Link to="/feed" >
                <Button variant="outline" style={{ width: "100%" }}>View Your Feed</Button>
            </Link>
        </div>
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
