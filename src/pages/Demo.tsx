
import React from 'react';

const DemoPage: React.FC = () => {
  return (
    <section className="theme-demo min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-rainbow mb-8">
          Live Demo
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Experience Insight Flow in action
        </p>
      </div>

      {/* Demo Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow hover-glow">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Live Charts</h3>
            <p className="text-gray-300 text-sm">Real-time market data visualization</p>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-violet-400 mb-2">AI Analysis</h3>
            <p className="text-gray-300 text-sm">Intelligent market insights and predictions</p>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Fast Execution</h3>
            <p className="text-gray-300 text-sm">Lightning-speed trade analysis</p>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">🎮 Try It Yourself</h2>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="h-64 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/10 rounded-xl flex items-center justify-center">
              <div className="text-gray-400">Interactive Demo Area</div>
            </div>
          </div>
          <button className="glow-button glow-rainbow px-8 py-4 text-lg">
            Start Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default DemoPage;
