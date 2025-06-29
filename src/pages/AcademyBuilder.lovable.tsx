
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const AcademyBuilderPage: React.FC = () => {
  return (
    <div className="theme-academy scroll-container min-h-screen">
      {/* Hero Section */}
      <scrollsection  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-glow-blue mb-8 leading-tight">
            Learn, Test, Evolve
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            Scroll-through lessons and unlock your trading mastery
          </p>
          <div className="mt-12">
            <div className="threadline-glow w-32 mx-auto"></div>
          </div>
        </div>
      </ScrollSection>

      {/* Progress Overview */}
      <Scrollsection >
        <div className="max-w-6xl mx-auto">
          <div className="glass-section motion-shadow text-center">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
              📈 Learning Progress
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-glow-emerald mb-8">
              Your Trading Education Journey
            </h2>
            
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Overall Progress</span>
                <span>67%</span>
              </div>
              <div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-2/3 rounded-full"></div>
              </div>
            </div>
            
            <p className="text-gray-400 text-lg">
              Continue your journey to trading mastery with structured lessons and hands-on practice
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* Lesson Blocks Grid */}
      <Scrollsection animation="slide-right" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Lesson Block 1 - Technical Analysis */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-300 text-2xl mb-4">
                  📊
                </div>
                <h3 className="text-xl font-semibold text-glow-blue mb-3">Technical Analysis</h3>
                <p className="text-gray-400 text-sm mb-4">Master chart patterns, indicators, and price action</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Support & Resistance</span>
                  <span className="text-emerald-400">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Trend Analysis</span>
                  <span className="text-emerald-400">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Candlestick Patterns</span>
                  <span className="text-blue-400">In Progress</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 2 - Risk Management */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-300 text-2xl mb-4">
                  🛡️
                </div>
                <h3 className="text-xl font-semibold text-glow-emerald mb-3">Risk Management</h3>
                <p className="text-gray-400 text-sm mb-4">Protect your capital with proven strategies</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Position Sizing</span>
                  <span className="text-emerald-400">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Stop Loss Strategies</span>
                  <span className="text-blue-400">In Progress</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Portfolio Theory</span>
                  <span className="text-gray-500">Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 3 - Trading Psychology */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 bg-violet-500/20 border border-violet-400/30 rounded-xl flex items-center justify-center text-violet-300 text-2xl mb-4">
                  🧠
                </div>
                <h3 className="text-xl font-semibold text-glow-blue mb-3">Trading Psychology</h3>
                <p className="text-gray-400 text-sm mb-4">Master your emotions and decision-making</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Emotional Control</span>
                  <span className="text-blue-400">In Progress</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Discipline Building</span>
                  <span className="text-gray-500">Locked</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Behavioral Finance</span>
                  <span className="text-gray-500">Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 4 - Market Analysis */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-400/30 rounded-xl flex items-center justify-center text-cyan-300 text-2xl mb-4">
                  🌍
                </div>
                <h3 className="text-xl font-semibold text-glow-blue mb-3">Market Analysis</h3>
                <p className="text-gray-400 text-sm mb-4">Understand macro trends and market cycles</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Economic Indicators</span>
                  <span className="text-gray-500">Locked</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Sector Analysis</span>
                  <span className="text-gray-500">Locked</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">News Impact</span>
                  <span className="text-gray-500">Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 5 - Advanced Strategies */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center justify-center text-yellow-300 text-2xl mb-4">
                  ⚡
                </div>
                <h3 className="text-xl font-semibold text-glow-blue mb-3">Advanced Strategies</h3>
                <p className="text-gray-400 text-sm mb-4">Complex trading techniques and algorithms</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Options Strategies</span>
                  <span className="text-gray-500">Locked</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Algorithmic Trading</span>
                  <span className="text-gray-500">Locked</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Portfolio Optimization</span>
                  <span className="text-gray-500">Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 6 - Practical Application */}
            <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 bg-pink-500/20 border border-pink-400/30 rounded-xl flex items-center justify-center text-pink-300 text-2xl mb-4">
                  🎯
                </div>
                <h3 className="text-xl font-semibold text-glow-blue mb-3">Practical Application</h3>
                <p className="text-gray-400 text-sm mb-4">Real-world trading scenarios and case studies</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Paper Trading</span>
                  <span className="text-gray-500">Locked</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Case Studies</span>
                  <span className="text-gray-500">Locked</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Strategy Testing</span>
                  <span className="text-gray-500">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Achievement Badge */}
      <scrollsection animation="scale-in" >
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-section motion-shadow">
            <div className="text-6xl mb-6">🏆</div>
            <h4 className="text-2xl md:text-3xl font-semibold text-glow-emerald mb-4">
              Achievement Unlocked
            </h4>
            <div className="inline-block px-8 py-4 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-lg font-medium mb-6">
              Technical Analysis Fundamentals Master
            </div>
            <p className="text-gray-400 text-lg mb-8">
              You've successfully completed the foundation level of technical analysis. Ready for the next challenge?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="glow-button glow-blue">
                Continue Learning
              </button>
              <button className="glow-button glow-emerald">
                Practice Quiz
              </button>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default AcademyBuilderPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
