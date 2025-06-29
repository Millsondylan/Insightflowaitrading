import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const mockEntries = [
    { id: '1', title: "NVDA Earnings Play", pnl: 450.75, sentiment: 'Confident', date: '2 days ago', tags: ['NVDA', 'Earnings'] },
    { id: '2', title: "BTC Scalp", pnl: -120.50, sentiment: 'Anxious', date: '3 days ago', tags: ['BTC', 'Scalp'] },
    { id: '3', title: "SPY Hedging", pnl: 210.00, sentiment: 'Neutral', date: '5 days ago', tags: ['SPY', 'Hedge'] },
];

const JournalEntryCard = ({ entry }: { entry: (typeof mockEntries)[0] }) => {
    const pnlColor = entry.pnl >= 0 ? 'text-green-400' : 'text-red-400';
    return (
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <h4 style={{ color: "white" }}>{entry.title}</h4>
                <p className={`font-bold ${pnlColor}`}>{entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
                <p>{entry.sentiment} • {entry.date}</p>
                <div style={{ display: "flex" }}>
                    {entry.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </div>
        </div>
    );
};

export default function JournalPage() {
  const [newEntryText, setNewEntryText] = useState('');

  return (
    <div >
      {/* Main Content */}
      <div >
        <div style={{ display: "flex", alignItems: "center" }}>
            <div>
                <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
                    <span ><ScrollText  /></span>
                    Trading Journal
                </h1>
                <p style={{ color: "#9CA3AF" }}>Reflect on your trades and mindset.</p>
            </div>
        </div>
        
        {mockEntries.map(entry => <JournalEntryCard key={entry.id} entry={entry} />)}
      </div>

      {/* Right Sidebar */}
      <div >
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
            <h3 style={{ color: "white", display: "flex", alignItems: "center" }}>
                <span style={{fontSize: '16px'}}>➕</span>
                New Journal Entry
            </h3>
            <Textarea
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                placeholder="What's on your mind? Capture your thoughts on recent trades..."
                
            />
            <Button style={{ width: "100%" }}>Save Entry</Button>
        </div>

        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
            <h3 style={{ color: "white", marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <Bot size={18} />
                AI Coach
            </h3>
            <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Get personalized feedback on your journal entries.</p>
            <Link to="/coach">
                <Button variant="outline" style={{ width: "100%" }}>Ask for a Review</Button>
            </Link>
        </div>
        
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
            <h3 style={{ color: "white", marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <Rss size={18} />
                Insight Feed
            </h3>
            <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Discover insights based on your trading patterns.</p>
            <Link to="/feed">
                <Button variant="outline" style={{ width: "100%" }}>View Your Feed</Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
