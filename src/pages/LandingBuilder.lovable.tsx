
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';

const LandingBuilderPage: React.FC = () => {
  return (
    <Div className="scroll-container min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Hero Section */}
      <scrollsection  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Div className="text-center max-w-6xl mx-auto">
          <H1 className="text-7xl md:text-9xl font-bold mb-8 leading-tight">
            <Span className="text-glow-cyan">Insight</Div>{' '}
            <Span className="text-glow-violet">Flow</Span>
          </H1>
          <P className="text-2xl md:text-4xl text-gray-300 leading-relaxed font-light mb-12">
            Where Trading Intelligence Meets Intuition
          </P>
          <Div className="threadline-glow w-48 mx-auto mb-16"></Div>
          
          {/* Navigation Cards */}
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link to="/strategy">
              <Div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <Div className="text-4xl mb-4 text-cyan-400">🧠</Div>
                <H3 className="text-xl font-semibold text-glow-cyan mb-3">Strategy Builder</H3>
                <P className="text-gray-400">AI-powered strategy generation from your trading intuition</P>
              </div />
            
            <Link to="/journal" />
              <Div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <Div className="text-4xl mb-4 text-violet-400">📓</Link>
                <H3 className="text-xl font-semibold text-glow-magenta mb-3">Trade Journal</H3>
                <P className="text-gray-400">Capture and reflect on your trading psychology</P>
              </div />
            
            <Link to="/academy">
              <Div className="glass-section motion-shadow hover:scale-105 transition-all duration-300 cursor-pointer">
                <Div className="text-4xl mb-4 text-blue-400">📘</Link>
                <H3 className="text-xl font-semibold text-glow-blue mb-3">Trading Academy</H3>
                <P className="text-gray-400">Structured learning for trading mastery</P>
              </div />
          </Div>
        </div />

      {/* Features Preview */}
      <Scrollsection animation="slide-right" / />
        <Div className="max-w-7xl mx-auto">
          <Div className="text-center mb-16">
            <H2 className="text-4xl md:text-6xl font-bold text-white mb-6"></Scrollsection>
              Built for Modern Traders
            </Div>
            <P className="text-xl text-gray-400 max-w-3xl mx-auto">
              Combining cutting-edge AI with deep market psychology insights
            </P>
          </Div>
          
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Div className="space-y-8">
              <Div className="glass-card">
                <Div className="flex items-start space-x-4">
                  <Div className="w-8 h-8 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-300 flex-shrink-0 mt-1">
                    ✨
                  </Div>
                  <Div>
                    <H4 className="text-lg font-semibold text-white mb-2"></Div>AI Strategy Generation</Div>
                    <P className="text-gray-400">Transform your trading ideas into structured, backtestable strategies</P>
                  </Div>
                </Div>
              </Div>
              
              <Div className="glass-card">
                <Div className="flex items-start space-x-4">
                  <Div className="w-8 h-8 bg-violet-500/20 border border-violet-400/30 rounded-full flex items-center justify-center text-violet-300 flex-shrink-0 mt-1">
                    🧠
                  </Div>
                  <Div>
                    <H4 className="text-lg font-semibold text-white mb-2"></Div>Psychology Tracking</Div>
                    <P className="text-gray-400">Identify patterns in your decision-making and emotional responses</P>
                  </Div>
                </Div>
              </Div>
              
              <Div className="glass-card">
                <Div className="flex items-start space-x-4">
                  <Div className="w-8 h-8 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center text-blue-300 flex-shrink-0 mt-1">
                    📈
                  </Div>
                  <Div>
                    <H4 className="text-lg font-semibold text-white mb-2"></Div>Adaptive Learning</Div>
                    <P className="text-gray-400">Personalized education that evolves with your trading journey</P>
                  </Div>
                </Div>
              </Div>
            </Div>
            
            <Div className="glass-section">
              <Div className="h-80 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-xl border border-white/10 flex items-center justify-center">
                <Div className="text-center">
                  <Div className="text-6xl mb-4">📊</Div>
                  <P className="text-gray-400">Interactive Demo Placeholder</P>
                </Div>
              </Div>
            </Div>
          </Div>
        </div />

      {/* Call to Action */}
      <scrollsection animation="scale-in">
        <Div className="max-w-4xl mx-auto text-center">
          <Div className="glass-section motion-shadow">
            <H3 className="text-3xl md:text-5xl font-bold text-white mb-6"></Div>
              Ready to Elevate Your Trading?
            </Div>
            <P className="text-xl text-gray-400 mb-12">
              Join thousands of traders who've transformed their approach with Insight Flow
            </P>
            <Div className="flex flex-wrap justify-center gap-6">
              <Link to="/strategy">
                <Button className="glow-button glow-cyan text-lg px-8 py-4"></Div>
                  Start Building Strategies
                </div />
              <Link to="/academy">
                <Button className="glow-button glow-blue text-lg px-8 py-4" /></Link /></Link />
                  Begin Learning
                </Link />
            </Link>
          </Div>
        </div />
    </Div>
  );
};

export default LandingBuilderPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
