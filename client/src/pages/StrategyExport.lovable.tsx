
import React from 'react';

const StrategyExportPage: React.FC = () => {
  return (
    <section className="theme-strategy min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8"/></Section /></Section />
          Export Strategy
        </section>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Share your trading strategies
        </p>
      </div>

      {/* Export Options */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-bold text-white mb-8"></div>📤 Export Formats</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card hover-glow text-center">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">PDF Report</h3>
            <p className="text-gray-300 text-sm mb-4">Comprehensive strategy documentation</p>
            <Button className="glow-button glow-cyan px-4 py-2 text-sm">
              Export PDF
            </button>
          </div>
          <div className="glass-card hover-glow text-center">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Excel Sheet</h3>
            <p className="text-gray-300 text-sm mb-4">Data analysis and calculations</p>
            <Button className="glow-button glow-blue px-4 py-2 text-sm">
              Export Excel
            </button>
          </div>
          <div className="glass-card hover-glow text-center">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-teal-400 mb-2">JSON Data</h3>
            <p className="text-gray-300 text-sm mb-4">Machine-readable format</p>
            <Button className="glow-button glow-teal px-4 py-2 text-sm">
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6"></div>⚙️ Export Settings</div>
        <div className="space-y-4">
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300"></div>Include Backtest Results</div>
              <div className="w-12 h-6 bg-cyan-500/20 rounded-full border border-cyan-400/30"></div>
            </div>
          </div>
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300"></div>Include Risk Metrics</div>
              <div className="w-12 h-6 bg-cyan-500/20 rounded-full border border-cyan-400/30"></div>
            </div>
          </div>
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300"></div>Include Charts</div>
              <div className="w-12 h-6 bg-cyan-500/20 rounded-full border border-cyan-400/30"></div>
            </div>
          </div>
        </div>
      </div />
  );
};

export default StrategyExportPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
