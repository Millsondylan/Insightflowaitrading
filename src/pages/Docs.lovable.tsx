
import React from 'react';

const DocsPage: React.FC = () => {
  return (
    <Section className="theme-docs min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-slate mb-8">
          Documentation
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Complete guide to Insight Flow
        </P>
      </Div>

      {/* Documentation Sections */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <Div className="glass-section motion-shadow">
          <H2 className="text-2xl font-bold text-slate-400 mb-6">📚 API Reference</Div>
          <Div className="space-y-3">
            <Div className="glass-card">
              <Div className="font-mono text-slate-300 text-sm">GET /api/strategies</Div>
              <Div className="text-gray-400 text-xs mt-1">Fetch all strategies</Div>
            </Div>
            <Div className="glass-card">
              <Div className="font-mono text-slate-300 text-sm">POST /api/backtest</Div>
              <Div className="text-gray-400 text-xs mt-1">Run strategy backtest</Div>
            </Div>
            <Div className="glass-card">
              <Div className="font-mono text-slate-300 text-sm">GET /api/journal</Div>
              <Div className="text-gray-400 text-xs mt-1">Access journal entries</Div>
            </Div>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow">
          <H2 className="text-2xl font-bold text-gray-400 mb-6">🔧 SDK Examples</Div>
          <Div className="space-y-3">
            <Div className="glass-card">
              <Div className="font-mono text-gray-300 text-sm">Python SDK</Div>
              <Div className="text-gray-400 text-xs mt-1">pip install insight-flow</Div>
            </Div>
            <Div className="glass-card">
              <Div className="font-mono text-gray-300 text-sm">JavaScript SDK</Div>
              <Div className="text-gray-400 text-xs mt-1">npm install @insight/flow</Div>
            </Div>
            <Div className="glass-card">
              <Div className="font-mono text-gray-300 text-sm">REST API</Div>
              <Div className="text-gray-400 text-xs mt-1">Direct HTTP requests</Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Code Example */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-3xl font-bold text-white mb-6">💻 Code Example</Div>
        <Div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 font-mono text-sm">
          <Div className="text-green-400 mb-2"># Example: Create and backtest a strategy</Div>
          <Div className="text-white">
            <Span className="text-blue-400">import</Div> insight_flow <Span className="text-blue-400">as</Span> flow<br/>
            <br/>
            <Span className="text-purple-400">strategy</Span> = flow.Strategy()<br/>
            <Span className="text-purple-400">strategy</Span>.add_signal(<Span className="text-yellow-400">"RSI &lt; 30"</Span>)<br/>
            <Span className="text-purple-400">strategy</Span>.add_exit(<Span className="text-yellow-400">"RSI &gt; 70"</Span>)<br/>
            <br/>
            <Span className="text-purple-400">results</Span> = flow.backtest(<Span className="text-purple-400">strategy</Span>, <Span className="text-yellow-400">"2023-01-01"</Span>, <Span className="text-yellow-400">"2024-01-01"</Span>)<br/>
            <Span className="text-blue-400">print</Span>(<Span className="text-purple-400">results</Span>.summary())
          </Div>
        </Div>
      </div />
  );
};

export default DocsPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
