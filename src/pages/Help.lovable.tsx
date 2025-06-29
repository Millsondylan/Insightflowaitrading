
import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Help Center
        </h1>
        <p >
          Get the support you need
        </p>
      </div>

      {/* Help Categories */}
      <div  style={{ animationDelay: '100ms' }}>
        <div >
          <div >
            <div style={{ marginBottom: "16px" }}>🚀</div>
            <h3 >Getting Started</h3>
            <p >Learn the basics of Insight Flow</p>
          </div>
        </div>

        <div >
          <div >
            <div style={{ marginBottom: "16px" }}>🧠</div>
            <h3 >Strategies</h3>
            <p >Build and optimize trading strategies</p>
          </div>
        </div>

        <div >
          <div >
            <div style={{ marginBottom: "16px" }}>📊</div>
            <h3 >Analytics</h3>
            <p >Understand your performance metrics</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "32px" }}>❓ Frequently Asked Questions</h2>
        <div >
          <div >
            <h4 >How do I create my first strategy?</h4>
            <p >Navigate to the Strategy page and use our AI-powered builder to create custom trading strategies.</p>
          </div>
          <div >
            <h4 >Can I backtest my strategies?</h4>
            <p >Yes! Use the Backtest feature to test your strategies against historical market data.</p>
          </div>
          <div >
            <h4 >How does the journal feature work?</h4>
            <p >The journal helps you track your trading psychology and learn from past decisions with AI insights.</p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div  style={{ animationDelay: '300ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>💬 Contact Support</h2>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <p >Can't find what you're looking for? Our support team is here to help.</p>
          <button >
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelpPage;
