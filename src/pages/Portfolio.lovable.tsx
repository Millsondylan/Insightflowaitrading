
import React from 'react';

const PortfolioPage: React.FC = () => {
  return (
    <Section className="theme-portfolio min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-blue mb-8"></Section>
          Portfolio Vision
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Your investments at a glance
        </P>
      </Div>

      {/* Portfolio Overview */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <H2 className="text-3xl font-bold text-white mb-8"></Div>📊 Overview</Div>
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Div className="glass-card text-center">
            <Div className="text-2xl font-bold text-indigo-400 mb-2">$125,430</Div>
            <Div className="text-gray-400">Total Value</Div>
          </Div>
          <Div className="glass-card text-center">
            <Div className="text-2xl font-bold text-emerald-400 mb-2">+12.5%</Div>
            <Div className="text-gray-400">Daily Change</Div>
          </Div>
          <Div className="glass-card text-center">
            <Div className="text-2xl font-bold text-violet-400 mb-2">8</Div>
            <Div className="text-gray-400">Positions</Div>
          </Div>
        </Div>
      </Div>

      {/* Holdings */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-3xl font-bold text-white mb-6"></Div>💼 Holdings</Div>
        <Div className="space-y-4">
          <Div className="glass-card hover-glow">
            <Div className="flex justify-between items-center">
              <Div>
                <Div className="font-semibold text-white">TSLA</Div>
                <Div className="text-gray-400 text-sm">50 shares</Div>
              </Div>
              <Div className="text-right">
                <Div className="font-semibold text-emerald-400">+5.2%</Div>
                <Div className="text-gray-300">$12,450</Div>
              </Div>
            </Div>
          </Div>
          <Div className="glass-card hover-glow">
            <Div className="flex justify-between items-center">
              <Div>
                <Div className="font-semibold text-white">NVDA</Div>
                <Div className="text-gray-400 text-sm">25 shares</Div>
              </Div>
              <Div className="text-right">
                <Div className="font-semibold text-red-400">-2.1%</Div>
                <Div className="text-gray-300">$8,750</Div>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default PortfolioPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
