
import React from 'react';

const FAQPage: React.FC = () => {
  return (
    <Section className="theme-help min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-indigo mb-8" /></Section /></Section />
          FAQ
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Answers to common questions
        </P>
      </Div>

      {/* FAQ Categories */}
      <Div className="space-y-8 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <Div className="glass-section motion-shadow">
          <H2 className="text-2xl font-bold text-indigo-400 mb-6"></Div>🚀 Getting Started</Div>
          <Div className="space-y-4">
            <Div className="glass-card">
              <H4 className="font-semibold text-white mb-2"></Div>What is Insight Flow?</Div>
              <P className="text-gray-300 text-sm">Insight Flow is an AI-powered trading platform that helps you develop, test, and optimize trading strategies.</P>
            </Div>
            <Div className="glass-card">
              <H4 className="font-semibold text-white mb-2"></Div>How do I get started?</Div>
              <P className="text-gray-300 text-sm">Sign up for an account and explore our Strategy Builder to create your first trading strategy.</P>
            </Div>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow">
          <H2 className="text-2xl font-bold text-purple-400 mb-6"></Div>💰 Pricing & Plans</Div>
          <Div className="space-y-4">
            <Div className="glass-card">
              <H4 className="font-semibold text-white mb-2"></Div>Do you offer a free trial?</Div>
              <P className="text-gray-300 text-sm">Yes! New users get access to basic features with limited backtesting credits.</P>
            </Div>
            <Div className="glass-card">
              <H4 className="font-semibold text-white mb-2"></Div>What payment methods do you accept?</Div>
              <P className="text-gray-300 text-sm">We accept crypto payments including Bitcoin, Ethereum, and USDT on TRON.</P>
            </Div>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow">
          <H2 className="text-2xl font-bold text-blue-400 mb-6"></Div>🛠️ Technical</Div>
          <Div className="space-y-4">
            <Div className="glass-card">
              <H4 className="font-semibold text-white mb-2"></Div>How accurate is the backtesting?</Div>
              <P className="text-gray-300 text-sm">Our backtesting engine uses high-quality historical data with realistic slippage and commission modeling.</P>
            </Div>
            <Div className="glass-card">
              <H4 className="font-semibold text-white mb-2"></Div>Can I export my strategies?</Div>
              <P className="text-gray-300 text-sm">Yes! Export your strategies in multiple formats including PDF reports and JSON data.</P>
            </Div>
          </Div>
        </Div>
      </div />
  );
};

export default FAQPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
