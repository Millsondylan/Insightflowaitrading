
import React from 'react';

const StrategyExportPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Export Strategy
        </h1>
        <p >
          Share your trading strategies
        </p>
      </div>

      {/* Export Options */}
      <div  style={{ animationDelay: '100ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "32px" }}>📤 Export Formats</h2>
        <div >
          <div >
            <div style={{ fontSize: "1.875rem", marginBottom: "16px" }}>📄</div>
            <h3 >PDF Report</h3>
            <p style={{ marginBottom: "16px" }}>Comprehensive strategy documentation</p>
            <button style={{ paddingLeft: "16px", paddingRight: "16px" }}>
              Export PDF
            </button>
          </div>
          <div >
            <div style={{ fontSize: "1.875rem", marginBottom: "16px" }}>📊</div>
            <h3 >Excel Sheet</h3>
            <p style={{ marginBottom: "16px" }}>Data analysis and calculations</p>
            <button style={{ paddingLeft: "16px", paddingRight: "16px" }}>
              Export Excel
            </button>
          </div>
          <div >
            <div style={{ fontSize: "1.875rem", marginBottom: "16px" }}>🔗</div>
            <h3 >JSON Data</h3>
            <p style={{ marginBottom: "16px" }}>Machine-readable format</p>
            <button style={{ paddingLeft: "16px", paddingRight: "16px" }}>
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>⚙️ Export Settings</h2>
        <div >
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Include Backtest Results</span>
              <div style={{ border: "1px solid #374151" }}></div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Include Risk Metrics</span>
              <div style={{ border: "1px solid #374151" }}></div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Include Charts</span>
              <div style={{ border: "1px solid #374151" }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategyExportPage;
