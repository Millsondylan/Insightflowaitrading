import React from 'react';

const BacktestReplayPage: React.FC = () => {
  return (
    <section className="theme-backtest min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-emerald mb-8"/></section></section>
          Backtest Replay
        </section>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Relive your trading decisions
        </p>
      </div>

      {/* Timeline Container */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-bold text-white mb-8"></div>⏱️ Trading Timeline</div>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-emerald-500/30"></div>
          
          {/* Timeline Events */}
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-4 h-4 bg-emerald-400 rounded-full border-4 border-gray-900 relative z-10"></div>
              <div className="glass-card flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-emerald-400 font-semibold">Entry Signal</div>
                  <span className="text-gray-400 text-sm">09:30 AM</span>
                </div>
                <p className="text-gray-300 text-sm">Long TSLA @ $245.50 - RSI oversold + volume spike</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-4 h-4 bg-yellow-400 rounded-full border-4 border-gray-900 relative z-10"></div>
              <div className="glass-card flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-yellow-400 font-semibold">Price Movement</div>
                  <span className="text-gray-400 text-sm">10:15 AM</span>
                </div>
                <p className="text-gray-300 text-sm">+2.3% move to $251.15 - Following support trend</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-4 h-4 bg-red-400 rounded-full border-4 border-gray-900 relative z-10"></div>
              <div className="glass-card flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-red-400 font-semibold">Exit Signal</div>
                  <span className="text-gray-400 text-sm">11:45 AM</span>
                </div>
                <p className="text-gray-300 text-sm">Closed @ $248.90 - Resistance hit, +1.4% gain</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replay Controls */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-center space-x-6">
          <Button className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"></div>
            <span className="text-emerald-400">⏮️</span>
          </button>
          <Button className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"></button>
            <span className="text-emerald-400 text-xl">▶️</span>
          </button>
          <Button className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"></button>
            <span className="text-emerald-400">⏭️</span>
          </button>
        </div>
      </div>
  );
};

export default BacktestReplayPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
