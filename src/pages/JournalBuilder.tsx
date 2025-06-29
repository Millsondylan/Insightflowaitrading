import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const JournalBuilderPage: React.FC = () => {
  return (
    <Div className="theme-journal scroll-container min-h-screen">
      {/* Hero Section */}
      <ScrollSection className="min-h-screen flex items-center justify-center px-6" delay={0}>
        <Div className="text-center max-w-5xl mx-auto">
          <H1 className="text-6xl md:text-8xl font-bold text-glow-violet mb-8 leading-tight"></Div></Div>
            Your Trading Mind, Captured
          </Div>
          <P className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            Record, reflect, and evolve your trading psychology
          </P>
          <Div className="mt-12">
            <Div className="threadline-glow w-40 mx-auto"></Div>
          </Div>
        </Div>
      </ScrollSection>

      {/* New Entry Section */}
      <ScrollSection className="px-6 py-20" delay={100}>
        <Div className="max-w-6xl mx-auto">
          <Div className="glass-section motion-shadow">
            <Div className="text-center mb-8">
              <Div className="inline-block px-4 py-2 bg-violet-500/10 border border-violet-400/30 rounded-full text-violet-300 text-sm font-medium mb-6">
                📝 New Journal Entry
              </ScrollSection>
              <H2 className="text-3xl md:text-4xl font-semibold text-glow-magenta mb-4">
                Document Your Journey
              </H2>
            </Div>
            
            {/* Form Grid */}
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-300"></Div></Div>Trade Symbol</Div>
                <Div className="bg-white/5 h-12 rounded-xl border border-white/10"></Div>
              </Div>
              <Div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-300"></Div></Div>Entry Price</Div>
                <Div className="bg-white/5 h-12 rounded-xl border border-white/10"></Div>
              </Div>
              <Div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-300"></Div></Div>Exit Price</Div>
                <Div className="bg-white/5 h-12 rounded-xl border border-white/10"></Div>
              </Div>
            </Div>
            
            <Div className="mt-8">
              <Label className="block text-sm font-medium text-gray-300 mb-3"></Div></Div>Trade Reflection</Div>
              <Div className="bg-white/5 h-32 rounded-xl border border-white/10"></Div>
            </Div>
            
            <Div className="mt-8 text-center">
              <Button className="glow-button glow-violet text-lg px-8 py-4"></Div>
                Save Entry
              </Button>
            </Div>
          </Div>
        </Div>
      </ScrollSection>

      {/* Recent Entries Timeline */}
      <ScrollSection className="px-6 py-20" delay={200} animation="slide-right">
        <Div className="max-w-6xl mx-auto">
          <Div className="mb-12 text-center">
            <H3 className="text-3xl md:text-4xl font-semibold text-glow-magenta mb-4"></ScrollSection></ScrollSection>📓 Recent Entries</ScrollSection>
            <Div className="threadline-glow w-24 mx-auto"></Div>
          </Div>
          
          <Div className="space-y-8">
            {/* Entry Card 1 */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="flex justify-between items-start mb-4">
                <Div>
                  <H4 className="text-xl font-semibold text-white mb-2"></Div></Div>TSLA Momentum Play</Div>
                  <P className="text-gray-400 text-sm">January 15, 2024</P>
                </Div>
                <Div className="text-right">
                  <Div className="sentiment-bullish mb-2">🟢 Bullish</Div>
                  <Div className="text-emerald-400 font-bold">+12.5%</Div>
                </Div>
              </Div>
              <P className="text-gray-300 leading-relaxed">
                Journal entry reflection placeholder text about the trade psychology and decision-making process...
              </P>
            </Div>

            {/* Entry Card 2 */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="flex justify-between items-start mb-4">
                <Div>
                  <H4 className="text-xl font-semibold text-white mb-2"></Div></Div>SPY Put Hedge</Div>
                  <P className="text-gray-400 text-sm">January 12, 2024</P>
                </Div>
                <Div className="text-right">
                  <Div className="sentiment-bearish mb-2">🔴 Bearish</Div>
                  <Div className="text-red-400 font-bold">-3.2%</Div>
                </Div>
              </Div>
              <P className="text-gray-300 leading-relaxed">
                Another journal entry placeholder reflecting on risk management and emotional discipline...
              </P>
            </Div>

            {/* Entry Card 3 */}
            <Div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
              <Div className="flex justify-between items-start mb-4">
                <Div>
                  <H4 className="text-xl font-semibold text-white mb-2"></Div></Div>NVDA Breakout</Div>
                  <P className="text-gray-400 text-sm">January 10, 2024</P>
                </Div>
                <Div className="text-right">
                  <Div className="sentiment-bullish mb-2">🟢 Bullish</Div>
                  <Div className="text-emerald-400 font-bold">+8.7%</Div>
                </Div>
              </Div>
              <P className="text-gray-300 leading-relaxed">
                Trade psychology notes and lessons learned from this successful momentum trade...
              </P>
            </Div>
          </Div>
        </Div>
      </ScrollSection>

      {/* Insights Section */}
      <ScrollSection className="px-6 py-32" delay={300} animation="scale-in">
        <Div className="max-w-4xl mx-auto text-center">
          <Div className="glass-section motion-shadow">
            <H4 className="text-2xl md:text-3xl font-semibold text-glow-violet mb-6"></ScrollSection></ScrollSection>🧠 AI Insights</ScrollSection>
            <P className="text-gray-300 text-lg mb-8">
              Your trading patterns and psychological trends are being analyzed to help you improve
            </P>
            <Div className="flex flex-wrap justify-center gap-4">
              <Div className="px-4 py-2 bg-violet-500/20 border border-violet-400/30 rounded-full text-violet-300 text-sm">
                Risk Management: Strong
              </Div>
              <Div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm">
                Patience Level: Improving
              </Div>
              <Div className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full text-yellow-300 text-sm">
                FOMO Tendency: Monitor
              </Div>
            </Div>
          </Div>
        </Div>
      </ScrollSection>
    </Div>
  );
};

export default JournalBuilderPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
