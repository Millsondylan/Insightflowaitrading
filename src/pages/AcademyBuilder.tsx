import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const AcademyBuilderPage: React.FC = () => {
  return (
    <Div className="theme-academy scroll-container min-h-screen">
      {/* Hero Section */}
      <ScrollSection className="min-h-screen flex items-center justify-center px-6" delay={0}>
        <Div className="text-center max-w-5xl mx-auto">
          <H1 className="text-6xl md:text-8xl font-bold text-glow-blue mb-8 leading-tight"></Div>
            Learn, Test, Evolve
          </Div>
          <P className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            Scroll-through lessons and unlock your trading mastery
          </P>
          <Div className="mt-12">
            <Div className="threadline-glow w-32 mx-auto"></Div>
          </Div>
        </Div>
      </ScrollSection>

      {/* Progress Overview */}
      <ScrollSection className="px-6 py-20" delay={100}>
        <Div className="max-w-6xl mx-auto">
          <Div className="glass-section motion-shadow text-center">
            <Div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
              📈 Learning Progress
            </ScrollSection>
            <H2 className="text-3xl md:text-4xl font-semibold text-glow-emerald mb-8">
              Your Trading Education Journey
            </H2>
            
            {/* Progress Bar */}
            <Div className="max-w-2xl mx-auto mb-8">
              <Div className="flex justify-between text-sm text-gray-400 mb-3">
                <Span>Overall Progress</Div>
                <Span>67%</Span>
              </Div>
              <Div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden">
                <Div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-2/3 rounded-full"></Div>
              </Div>
            </Div>
            
            <P className="text-gray-400 text-lg">
              Continue your journey to trading mastery with structured lessons and hands-on practice
            </P>
          </Div>
        </Div>
      </ScrollSection>

      {/* Lesson Blocks Grid */}
      <ScrollSection className="px-6 py-20" delay={200} animation="slide-right">
        <Div className="max-w-7xl mx-auto">
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Lesson Block 1 - Technical Analysis */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="mb-6">
                <Div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-300 text-2xl mb-4">
                  📊
                </ScrollSection>
                <H3 className="text-xl font-semibold text-glow-blue mb-3">Technical Analysis</H3>
                <P className="text-gray-400 text-sm mb-4">Master chart patterns, indicators, and price action</P>
              </Div>
              <Div className="space-y-3">
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Support & Resistance</Div>
                  <Span className="text-emerald-400">✓</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Trend Analysis</Div>
                  <Span className="text-emerald-400">✓</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Candlestick Patterns</Div>
                  <Span className="text-blue-400">In Progress</Span>
                </Div>
              </Div>
            </Div>

            {/* Lesson Block 2 - Risk Management */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="mb-6">
                <Div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-300 text-2xl mb-4">
                  🛡️
                </Div>
                <H3 className="text-xl font-semibold text-glow-emerald mb-3">Risk Management</H3>
                <P className="text-gray-400 text-sm mb-4">Protect your capital with proven strategies</P>
              </Div>
              <Div className="space-y-3">
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Position Sizing</Div>
                  <Span className="text-emerald-400">✓</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Stop Loss Strategies</Div>
                  <Span className="text-blue-400">In Progress</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Portfolio Theory</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
              </Div>
            </Div>

            {/* Lesson Block 3 - Trading Psychology */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="mb-6">
                <Div className="w-12 h-12 bg-violet-500/20 border border-violet-400/30 rounded-xl flex items-center justify-center text-violet-300 text-2xl mb-4">
                  🧠
                </Div>
                <H3 className="text-xl font-semibold text-glow-blue mb-3">Trading Psychology</H3>
                <P className="text-gray-400 text-sm mb-4">Master your emotions and decision-making</P>
              </Div>
              <Div className="space-y-3">
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Emotional Control</Div>
                  <Span className="text-blue-400">In Progress</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Discipline Building</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Behavioral Finance</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
              </Div>
            </Div>

            {/* Lesson Block 4 - Market Analysis */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="mb-6">
                <Div className="w-12 h-12 bg-cyan-500/20 border border-cyan-400/30 rounded-xl flex items-center justify-center text-cyan-300 text-2xl mb-4">
                  🌍
                </Div>
                <H3 className="text-xl font-semibold text-glow-blue mb-3">Market Analysis</H3>
                <P className="text-gray-400 text-sm mb-4">Understand macro trends and market cycles</P>
              </Div>
              <Div className="space-y-3">
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Economic Indicators</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Sector Analysis</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">News Impact</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
              </Div>
            </Div>

            {/* Lesson Block 5 - Advanced Strategies */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="mb-6">
                <Div className="w-12 h-12 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center justify-center text-yellow-300 text-2xl mb-4">
                  ⚡
                </Div>
                <H3 className="text-xl font-semibold text-glow-blue mb-3">Advanced Strategies</H3>
                <P className="text-gray-400 text-sm mb-4">Complex trading techniques and algorithms</P>
              </Div>
              <Div className="space-y-3">
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Options Strategies</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Algorithmic Trading</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Portfolio Optimization</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
              </Div>
            </Div>

            {/* Lesson Block 6 - Practical Application */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="mb-6">
                <Div className="w-12 h-12 bg-pink-500/20 border border-pink-400/30 rounded-xl flex items-center justify-center text-pink-300 text-2xl mb-4">
                  🎯
                </Div>
                <H3 className="text-xl font-semibold text-glow-blue mb-3">Practical Application</H3>
                <P className="text-gray-400 text-sm mb-4">Real-world trading scenarios and case studies</P>
              </Div>
              <Div className="space-y-3">
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Paper Trading</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Case Studies</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-gray-300">Strategy Testing</Div>
                  <Span className="text-gray-500">Locked</Span>
                </Div>
              </Div>
            </Div>
          </Div>
        </Div>
      </ScrollSection>

      {/* Achievement Badge */}
      <ScrollSection className="px-6 py-32" delay={300} animation="scale-in">
        <Div className="max-w-4xl mx-auto text-center">
          <Div className="glass-section motion-shadow">
            <Div className="text-6xl mb-6">🏆</ScrollSection>
            <H4 className="text-2xl md:text-3xl font-semibold text-glow-emerald mb-4">
              Achievement Unlocked
            </H4>
            <Div className="inline-block px-8 py-4 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-lg font-medium mb-6">
              Technical Analysis Fundamentals Master
            </Div>
            <P className="text-gray-400 text-lg mb-8">
              You've successfully completed the foundation level of technical analysis. Ready for the next challenge?
            </P>
            <Div className="flex flex-wrap justify-center gap-4">
              <Button className="glow-button glow-blue"></Div>
                Continue Learning
              </Button>
              <Button className="glow-button glow-emerald"></Button>
                Practice Quiz
              </Button>
            </Div>
          </Div>
        </Div>
      </ScrollSection>
    </Div>
  );
};

export default AcademyBuilderPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
