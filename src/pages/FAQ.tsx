
import React from 'react';

const FAQPage: React.FC = () => {
  return (
    <section className="theme-help min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-indigo mb-8"/></section></section>
          FAQ
        </section>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Answers to common questions
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow">
          <h2 className="text-2xl font-bold text-indigo-400 mb-6"></div>🚀 Getting Started</div>
          <div className="space-y-4">
            <div className="glass-card">
              <h4 className="font-semibold text-white mb-2"></div>What is Insight Flow?</div>
              <p className="text-gray-300 text-sm">Insight Flow is an AI-powered trading platform that helps you develop, test, and optimize trading strategies.</p>
            </div>
            <div className="glass-card">
              <h4 className="font-semibold text-white mb-2"></div>How do I get started?</div>
              <p className="text-gray-300 text-sm">Sign up for an account and explore our Strategy Builder to create your first trading strategy.</p>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow">
          <h2 className="text-2xl font-bold text-purple-400 mb-6"></div>💰 Pricing & Plans</div>
          <div className="space-y-4">
            <div className="glass-card">
              <h4 className="font-semibold text-white mb-2"></div>Do you offer a free trial?</div>
              <p className="text-gray-300 text-sm">Yes! New users get access to basic features with limited backtesting credits.</p>
            </div>
            <div className="glass-card">
              <h4 className="font-semibold text-white mb-2"></div>What payment methods do you accept?</div>
              <p className="text-gray-300 text-sm">We accept crypto payments including Bitcoin, Ethereum, and USDT on TRON.</p>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow">
          <h2 className="text-2xl font-bold text-blue-400 mb-6"></div>🛠️ Technical</div>
          <div className="space-y-4">
            <div className="glass-card">
              <h4 className="font-semibold text-white mb-2"></div>How accurate is the backtesting?</div>
              <p className="text-gray-300 text-sm">Our backtesting engine uses high-quality historical data with realistic slippage and commission modeling.</p>
            </div>
            <div className="glass-card">
              <h4 className="font-semibold text-white mb-2"></div>Can I export my strategies?</div>
              <p className="text-gray-300 text-sm">Yes! Export your strategies in multiple formats including PDF reports and JSON data.</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FAQPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
