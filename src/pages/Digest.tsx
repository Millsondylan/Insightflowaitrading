
import React from 'react';

const DigestPage: React.FC = () => {
  return (
    <section className="theme-digest min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-gold mb-8">
          Market Digest
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Your daily dose of market intelligence
        </p>
      </div>

      {/* Digest Cards */}
      <div className="space-y-8 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📰</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-amber-400 mb-2">Market Outlook</h3>
              <p className="text-gray-300 leading-relaxed">
                Technical analysis suggests continued bullish momentum in tech sector with key resistance levels at 4,200 on SPY.
              </p>
              <div className="mt-4 text-sm text-gray-400">5 min read • Morning Brief</div>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Strategy Insight</h3>
              <p className="text-gray-300 leading-relaxed">
                Momentum strategies showing 23% higher success rate this quarter. Consider increasing position sizes in trending markets.
              </p>
              <div className="mt-4 text-sm text-gray-400">3 min read • Strategy Focus</div>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Quick Alert</h3>
              <p className="text-gray-300 leading-relaxed">
                Unusual options activity detected in NVDA. Call volume 3x above average. Monitor for potential breakout.
              </p>
              <div className="mt-4 text-sm text-gray-400">1 min read • Live Alert</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">📚 Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card text-center hover-glow">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm text-gray-300">Technical</div>
          </div>
          <div className="glass-card text-center hover-glow">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm text-gray-300">Fundamental</div>
          </div>
          <div className="glass-card text-center hover-glow">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm text-gray-300">Options</div>
          </div>
          <div className="glass-card text-center hover-glow">
            <div className="text-2xl mb-2">🪙</div>
            <div className="text-sm text-gray-300">Crypto</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigestPage;
