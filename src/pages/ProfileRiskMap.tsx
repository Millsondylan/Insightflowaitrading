
import React from 'react';

const ProfileRiskMapPage: React.FC = () => {
  return (
    <Section className="theme-portfolio min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-blue mb-8">
          Risk Profile Map
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Visualize your risk distribution
        </P>
      </Div>

      {/* Radial Risk Map */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <H2 className="text-3xl font-bold text-white mb-8 text-center">🎯 Risk Quadrants</Div>
        <Div className="max-w-2xl mx-auto">
          <Div className="relative w-96 h-96 mx-auto">
            {/* Center Circle */}
            <Div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 border border-indigo-400/30 rounded-full flex items-center justify-center">
              <Span className="text-indigo-400 font-semibold">Core</Div>
            </Div>

            {/* Quadrant 1 - High Return, High Risk */}
            <Div className="absolute top-0 right-0 w-44 h-44 bg-red-500/10 border border-red-400/20 rounded-tl-full flex items-start justify-end p-6">
              <Div className="text-right">
                <Div className="text-red-400 font-semibold text-sm">High Risk</Div>
                <Div className="text-red-300 text-xs">High Return</Div>
              </Div>
            </Div>

            {/* Quadrant 2 - High Return, Low Risk */}
            <Div className="absolute top-0 left-0 w-44 h-44 bg-emerald-500/10 border border-emerald-400/20 rounded-tr-full flex items-start justify-start p-6">
              <Div className="text-left">
                <Div className="text-emerald-400 font-semibold text-sm">Low Risk</Div>
                <Div className="text-emerald-300 text-xs">High Return</Div>
              </Div>
            </Div>

            {/* Quadrant 3 - Low Return, Low Risk */}
            <Div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-500/10 border border-blue-400/20 rounded-br-full flex items-end justify-start p-6">
              <Div className="text-left">
                <Div className="text-blue-400 font-semibold text-sm">Low Risk</Div>
                <Div className="text-blue-300 text-xs">Low Return</Div>
              </Div>
            </Div>

            {/* Quadrant 4 - Low Return, High Risk */}
            <Div className="absolute bottom-0 right-0 w-44 h-44 bg-orange-500/10 border border-orange-400/20 rounded-bl-full flex items-end justify-end p-6">
              <Div className="text-right">
                <Div className="text-orange-400 font-semibold text-sm">High Risk</Div>
                <Div className="text-orange-300 text-xs">Low Return</Div>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Risk Metrics */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-3xl font-bold text-white mb-6">📊 Risk Metrics</Div>
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Div className="glass-card text-center">
            <Div className="text-2xl font-bold text-violet-400 mb-2">2.4</Div>
            <Div className="text-gray-400">Sharpe Ratio</Div>
          </Div>
          <Div className="glass-card text-center">
            <Div className="text-2xl font-bold text-red-400 mb-2">-8.5%</Div>
            <Div className="text-gray-400">Max Drawdown</Div>
          </Div>
          <Div className="glass-card text-center">
            <Div className="text-2xl font-bold text-blue-400 mb-2">0.65</Div>
            <Div className="text-gray-400">Beta</Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default ProfileRiskMapPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
