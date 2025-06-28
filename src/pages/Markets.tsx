
import React from 'react';

const MarketsPage: React.FC = () => {
  return (
    <section className="theme-markets min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-emerald mb-8">
          Market Pulse
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Real-time insights across all markets
        </p>
      </div>

      {/* Market Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow hover-glow">
          <h3 className="text-xl font-semibold text-teal-400 mb-4">📈 Equities</h3>
          <div className="space-y-2">
            <div className="h-4 bg-teal-500/20 rounded"></div>
            <div className="h-4 bg-teal-500/10 rounded"></div>
            <div className="h-4 bg-teal-500/15 rounded"></div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <h3 className="text-xl font-semibold text-emerald-400 mb-4">🪙 Crypto</h3>
          <div className="space-y-2">
            <div className="h-4 bg-emerald-500/20 rounded"></div>
            <div className="h-4 bg-emerald-500/10 rounded"></div>
            <div className="h-4 bg-emerald-500/15 rounded"></div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">💰 Forex</h3>
          <div className="space-y-2">
            <div className="h-4 bg-cyan-500/20 rounded"></div>
            <div className="h-4 bg-cyan-500/10 rounded"></div>
            <div className="h-4 bg-cyan-500/15 rounded"></div>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">🔍 Market Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-32 bg-teal-500/10 rounded-xl border border-teal-400/20"></div>
            <p className="text-gray-300">Technical analysis placeholder</p>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-emerald-500/10 rounded-xl border border-emerald-400/20"></div>
            <p className="text-gray-300">Sentiment analysis placeholder</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketsPage;
