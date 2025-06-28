
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const StrategyBuilderPage: React.FC = () => {
  return (
    <div className="theme-strategy scroll-container min-h-screen">
      {/* Hero Section */}
      <ScrollSection className="min-h-screen flex items-center justify-center px-6" delay={0}>
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8 leading-tight">
            Visualize Your Edge
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            AI-crafted strategies from your own thinking
          </p>
          <div className="mt-12">
            <div className="threadline-glow w-32 mx-auto"></div>
          </div>
        </div>
      </ScrollSection>

      {/* Strategy Input Section */}
      <ScrollSection className="px-6 py-20" delay={100}>
        <div className="max-w-5xl mx-auto glass-section motion-shadow">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-6">
              ✏️ Strategy Input
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-glow-cyan mb-4">
              Describe Your Trading Approach
            </h2>
            <p className="text-gray-400 text-lg">
              Tell us about your market intuition and we'll craft the perfect strategy
            </p>
          </div>
          
          {/* Input Area */}
          <div className="space-y-6">
            <div className="h-40 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"></div>
            <div className="flex justify-center">
              <button className="glow-button glow-cyan text-lg px-8 py-4">
                Generate Strategy
              </button>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Generated Rules Section */}
      <ScrollSection className="px-6 py-20" delay={200} animation="slide-right">
        <div className="max-w-5xl mx-auto glass-section motion-shadow">
          <div className="flex items-center mb-8">
            <span className="text-3xl mr-4">📜</span>
            <h3 className="text-3xl md:text-4xl font-semibold text-cyan-400">Generated Rules</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 glass-card hover:bg-black/30 transition-all duration-300">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-300 font-bold text-sm">
                1
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">Rule placeholder for market entry conditions...</p>
            </div>
            <div className="flex items-start space-x-4 p-4 glass-card hover:bg-black/30 transition-all duration-300">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-300 font-bold text-sm">
                2
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">Rule placeholder for risk management protocols...</p>
            </div>
            <div className="flex items-start space-x-4 p-4 glass-card hover:bg-black/30 transition-all duration-300">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-300 font-bold text-sm">
                3
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">Rule placeholder for exit strategy timing...</p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Action Buttons */}
      <ScrollSection className="px-6 py-32" delay={300}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h4 className="text-2xl md:text-3xl font-semibold text-glow-cyan mb-4">Ready to Execute?</h4>
            <p className="text-gray-400 text-lg">Take your strategy to the next level</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="glow-button glow-cyan text-lg px-8 py-4">
              🔁 Backtest Strategy
            </button>
            <button className="glow-button glow-cyan text-lg px-8 py-4">
              📓 Save to Journal
            </button>
            <button className="glow-button glow-cyan text-lg px-8 py-4">
              💬 Share Strategy
            </button>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default StrategyBuilderPage;
