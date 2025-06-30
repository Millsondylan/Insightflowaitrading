
import React from 'react';

const ProfileRiskMapPage: React.FC = () => {
  return (
    <section className="theme-portfolio min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-blue mb-8"/></Section /></Section />
          Risk Profile Map
        </section>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Visualize your risk distribution
        </p>
      </div>

      {/* Radial Risk Map */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-bold text-white mb-8 text-center"></div>🎯 Risk Quadrants</div>
        <div className="max-w-2xl mx-auto">
          <div className="relative w-96 h-96 mx-auto">
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 border border-indigo-400/30 rounded-full flex items-center justify-center">
              <span className="text-indigo-400 font-semibold"></div>Core</div>
            </div>

            {/* Quadrant 1 - High Return, High Risk */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-red-500/10 border border-red-400/20 rounded-tl-full flex items-start justify-end p-6">
              <div className="text-right">
                <div className="text-red-400 font-semibold text-sm">High Risk</div>
                <div className="text-red-300 text-xs">High Return</div>
              </div>
            </div>

            {/* Quadrant 2 - High Return, Low Risk */}
            <div className="absolute top-0 left-0 w-44 h-44 bg-emerald-500/10 border border-emerald-400/20 rounded-tr-full flex items-start justify-start p-6">
              <div className="text-left">
                <div className="text-emerald-400 font-semibold text-sm">Low Risk</div>
                <div className="text-emerald-300 text-xs">High Return</div>
              </div>
            </div>

            {/* Quadrant 3 - Low Return, Low Risk */}
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-500/10 border border-blue-400/20 rounded-br-full flex items-end justify-start p-6">
              <div className="text-left">
                <div className="text-blue-400 font-semibold text-sm">Low Risk</div>
                <div className="text-blue-300 text-xs">Low Return</div>
              </div>
            </div>

            {/* Quadrant 4 - Low Return, High Risk */}
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-orange-500/10 border border-orange-400/20 rounded-bl-full flex items-end justify-end p-6">
              <div className="text-right">
                <div className="text-orange-400 font-semibold text-sm">High Risk</div>
                <div className="text-orange-300 text-xs">Low Return</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6"></div>📊 Risk Metrics</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card text-center">
            <div className="text-2xl font-bold text-violet-400 mb-2">2.4</div>
            <div className="text-gray-400">Sharpe Ratio</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">-8.5%</div>
            <div className="text-gray-400">Max Drawdown</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">0.65</div>
            <div className="text-gray-400">Beta</div>
          </div>
        </div>
      </div />
  );
};

export default ProfileRiskMapPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
