
import React from 'react';

const FAQPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          FAQ
        </h1>
        <p >
          Answers to common questions
        </p>
      </div>

      {/* FAQ Categories */}
      <div style={{ marginTop: "32px" }} style={{ animationDelay: '100ms' }}>
        <div >
          <h2 style={{ fontWeight: "700" }}>🚀 Getting Started</h2>
          <div >
            <div >
              <h4 style={{ color: "white" }}>What is Insight Flow?</h4>
              <p >Insight Flow is an AI-powered trading platform that helps you develop, test, and optimize trading strategies.</p>
            </div>
            <div >
              <h4 style={{ color: "white" }}>How do I get started?</h4>
              <p >Sign up for an account and explore our Strategy Builder to create your first trading strategy.</p>
            </div>
          </div>
        </div>

        <div >
          <h2 style={{ fontWeight: "700" }}>💰 Pricing & Plans</h2>
          <div >
            <div >
              <h4 style={{ color: "white" }}>Do you offer a free trial?</h4>
              <p >Yes! New users get access to basic features with limited backtesting credits.</p>
            </div>
            <div >
              <h4 style={{ color: "white" }}>What payment methods do you accept?</h4>
              <p >We accept crypto payments including Bitcoin, Ethereum, and USDT on TRON.</p>
            </div>
          </div>
        </div>

        <div >
          <h2 style={{ fontWeight: "700" }}>🛠️ Technical</h2>
          <div >
            <div >
              <h4 style={{ color: "white" }}>How accurate is the backtesting?</h4>
              <p >Our backtesting engine uses high-quality historical data with realistic slippage and commission modeling.</p>
            </div>
            <div >
              <h4 style={{ color: "white" }}>Can I export my strategies?</h4>
              <p >Yes! Export your strategies in multiple formats including PDF reports and JSON data.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQPage;
