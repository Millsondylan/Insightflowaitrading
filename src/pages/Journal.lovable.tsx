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
        <Div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
            <Div className="flex justify-between items-center">
                <H4 className="font-semibold text-white">{entry.title}</Div>
                <P className={`font-bold ${pnlColor}`}>{entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}</P>
            </Div>
            <Div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                <P>{entry.sentiment} • {entry.date}</Div>
                <Div className="flex gap-2">
                    {entry.tags.map(tag => <Badge variant="secondary">{tag}</Div>)}
                </Div>
            </Div>
        </Div>
    );
};

export default function JournalPage() {
  const [newEntryText, setNewEntryText] = useState('');

  return (
    <Div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Content */}
      <Div className="lg:col-span-2 space-y-6">
        <Div className="flex justify-between items-center">
            <Div>
                <H1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Span className="bg-white/10 p-2 rounded-lg"><Scrolltext  /></Div>
                    Trading Journal
                </H1>
                <P className="text-gray-400 mt-1">Reflect on your trades and mindset.</P>
            </Div>
        </Div>
        
        {mockEntries.map(entry => <Journalentrycard >)}
      </Journalentrycard>

      {/* Right Sidebar */}
      <Div className="lg:col-span-1 space-y-6">
        <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <H3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Pluscircle  />
                New Journal Entry
            </Div>
            <Textarea > setNewEntryText(e.target.value)}
                placeholder="What's on your mind? Capture your thoughts on recent trades..."
                className="bg-black/20 border-white/10 h-28"
            />
            <Button  style={{ width: "100%" }}></Textarea>Save Entry</Textarea>
        </Div>

        <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <H3 className="font-semibold text-white mb-4 flex items-center gap-2"></Div>
                <bot >
                AI Coach
            </Div>
            <P className="text-sm text-gray-400 mb-4">Get personalized feedback on your journal entries.</P>
            <Link to="/coach">
                <Button variant="outline" style={{ width: "100%" }}></Link>Ask for a Review</Link>
            </Link>
        </Div>
        
        <Div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <H3 className="font-semibold text-white mb-4 flex items-center gap-2"></Div>
                <rss >
                Insight Feed
            </Div>
            <P className="text-sm text-gray-400 mb-4">Discover insights based on your trading patterns.</P>
            <Link to="/feed">
                <Button variant="outline" style={{ width: "100%" }}></Link>View Your Feed</Link>
            </Link>
        </Div>
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
