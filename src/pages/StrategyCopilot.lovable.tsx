
import React from 'react';

const StrategyCopilotPage: React.FC = () => {
  return (
    <section className="theme-strategy min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8">
          Strategy Copilot
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          AI-powered strategy assistance
        </p>
      </div>

      {/* Question Blocks */}
      <div className="space-y-6 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400">?</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Strategy Analysis</h3>
              <p className="text-gray-300 mb-4">What market conditions favor your current approach?</p>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors">
                  Bullish
                </button>
                <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors">
                  Bearish
                </button>
                <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors">
                  Sideways
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Risk Management</h3>
              <p className="text-gray-300 mb-4">Optimize your position sizing and stop-loss levels</p>
              <div className="h-4 bg-blue-500/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-blue-500/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">🎯 AI Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card hover-glow">
            <h4 className="font-semibold text-teal-400 mb-2">Entry Signal</h4>
            <p className="text-gray-300 text-sm">Consider entering long positions on RSI oversold conditions with volume confirmation</p>
          </div>
          <div className="glass-card hover-glow">
            <h4 className="font-semibold text-emerald-400 mb-2">Exit Strategy</h4>
            <p className="text-gray-300 text-sm">Trail stops at 1.5x ATR to capture momentum while protecting gains</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategyCopilotPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
