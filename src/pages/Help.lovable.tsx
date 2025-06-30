
import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <section className="theme-help min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-indigo mb-8">
          Help Center
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Get the support you need
        </p>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow hover-glow">
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-2">Getting Started</h3>
            <p className="text-gray-300 text-sm">Learn the basics of Insight Flow</p>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-purple-400 mb-2">Strategies</h3>
            <p className="text-gray-300 text-sm">Build and optimize trading strategies</p>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Analytics</h3>
            <p className="text-gray-300 text-sm">Understand your performance metrics</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-8">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="glass-card">
            <h4 className="font-semibold text-indigo-400 mb-2">How do I create my first strategy?</h4>
            <p className="text-gray-300 text-sm">Navigate to the Strategy page and use our AI-powered builder to create custom trading strategies.</p>
          </div>
          <div className="glass-card">
            <h4 className="font-semibold text-purple-400 mb-2">Can I backtest my strategies?</h4>
            <p className="text-gray-300 text-sm">Yes! Use the Backtest feature to test your strategies against historical market data.</p>
          </div>
          <div className="glass-card">
            <h4 className="font-semibold text-blue-400 mb-2">How does the journal feature work?</h4>
            <p className="text-gray-300 text-sm">The journal helps you track your trading psychology and learn from past decisions with AI insights.</p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '300ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">💬 Contact Support</h2>
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-300 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
          <button className="glow-button glow-indigo px-8 py-3">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelpPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
