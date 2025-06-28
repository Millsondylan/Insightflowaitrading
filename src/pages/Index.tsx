
import React from 'react';
import { Link } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return (
    <section className="theme-landing min-h-screen px-6 py-16 space-y-16">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-6xl mx-auto animate-in fade-in slide-up">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-tight">
            <span className="text-glow-cyan">Insight</span>{' '}
            <span className="text-glow-violet">Flow</span>
          </h1>
          <p className="text-2xl md:text-4xl text-gray-300 leading-relaxed font-light mb-16">
            Your Trading Mind, Amplified
          </p>
          
          {/* Main CTA Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <Link to="/strategy" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-cyan-400">🧠</div>
                <h3 className="text-lg font-semibold text-white">Strategy</h3>
              </div>
            </Link>
            
            <Link to="/backtest" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-emerald-400">🧪</div>
                <h3 className="text-lg font-semibold text-white">Backtest</h3>
              </div>
            </Link>
            
            <Link to="/journal" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-violet-400">📓</div>
                <h3 className="text-lg font-semibold text-white">Journal</h3>
              </div>
            </Link>
            
            <Link to="/academy" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-blue-400">🎓</div>
                <h3 className="text-lg font-semibold text-white">Academy</h3>
              </div>
            </Link>
            
            <Link to="/wallet" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-yellow-400">🪙</div>
                <h3 className="text-lg font-semibold text-white">Wallet</h3>
              </div>
            </Link>
            
            <Link to="/markets" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-teal-400">📈</div>
                <h3 className="text-lg font-semibold text-white">Markets</h3>
              </div>
            </Link>
            
            <Link to="/portfolio" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-green-400">💼</div>
                <h3 className="text-lg font-semibold text-white">Portfolio</h3>
              </div>
            </Link>
            
            <Link to="/community" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 text-pink-400">💬</div>
                <h3 className="text-lg font-semibold text-white">Community</h3>
              </div>
            </Link>
          </div>

          {/* Secondary Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
            <Link to="/strategy/copilot" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-cyan-300">🤖</div>
                <h4 className="text-sm font-medium text-white">Strategy Copilot</h4>
              </div>
            </Link>
            
            <Link to="/strategy/export" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-cyan-300">📤</div>
                <h4 className="text-sm font-medium text-white">Export</h4>
              </div>
            </Link>
            
            <Link to="/backtest/replay" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-emerald-300">⏯️</div>
                <h4 className="text-sm font-medium text-white">Replay</h4>
              </div>
            </Link>
            
            <Link to="/profile/risk-map" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-red-300">🎯</div>
                <h4 className="text-sm font-medium text-white">Risk Map</h4>
              </div>
            </Link>
            
            <Link to="/vault/heatmap" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-orange-300">🔥</div>
                <h4 className="text-sm font-medium text-white">Vault Heatmap</h4>
              </div>
            </Link>
            
            <Link to="/digest" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-indigo-300">📰</div>
                <h4 className="text-sm font-medium text-white">Digest</h4>
              </div>
            </Link>
            
            <Link to="/demo" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-purple-300">🎮</div>
                <h4 className="text-sm font-medium text-white">Demo</h4>
              </div>
            </Link>
            
            <Link to="/chat" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-4">
                <div className="text-2xl mb-2 text-blue-300">💭</div>
                <h4 className="text-sm font-medium text-white">Chat</h4>
              </div>
            </Link>
          </div>

          {/* Utility Navigation */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
            <Link to="/notifications" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-3">
                <div className="text-xl mb-1 text-yellow-300">🔔</div>
                <h5 className="text-xs font-medium text-white">Alerts</h5>
              </div>
            </Link>
            
            <Link to="/settings/notifications" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-3">
                <div className="text-xl mb-1 text-gray-300">⚙️</div>
                <h5 className="text-xs font-medium text-white">Settings</h5>
              </div>
            </Link>
            
            <Link to="/help" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-3">
                <div className="text-xl mb-1 text-blue-300">❓</div>
                <h5 className="text-xs font-medium text-white">Help</h5>
              </div>
            </Link>
            
            <Link to="/faq" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-3">
                <div className="text-xl mb-1 text-green-300">💡</div>
                <h5 className="text-xs font-medium text-white">FAQ</h5>
              </div>
            </Link>
            
            <Link to="/docs" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-3">
                <div className="text-xl mb-1 text-teal-300">📚</div>
                <h5 className="text-xs font-medium text-white">Docs</h5>
              </div>
            </Link>
            
            <Link to="/admin" className="group">
              <div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer py-3">
                <div className="text-xl mb-1 text-red-400">🛡️</div>
                <h5 className="text-xs font-medium text-white">Admin</h5>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Preview Sections */}
      <div className="space-y-16 max-w-7xl mx-auto">
        {/* Strategy Preview */}
        <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🧠</span>
            <h2 className="text-3xl font-bold text-glow-cyan">AI Strategy Generation</h2>
          </div>
          <p className="text-gray-300 text-lg">Transform your trading ideas into structured, backtestable strategies with AI-powered insights.</p>
        </div>

        {/* Backtest Preview */}
        <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🧪</span>
            <h2 className="text-3xl font-bold text-glow-emerald">Advanced Backtesting</h2>
          </div>
          <p className="text-gray-300 text-lg">Test your strategies against historical data with comprehensive analytics and risk metrics.</p>
        </div>

        {/* Journal Preview */}
        <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">📓</span>
            <h2 className="text-3xl font-bold text-glow-magenta">Psychology Tracking</h2>
          </div>
          <p className="text-gray-300 text-lg">Capture and analyze your trading psychology to identify patterns and improve decision-making.</p>
        </div>

        {/* Academy Preview */}
        <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🎓</span>
            <h2 className="text-3xl font-bold text-glow-blue">Adaptive Learning</h2>
          </div>
          <p className="text-gray-300 text-lg">Personalized education that evolves with your trading journey and skill level.</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center animate-bounce">
        <div className="text-2xl text-gray-400">↓</div>
      </div>
    </section>
  );
};

export default IndexPage;
