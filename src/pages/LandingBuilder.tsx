
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';

const LandingBuilderPage: React.FC = () => {
  return (
    <div className="scroll-container min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Hero Section */}
      <ScrollSection className="min-h-screen flex items-center justify-center px-6" delay={0}>
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-tight">
            <span className="text-glow-cyan">Insight</span>{' '}
            <span className="text-glow-violet">Flow</span>
          </h1>
          <p className="text-2xl md:text-4xl text-gray-300 leading-relaxed font-light mb-12">
            Where Trading Intelligence Meets Intuition
          </p>
          <div className="threadline-glow w-48 mx-auto mb-16"></div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link to="/strategy" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-4 text-cyan-400">🧠</div>
                <h3 className="text-xl font-semibold text-glow-cyan mb-3">Strategy Builder</h3>
                <p className="text-gray-400">AI-powered strategy generation from your trading intuition</p>
              </div>
            </Link>
            
            <Link to="/journal" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-4 text-violet-400">📓</div>
                <h3 className="text-xl font-semibold text-glow-magenta mb-3">Trade Journal</h3>
                <p className="text-gray-400">Capture and reflect on your trading psychology</p>
              </div>
            </Link>
            
            <Link to="/academy" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-4 text-blue-400">📘</div>
                <h3 className="text-xl font-semibold text-glow-blue mb-3">Trading Academy</h3>
                <p className="text-gray-400">Structured learning for trading mastery</p>
              </div>
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Features Preview */}
      <ScrollSection className="px-6 py-32" delay={200} animation="slide-right">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Built for Modern Traders
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Combining cutting-edge AI with deep market psychology insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="glass-card">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-300 flex-shrink-0 mt-1">
                    ✨
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">AI Strategy Generation</h4>
                    <p className="text-gray-400">Transform your trading ideas into structured, backtestable strategies</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-violet-500/20 border border-violet-400/30 rounded-full flex items-center justify-center text-violet-300 flex-shrink-0 mt-1">
                    🧠
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Psychology Tracking</h4>
                    <p className="text-gray-400">Identify patterns in your decision-making and emotional responses</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center text-blue-300 flex-shrink-0 mt-1">
                    📈
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Adaptive Learning</h4>
                    <p className="text-gray-400">Personalized education that evolves with your trading journey</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-section">
              <div className="h-80 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-xl border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-400">Interactive Demo Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Call to Action */}
      <ScrollSection className="px-6 py-32" delay={400} animation="scale-in">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-section motion-shadow">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Trading?
            </h3>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of traders who've transformed their approach with Insight Flow
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/strategy">
                <button className="glow-button glow-cyan text-lg px-8 py-4">
                  Start Building Strategies
                </Button>
              </Link>
              <Link to="/academy">
                <button className="glow-button glow-blue text-lg px-8 py-4">
                  Begin Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default LandingBuilderPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
