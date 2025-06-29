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
      <Link to="/journal" style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
        <ArrowLeft size={16} />
        Back to Journal
      </Link>
      
      <div >
        <header>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
                <span ><Rss  /></span>
                Your Insight Feed
            </h1>
            <p style={{ color: "#9CA3AF" }}>Personalized insights generated from your trading activity.</p>
        </header>

        {mockInsights.map(insight => (
            <div key={insight.id} style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center" }}>
                <p >{insight.text}</p>
                <Button variant="ghost" size="icon">
                    <span style={{fontSize: '16px'}}>👁️</span>
                </Button>
            </div>
        ))}
      </div>
    </div>
  );
} 