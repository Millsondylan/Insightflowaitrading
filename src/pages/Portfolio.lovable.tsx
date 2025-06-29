
import React from 'react';

const PortfolioPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Portfolio Vision
        </h1>
        <p >
          Your investments at a glance
        </p>
      </div>

      {/* Portfolio Overview */}
      <div  style={{ animationDelay: '100ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "32px" }}>📊 Overview</h2>
        <div >
          <div >
            <div style={{ fontWeight: "700" }}>$125,430</div>
            <div style={{ color: "#9CA3AF" }}>Total Value</div>
          </div>
          <div >
            <div style={{ fontWeight: "700" }}>+12.5%</div>
            <div style={{ color: "#9CA3AF" }}>Daily Change</div>
          </div>
          <div >
            <div style={{ fontWeight: "700" }}>8</div>
            <div style={{ color: "#9CA3AF" }}>Positions</div>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>💼 Holdings</h2>
        <div >
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <div style={{ color: "white" }}>TSLA</div>
                <div style={{ color: "#9CA3AF" }}>50 shares</div>
              </div>
              <div >
                <div >+5.2%</div>
                <div >$12,450</div>
              </div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <div style={{ color: "white" }}>NVDA</div>
                <div style={{ color: "#9CA3AF" }}>25 shares</div>
              </div>
              <div >
                <div >-2.1%</div>
                <div >$8,750</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPage;
