
import React from 'react';

const PlannerPage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <header>
          <h1 className="text-6xl md:text-8xl font-bold text-glow-blue mb-8">
            Trading Planner
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Plan your trades, <span className="text-glow-cyan">trade your plan</span>
          </p>
        </header>
      </div>

      {/* Planner Content */}
      <div className="glass-section motion-shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Daily Trading Plan</h2>
          <p className="text-gray-400 mb-8">Your personalized trading roadmap</p>
          <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-8">
            <p className="text-blue-300">Feature coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
