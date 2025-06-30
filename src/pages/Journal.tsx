import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollText, PlusCircle, Bot, Rss } from 'lucide-react';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
                    {entry.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Journal = () => {
  const handleSubmit = (entry: any) => {
    console.log('Journal entry submitted:', entry);
    // In a real app, this would save to the database
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8 leading-tight">
            Trading Journal
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track your trades, analyze your performance, and learn from your experiences 
            with our AI-powered trading journal.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Journal Entry Form */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">New Journal Entry</h2>
              <JournalEntryForm onSubmit={handleSubmit}/>
            </div>
            
            {/* Recent Entries */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Entries</h2>
              <div className="space-y-4">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">EUR/USD Long Position</CardTitle>
                    <Badge className="w-fit bg-green-500/20 text-green-400">Profitable</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Entered long position based on bullish divergence on 4H chart. 
                      Exit was clean with 2:1 RR ratio.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">GBP/JPY Short Position</CardTitle>
                    <Badge className="w-fit bg-red-500/20 text-red-400">Loss</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Stopped out due to unexpected news event. 
                      Need to check economic calendar more carefully.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
