import React from 'react';

const BacktestReplayPage: React.FC = () => {
  return (
    <Section className="theme-backtest min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-emerald mb-8"></Section></Section>
          Backtest Replay
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Relive your trading decisions
        </P>
      </Div>

      {/* Timeline Container */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <H2 className="text-3xl font-bold text-white mb-8"></Div></Div>⏱️ Trading Timeline</Div>
        <Div className="relative">
          {/* Timeline Line */}
          <Div className="absolute left-8 top-0 h-full w-0.5 bg-emerald-500/30"></Div>
          
          {/* Timeline Events */}
          <Div className="space-y-8">
            <Div className="flex items-start space-x-6">
              <Div className="w-4 h-4 bg-emerald-400 rounded-full border-4 border-gray-900 relative z-10"></Div>
              <Div className="glass-card flex-1">
                <Div className="flex justify-between items-start mb-2">
                  <Span className="text-emerald-400 font-semibold">Entry Signal</Div>
                  <Span className="text-gray-400 text-sm">09:30 AM</Span>
                </Div>
                <P className="text-gray-300 text-sm">Long TSLA @ $245.50 - RSI oversold + volume spike</P>
              </Div>
            </Div>

            <Div className="flex items-start space-x-6">
              <Div className="w-4 h-4 bg-yellow-400 rounded-full border-4 border-gray-900 relative z-10"></Div>
              <Div className="glass-card flex-1">
                <Div className="flex justify-between items-start mb-2">
                  <Span className="text-yellow-400 font-semibold">Price Movement</Div>
                  <Span className="text-gray-400 text-sm">10:15 AM</Span>
                </Div>
                <P className="text-gray-300 text-sm">+2.3% move to $251.15 - Following support trend</P>
              </Div>
            </Div>

            <Div className="flex items-start space-x-6">
              <Div className="w-4 h-4 bg-red-400 rounded-full border-4 border-gray-900 relative z-10"></Div>
              <Div className="glass-card flex-1">
                <Div className="flex justify-between items-start mb-2">
                  <Span className="text-red-400 font-semibold">Exit Signal</Div>
                  <Span className="text-gray-400 text-sm">11:45 AM</Span>
                </Div>
                <P className="text-gray-300 text-sm">Closed @ $248.90 - Resistance hit, +1.4% gain</P>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Replay Controls */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <Div className="flex items-center justify-center space-x-6">
          <Button className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"></Div>
            <Span className="text-emerald-400">⏮️</Span>
          </Button>
          <Button className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"></Button>
            <Span className="text-emerald-400 text-xl">▶️</Span>
          </Button>
          <Button className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"></Button>
            <Span className="text-emerald-400">⏭️</Span>
          </Button>
        </Div>
      </Div>
    </Section>
  );
};

export default BacktestReplayPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
