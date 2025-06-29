import React from 'react';
import { Link } from 'react-router-dom';

export default function CoachPage() {
  return (
    <div>
      <Link to="/journal" style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
        <ArrowLeft size={16} />
        Back to Journal
      </Link>
      
      <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "32px" }}>
        <header style={{ display: "flex", marginBottom: "32px" }}>
            <div>
                <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
                    <span ><Bot  /></span>
                    AI Coach
                </h1>
                <p style={{ color: "#9CA3AF" }}>Get feedback on your trading mindset and decisions.</p>
            </div>
        </header>

        <div >
            <div style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
                {/* Mock chat messages */}
                <div style={{ display: "flex" }}>
                    <div style={{ color: "white" }}>
                        I took a loss on NVDA and I'm feeling anxious about my strategy.
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ color: "white" }}>
                        <Sparkles  />
                        It's understandable to feel that way. Let's break down the trade. What were the entry conditions?
                    </div>
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <Textarea placeholder="Ask your coach anything..." />
                <Button >Send</Button>
            </div>
        </div>
      </div>
    </div>
  );
} 