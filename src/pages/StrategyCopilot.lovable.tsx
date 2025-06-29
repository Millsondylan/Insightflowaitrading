
import React from 'react';

const StrategyCopilotPage: React.FC = () => {
  return (
    <Section className="theme-strategy min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8"></Section>
          Strategy Copilot
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          AI-powered strategy assistance
        </P>
      </Div>

      {/* Question Blocks */}
      <Div className="space-y-6 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <Div className="glass-section motion-shadow hover-glow">
          <Div className="flex items-start space-x-4">
            <Div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Span className="text-cyan-400"></Div>?</Div>
            </Div>
            <Div className="flex-1">
              <H3 className="text-lg font-semibold text-cyan-400 mb-2"></Div>Strategy Analysis</Div>
              <P className="text-gray-300 mb-4">What market conditions favor your current approach?</P>
              <Div className="flex space-x-2">
                <Button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors">
                  Bullish
                </Div>
                <Button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors">
                  Bearish
                </Button>
                <Button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors">
                  Sideways
                </Button>
              </Div>
            </Div>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow hover-glow">
          <Div className="flex items-start space-x-4">
            <Div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Span className="text-blue-400"></Div>💡</Div>
            </Div>
            <Div className="flex-1">
              <H3 className="text-lg font-semibold text-blue-400 mb-2"></Div>Risk Management</Div>
              <P className="text-gray-300 mb-4">Optimize your position sizing and stop-loss levels</P>
              <Div className="h-4 bg-blue-500/10 rounded-full overflow-hidden">
                <Div className="h-full w-3/4 bg-blue-500/30 rounded-full"></Div>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Suggestions */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-3xl font-bold text-white mb-6"></Div>🎯 AI Suggestions</Div>
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Div className="glass-card hover-glow">
            <H4 className="font-semibold text-teal-400 mb-2"></Div>Entry Signal</Div>
            <P className="text-gray-300 text-sm">Consider entering long positions on RSI oversold conditions with volume confirmation</P>
          </Div>
          <Div className="glass-card hover-glow">
            <H4 className="font-semibold text-emerald-400 mb-2"></Div>Exit Strategy</Div>
            <P className="text-gray-300 text-sm">Trail stops at 1.5x ATR to capture momentum while protecting gains</P>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default StrategyCopilotPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
