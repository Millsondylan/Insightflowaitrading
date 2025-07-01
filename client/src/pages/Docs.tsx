import React from 'react';

const DocsPage: React.FC = () => {
  return (
    <section className="theme-docs min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-slate mb-8">
          Documentation
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Complete guide to Insight Flow
        </p>
      </div>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow">
          <h2 className="text-2xl font-bold text-slate-400 mb-6">📚 API Reference</h2>
          <div className="space-y-3">
            <div className="glass-card">
              <div className="font-mono text-slate-300 text-sm">GET /api/strategies</div>
              <div className="text-gray-400 text-xs mt-1">Fetch all strategies</div>
            </div>
            <div className="glass-card">
              <div className="font-mono text-slate-300 text-sm">POST /api/backtest</div>
              <div className="text-gray-400 text-xs mt-1">Run strategy backtest</div>
            </div>
            <div className="glass-card">
              <div className="font-mono text-slate-300 text-sm">GET /api/journal</div>
              <div className="text-gray-400 text-xs mt-1">Access journal entries</div>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow">
          <h2 className="text-2xl font-bold text-gray-400 mb-6">🔧 SDK Examples</h2>
          <div className="space-y-3">
            <div className="glass-card">
              <div className="font-mono text-gray-300 text-sm">Python SDK</div>
              <div className="text-gray-400 text-xs mt-1">pip install insight-flow</div>
            </div>
            <div className="glass-card">
              <div className="font-mono text-gray-300 text-sm">JavaScript SDK</div>
              <div className="text-gray-400 text-xs mt-1">npm install @insight/flow</div>
            </div>
            <div className="glass-card">
              <div className="font-mono text-gray-300 text-sm">REST API</div>
              <div className="text-gray-400 text-xs mt-1">Direct HTTP requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">💻 Code Example</h2>
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 font-mono text-sm">
          <div className="text-green-400 mb-2"># Example: Create and backtest a strategy</div>
          <div className="text-white">
            <span className="text-blue-400">import</span> insight_flow <span className="text-blue-400">as</span> flow<br/>
            <br/>
            <span className="text-purple-400">strategy</span> = flow.Strategy()<br/>
            <span className="text-purple-400">strategy</span>.add_signal(<span className="text-yellow-400">"RSI &lt; 30"</span>)<br/>
            <span className="text-purple-400">strategy</span>.add_exit(<span className="text-yellow-400">"RSI &gt; 70"</span>)<br/>
            <br/>
            <span className="text-purple-400">results</span> = flow.backtest(<span className="text-purple-400">strategy</span>, <span className="text-yellow-400">"2023-01-01"</span>, <span className="text-yellow-400">"2024-01-01"</span>)<br/>
            <span className="text-blue-400">print</span>(<span className="text-purple-400">results</span>.summary())
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocsPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
