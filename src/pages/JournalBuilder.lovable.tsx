
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const JournalBuilderPage: React.FC = () => {
  return (
    <div className="theme-journal scroll-container min-h-screen">
      {/* Hero Section */}
      <scrollsection  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-glow-violet mb-8 leading-tight">
            Your Trading Mind, Captured
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            Record, reflect, and evolve your trading psychology
          </p>
          <div className="mt-12">
            <div className="threadline-glow w-40 mx-auto"></div>
          </div>
        </div>
      </ScrollSection>

      {/* New Entry Section */}
      <Scrollsection >
        <div className="max-w-6xl mx-auto">
          <div className="glass-section motion-shadow">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-2 bg-violet-500/10 border border-violet-400/30 rounded-full text-violet-300 text-sm font-medium mb-6">
                📝 New Journal Entry
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-glow-magenta mb-4">
                Document Your Journey
              </h2>
            </div>
            
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Trade Symbol</label>
                <div className="bg-white/5 h-12 rounded-xl border border-white/10"></div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Entry Price</label>
                <div className="bg-white/5 h-12 rounded-xl border border-white/10"></div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Exit Price</label>
                <div className="bg-white/5 h-12 rounded-xl border border-white/10"></div>
              </div>
            </div>
            
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">Trade Reflection</label>
              <div className="bg-white/5 h-32 rounded-xl border border-white/10"></div>
            </div>
            
            <div className="mt-8 text-center">
              <button className="glow-button glow-violet text-lg px-8 py-4">
                Save Entry
              </button>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Recent Entries Timeline */}
      <Scrollsection animation="slide-right" />
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h3 className="text-3xl md:text-4xl font-semibold text-glow-magenta mb-4">📓 Recent Entries</h3>
            <div className="threadline-glow w-24 mx-auto"></div>
          </div>
          
          <div className="space-y-8">
            {/* Entry Card 1 */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">TSLA Momentum Play</h4>
                  <p className="text-gray-400 text-sm">January 15, 2024</p>
                </div>
                <div className="text-right">
                  <div className="sentiment-bullish mb-2">🟢 Bullish</div>
                  <div className="text-emerald-400 font-bold">+12.5%</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Journal entry reflection placeholder text about the trade psychology and decision-making process...
              </p>
            </div>

            {/* Entry Card 2 */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">SPY Put Hedge</h4>
                  <p className="text-gray-400 text-sm">January 12, 2024</p>
                </div>
                <div className="text-right">
                  <div className="sentiment-bearish mb-2">🔴 Bearish</div>
                  <div className="text-red-400 font-bold">-3.2%</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Another journal entry placeholder reflecting on risk management and emotional discipline...
              </p>
            </div>

            {/* Entry Card 3 */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">NVDA Breakout</h4>
                  <p className="text-gray-400 text-sm">January 10, 2024</p>
                </div>
                <div className="text-right">
                  <div className="sentiment-bullish mb-2">🟢 Bullish</div>
                  <div className="text-emerald-400 font-bold">+8.7%</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Trade psychology notes and lessons learned from this successful momentum trade...
              </p>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Insights Section */}
      <scrollsection animation="scale-in" >
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-section motion-shadow">
            <h4 className="text-2xl md:text-3xl font-semibold text-glow-violet mb-6">🧠 AI Insights</h4>
            <p className="text-gray-300 text-lg mb-8">
              Your trading patterns and psychological trends are being analyzed to help you improve
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-violet-500/20 border border-violet-400/30 rounded-full text-violet-300 text-sm">
                Risk Management: Strong
              </div>
              <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm">
                Patience Level: Improving
              </div>
              <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full text-yellow-300 text-sm">
                FOMO Tendency: Monitor
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default JournalBuilderPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
