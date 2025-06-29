
import React from 'react';

const StrategyExportPage: React.FC = () => {
  return (
    <Section className="theme-strategy min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8"></Section>
          Export Strategy
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Share your trading strategies
        </P>
      </Div>

      {/* Export Options */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <H2 className="text-3xl font-bold text-white mb-8"></Div>📤 Export Formats</Div>
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Div className="glass-card hover-glow text-center">
            <Div className="text-3xl mb-4">📄</Div>
            <H3 className="text-lg font-semibold text-cyan-400 mb-2">PDF Report</H3>
            <P className="text-gray-300 text-sm mb-4">Comprehensive strategy documentation</P>
            <Button className="glow-button glow-cyan px-4 py-2 text-sm">
              Export PDF
            </Button>
          </Div>
          <Div className="glass-card hover-glow text-center">
            <Div className="text-3xl mb-4">📊</Div>
            <H3 className="text-lg font-semibold text-blue-400 mb-2">Excel Sheet</H3>
            <P className="text-gray-300 text-sm mb-4">Data analysis and calculations</P>
            <Button className="glow-button glow-blue px-4 py-2 text-sm">
              Export Excel
            </Button>
          </Div>
          <Div className="glass-card hover-glow text-center">
            <Div className="text-3xl mb-4">🔗</Div>
            <H3 className="text-lg font-semibold text-teal-400 mb-2">JSON Data</H3>
            <P className="text-gray-300 text-sm mb-4">Machine-readable format</P>
            <Button className="glow-button glow-teal px-4 py-2 text-sm">
              Export JSON
            </Button>
          </Div>
        </Div>
      </Div>

      {/* Export Settings */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-3xl font-bold text-white mb-6"></Div>⚙️ Export Settings</Div>
        <Div className="space-y-4">
          <Div className="glass-card">
            <Div className="flex justify-between items-center">
              <Span className="text-gray-300"></Div>Include Backtest Results</Div>
              <Div className="w-12 h-6 bg-cyan-500/20 rounded-full border border-cyan-400/30"></Div>
            </Div>
          </Div>
          <Div className="glass-card">
            <Div className="flex justify-between items-center">
              <Span className="text-gray-300"></Div>Include Risk Metrics</Div>
              <Div className="w-12 h-6 bg-cyan-500/20 rounded-full border border-cyan-400/30"></Div>
            </Div>
          </Div>
          <Div className="glass-card">
            <Div className="flex justify-between items-center">
              <Span className="text-gray-300"></Div>Include Charts</Div>
              <Div className="w-12 h-6 bg-cyan-500/20 rounded-full border border-cyan-400/30"></Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default StrategyExportPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
