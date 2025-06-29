
import React from 'react';

const BacktestReplayPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Backtest Replay
        </h1>
        <p >
          Relive your trading decisions
        </p>
      </div>

      {/* Timeline Container */}
      <div  style={{ animationDelay: '100ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "32px" }}>⏱️ Trading Timeline</h2>
        <div >
          {/* Timeline Line */}
          <div ></div>
          
          {/* Timeline Events */}
          <div style={{ marginTop: "32px" }}>
            <div style={{ display: "flex" }}>
              <div ></div>
              <div >
                <div style={{ display: "flex" }}>
                  <span >Entry Signal</span>
                  <span style={{ color: "#9CA3AF" }}>09:30 AM</span>
                </div>
                <p >Long TSLA @ $245.50 - RSI oversold + volume spike</p>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div ></div>
              <div >
                <div style={{ display: "flex" }}>
                  <span >Price Movement</span>
                  <span style={{ color: "#9CA3AF" }}>10:15 AM</span>
                </div>
                <p >+2.3% move to $251.15 - Following support trend</p>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div ></div>
              <div >
                <div style={{ display: "flex" }}>
                  <span >Exit Signal</span>
                  <span style={{ color: "#9CA3AF" }}>11:45 AM</span>
                </div>
                <p >Closed @ $248.90 - Resistance hit, +1.4% gain</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replay Controls */}
      <div  style={{ animationDelay: '200ms' }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button style={{ border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span >⏮️</span>
          </button>
          <button style={{ border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span >▶️</span>
          </button>
          <button style={{ border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span >⏭️</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BacktestReplayPage;
