
import React from 'react';

const ProfileRiskMapPage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-red mb-8">
          Risk Profile Map
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Understand your risk tolerance
        </p>
      </div>

      {/* Risk Assessment */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">⚡ Risk Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Conservative</h3>
            <p className="text-gray-400">Low risk, steady returns</p>
          </div>
          
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Moderate</h3>
            <p className="text-gray-400">Balanced risk-reward</p>
          </div>
          
          <div className="glass-card text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">Aggressive</h3>
            <p className="text-gray-400">High risk, high reward</p>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">🎯 Risk Factors</h2>
        <div className="space-y-4">
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Position Size</span>
              <span className="text-yellow-400">Medium</span>
            </div>
          </div>
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Market Exposure</span>
              <span className="text-green-400">Low</span>
            </div>
          </div>
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Volatility Tolerance</span>
              <span className="text-red-400">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRiskMapPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
