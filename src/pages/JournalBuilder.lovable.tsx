
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const JournalBuilderPage: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <ScrollSection style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} delay={0}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
            Your Trading Mind, Captured
          </h1>
          <p >
            Record, reflect, and evolve your trading psychology
          </p>
          <div >
            <div style={{ marginLeft: "auto", marginRight: "auto" }}></div>
          </div>
        </div>
      </ScrollSection>

      {/* New Entry Section */}
      <ScrollSection  delay={100}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <div style={{ marginBottom: "32px" }}>
              <div style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
                📝 New Journal Entry
              </div>
              <h2 style={{ fontSize: "1.875rem", marginBottom: "16px" }}>
                Document Your Journey
              </h2>
            </div>
            
            {/* Form Grid */}
            <div >
              <div >
                <label >Trade Symbol</label>
                <div style={{ borderRadius: "0.75rem", border: "1px solid #374151" }}></div>
              </div>
              <div >
                <label >Entry Price</label>
                <div style={{ borderRadius: "0.75rem", border: "1px solid #374151" }}></div>
              </div>
              <div >
                <label >Exit Price</label>
                <div style={{ borderRadius: "0.75rem", border: "1px solid #374151" }}></div>
              </div>
            </div>
            
            <div >
              <label >Trade Reflection</label>
              <div style={{ borderRadius: "0.75rem", border: "1px solid #374151" }}></div>
            </div>
            
            <div >
              <button >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Recent Entries Timeline */}
      <ScrollSection  delay={200} animation="slide-right">
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <h3 style={{ fontSize: "1.875rem", marginBottom: "16px" }}>📓 Recent Entries</h3>
            <div style={{ marginLeft: "auto", marginRight: "auto" }}></div>
          </div>
          
          <div style={{ marginTop: "32px" }}>
            {/* Entry Card 1 */}
            <div >
              <div style={{ display: "flex", marginBottom: "16px" }}>
                <div>
                  <h4 style={{ color: "white" }}>TSLA Momentum Play</h4>
                  <p style={{ color: "#9CA3AF" }}>January 15, 2024</p>
                </div>
                <div >
                  <div >🟢 Bullish</div>
                  <div style={{ fontWeight: "700" }}>+12.5%</div>
                </div>
              </div>
              <p >
                Journal entry reflection placeholder text about the trade psychology and decision-making process...
              </p>
            </div>

            {/* Entry Card 2 */}
            <div >
              <div style={{ display: "flex", marginBottom: "16px" }}>
                <div>
                  <h4 style={{ color: "white" }}>SPY Put Hedge</h4>
                  <p style={{ color: "#9CA3AF" }}>January 12, 2024</p>
                </div>
                <div >
                  <div >🔴 Bearish</div>
                  <div style={{ fontWeight: "700" }}>-3.2%</div>
                </div>
              </div>
              <p >
                Another journal entry placeholder reflecting on risk management and emotional discipline...
              </p>
            </div>

            {/* Entry Card 3 */}
            <div >
              <div style={{ display: "flex", marginBottom: "16px" }}>
                <div>
                  <h4 style={{ color: "white" }}>NVDA Breakout</h4>
                  <p style={{ color: "#9CA3AF" }}>January 10, 2024</p>
                </div>
                <div >
                  <div >🟢 Bullish</div>
                  <div style={{ fontWeight: "700" }}>+8.7%</div>
                </div>
              </div>
              <p >
                Trade psychology notes and lessons learned from this successful momentum trade...
              </p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Insights Section */}
      <ScrollSection  delay={300} animation="scale-in">
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <h4 >🧠 AI Insights</h4>
            <p style={{ marginBottom: "32px" }}>
              Your trading patterns and psychological trends are being analyzed to help you improve
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
                Risk Management: Strong
              </div>
              <div style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
                Patience Level: Improving
              </div>
              <div style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
                FOMO Tendency: Monitor
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default JournalBuilderPage;
