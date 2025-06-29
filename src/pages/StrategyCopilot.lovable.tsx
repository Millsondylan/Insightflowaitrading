
import React from 'react';

const StrategyCopilotPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Strategy Copilot
        </h1>
        <p >
          AI-powered strategy assistance
        </p>
      </div>

      {/* Question Blocks */}
      <div  style={{ animationDelay: '100ms' }}>
        <div >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span >?</span>
            </div>
            <div >
              <h3 >Strategy Analysis</h3>
              <p style={{ marginBottom: "16px" }}>What market conditions favor your current approach?</p>
              <div style={{ display: "flex" }}>
                <button style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
                  Bullish
                </button>
                <button style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
                  Bearish
                </button>
                <button style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
                  Sideways
                </button>
              </div>
            </div>
          </div>
        </div>

        <div >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span >💡</span>
            </div>
            <div >
              <h3 >Risk Management</h3>
              <p style={{ marginBottom: "16px" }}>Optimize your position sizing and stop-loss levels</p>
              <div >
                <div ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>🎯 AI Suggestions</h2>
        <div >
          <div >
            <h4 >Entry Signal</h4>
            <p >Consider entering long positions on RSI oversold conditions with volume confirmation</p>
          </div>
          <div >
            <h4 >Exit Strategy</h4>
            <p >Trail stops at 1.5x ATR to capture momentum while protecting gains</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategyCopilotPage;
