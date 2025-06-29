
import React from 'react';

const ProfileRiskMapPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Risk Profile Map
        </h1>
        <p >
          Visualize your risk distribution
        </p>
      </div>

      {/* Radial Risk Map */}
      <div  style={{ animationDelay: '100ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "32px" }}>🎯 Risk Quadrants</h2>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ marginLeft: "auto", marginRight: "auto" }}>
            {/* Center Circle */}
            <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span >Core</span>
            </div>

            {/* Quadrant 1 - High Return, High Risk */}
            <div style={{ border: "1px solid #374151", display: "flex", padding: "24px" }}>
              <div >
                <div >High Risk</div>
                <div >High Return</div>
              </div>
            </div>

            {/* Quadrant 2 - High Return, Low Risk */}
            <div style={{ border: "1px solid #374151", display: "flex", padding: "24px" }}>
              <div >
                <div >Low Risk</div>
                <div >High Return</div>
              </div>
            </div>

            {/* Quadrant 3 - Low Return, Low Risk */}
            <div style={{ border: "1px solid #374151", display: "flex", padding: "24px" }}>
              <div >
                <div >Low Risk</div>
                <div >Low Return</div>
              </div>
            </div>

            {/* Quadrant 4 - Low Return, High Risk */}
            <div style={{ border: "1px solid #374151", display: "flex", padding: "24px" }}>
              <div >
                <div >High Risk</div>
                <div >Low Return</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>📊 Risk Metrics</h2>
        <div >
          <div >
            <div style={{ fontWeight: "700" }}>2.4</div>
            <div style={{ color: "#9CA3AF" }}>Sharpe Ratio</div>
          </div>
          <div >
            <div style={{ fontWeight: "700" }}>-8.5%</div>
            <div style={{ color: "#9CA3AF" }}>Max Drawdown</div>
          </div>
          <div >
            <div style={{ fontWeight: "700" }}>0.65</div>
            <div style={{ color: "#9CA3AF" }}>Beta</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileRiskMapPage;
