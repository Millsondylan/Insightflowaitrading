import React from 'react';

const PortfolioPage: React.FC = () => {
  return (
    <section className="theme-portfolio min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-blue mb-8">
          Portfolio Vision
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Your investments at a glance
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-bold text-white mb-8">📊 Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-2">$125,430</div>
            <div className="text-gray-400">Total Value</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-2">+12.5%</div>
            <div className="text-gray-400">Daily Change</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-bold text-violet-400 mb-2">8</div>
            <div className="text-gray-400">Positions</div>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">💼 Holdings</h2>
        <div className="space-y-4">
          <div className="glass-card hover-glow">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">TSLA</div>
                <div className="text-gray-400 text-sm">50 shares</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-emerald-400">+5.2%</div>
                <div className="text-gray-300">$12,450</div>
              </div>
            </div>
          </div>
          <div className="glass-card hover-glow">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">NVDA</div>
                <div className="text-gray-400 text-sm">25 shares</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-red-400">-2.1%</div>
                <div className="text-gray-300">$8,750</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
