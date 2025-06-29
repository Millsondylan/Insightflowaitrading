
import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <Section className="theme-help min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-indigo mb-8"></Section></Section>
          Help Center
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Get the support you need
        </P>
      </Div>

      {/* Help Categories */}
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <Div className="glass-section motion-shadow hover-glow">
          <Div className="text-center">
            <Div className="text-4xl mb-4">🚀</Div>
            <H3 className="text-xl font-semibold text-indigo-400 mb-2">Getting Started</H3>
            <P className="text-gray-300 text-sm">Learn the basics of Insight Flow</P>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow hover-glow">
          <Div className="text-center">
            <Div className="text-4xl mb-4">🧠</Div>
            <H3 className="text-xl font-semibold text-purple-400 mb-2">Strategies</H3>
            <P className="text-gray-300 text-sm">Build and optimize trading strategies</P>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow hover-glow">
          <Div className="text-center">
            <Div className="text-4xl mb-4">📊</Div>
            <H3 className="text-xl font-semibold text-blue-400 mb-2">Analytics</H3>
            <P className="text-gray-300 text-sm">Understand your performance metrics</P>
          </Div>
        </Div>
      </Div>

      {/* FAQ Section */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-3xl font-bold text-white mb-8"></Div></Div>❓ Frequently Asked Questions</Div>
        <Div className="space-y-4">
          <Div className="glass-card">
            <H4 className="font-semibold text-indigo-400 mb-2"></Div></Div>How do I create my first strategy?</Div>
            <P className="text-gray-300 text-sm">Navigate to the Strategy page and use our AI-powered builder to create custom trading strategies.</P>
          </Div>
          <Div className="glass-card">
            <H4 className="font-semibold text-purple-400 mb-2"></Div></Div>Can I backtest my strategies?</Div>
            <P className="text-gray-300 text-sm">Yes! Use the Backtest feature to test your strategies against historical market data.</P>
          </Div>
          <Div className="glass-card">
            <H4 className="font-semibold text-blue-400 mb-2"></Div></Div>How does the journal feature work?</Div>
            <P className="text-gray-300 text-sm">The journal helps you track your trading psychology and learn from past decisions with AI insights.</P>
          </Div>
        </Div>
      </Div>

      {/* Contact Support */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '300ms' }}>
        <H2 className="text-3xl font-bold text-white mb-6 text-center"></Div></Div>💬 Contact Support</Div>
        <Div className="max-w-md mx-auto text-center">
          <P className="text-gray-300 mb-6"></Div></Div>Can't find what you're looking for? Our support team is here to help.</Div>
          <Button className="glow-button glow-indigo px-8 py-3">
            Contact Support
          </Button>
        </Div>
      </Div>
    </Section>
  );
};

export default HelpPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
