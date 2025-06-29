
import React from 'react';

const DocsPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Documentation
        </h1>
        <p >
          Complete guide to Insight Flow
        </p>
      </div>

      {/* Documentation Sections */}
      <div  style={{ animationDelay: '100ms' }}>
        <div >
          <h2 style={{ fontWeight: "700" }}>📚 API Reference</h2>
          <div >
            <div >
              <div >GET /api/strategies</div>
              <div style={{ color: "#9CA3AF" }}>Fetch all strategies</div>
            </div>
            <div >
              <div >POST /api/backtest</div>
              <div style={{ color: "#9CA3AF" }}>Run strategy backtest</div>
            </div>
            <div >
              <div >GET /api/journal</div>
              <div style={{ color: "#9CA3AF" }}>Access journal entries</div>
            </div>
          </div>
        </div>

        <div >
          <h2 style={{ fontWeight: "700", color: "#9CA3AF" }}>🔧 SDK Examples</h2>
          <div >
            <div >
              <div >Python SDK</div>
              <div style={{ color: "#9CA3AF" }}>pip install insight-flow</div>
            </div>
            <div >
              <div >JavaScript SDK</div>
              <div style={{ color: "#9CA3AF" }}>npm install @insight/flow</div>
            </div>
            <div >
              <div >REST API</div>
              <div style={{ color: "#9CA3AF" }}>Direct HTTP requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>💻 Code Example</h2>
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
          <div ># Example: Create and backtest a strategy</div>
          <div style={{ color: "white" }}>
            <span >import</span> insight_flow <span >as</span> flow<br/>
            <br/>
            <span >strategy</span> = flow.Strategy()<br/>
            <span >strategy</span>.add_signal(<span >"RSI &lt; 30"</span>)<br/>
            <span >strategy</span>.add_exit(<span >"RSI &gt; 70"</span>)<br/>
            <br/>
            <span >results</span> = flow.backtest(<span >strategy</span>, <span >"2023-01-01"</span>, <span >"2024-01-01"</span>)<br/>
            <span >print</span>(<span >results</span>.summary())
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocsPage;
