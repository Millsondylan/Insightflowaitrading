
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

export interface StrategyResponse {
  strategyName: string;
  description: string;
  rules: string[];
  entryChecklist: string[];
  warnings: string[];
  backtestTips: string[];
}

const ScrollSection = ({ children, className = "", delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => {
  const { elementRef, isVisible } = useScrollReveal();
  
  return (
    <section 
      ref={elementRef}
      className={`scroll-fade-in scroll-snap-section ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

const StrategyPage = () => {
  const [mockStrategy] = useState<StrategyResponse>({
    strategyName: "Momentum Breakout Alpha",
    description: "A high-frequency momentum strategy designed to capture explosive price movements during market volatility. Combines technical analysis with algorithmic precision for optimal entry timing.",
    rules: [
      "Only enter trades in the direction of the overall trend as determined by the higher timeframe",
      "Wait for price to reach key support/resistance levels before considering entry",
      "Confirm entry signals with volume analysis and indicator confluence",
      "Maintain a risk-to-reward ratio of at least 1:2 for all trades",
      "Avoid trading during major news events or periods of low liquidity"
    ],
    entryChecklist: [
      "Price action shows rejection at support/resistance level",
      "Volume confirms the potential move direction",
      "No immediate news events that could impact price",
      "Position size calculated according to risk management rules",
      "Stop loss and take profit levels clearly defined"
    ],
    warnings: [
      "This strategy may underperform in ranging or choppy market conditions",
      "Extended periods of low volatility may reduce the frequency of valid signals",
      "Always verify signals across multiple indicators to reduce false positives",
      "Backtest thoroughly before trading with real capital"
    ],
    backtestTips: [
      "Test across different market conditions (trending, ranging, volatile)",
      "Include transaction costs and slippage in your backtest calculations",
      "Compare performance against a simple buy-and-hold strategy as baseline",
      "Test various stop-loss and take-profit levels to optimize performance",
      "Document all results systematically for future reference and strategy refinement"
    ]
  });

  return (
    <div className="theme-strategy min-h-screen">
      {/* Hero Section */}
      <ScrollSection className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Visualize Your Edge
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            AI-crafted setups, ready to simulate
          </motion.p>
        </div>
      </ScrollSection>

      {/* Strategy Name */}
      <ScrollSection className="px-6 py-16" delay={100}>
        <div className="max-w-4xl mx-auto glass-section p-12">
          <h2 className="text-4xl md:text-5xl font-bold text-glow-cyan text-center mb-6">
            {mockStrategy.strategyName}
          </h2>
        </div>
      </ScrollSection>

      {/* Description */}
      <ScrollSection className="px-6 py-16" delay={200}>
        <div className="max-w-4xl mx-auto glass-section p-12">
          <p className="text-gray-300 text-lg leading-relaxed text-center">
            {mockStrategy.description}
          </p>
        </div>
      </ScrollSection>

      {/* Rules */}
      <ScrollSection className="px-6 py-16" delay={300}>
        <div className="max-w-4xl mx-auto glass-section p-12">
          <h3 className="text-3xl font-semibold text-cyan-400 mb-8">Rules</h3>
          <ol className="space-y-4 list-decimal list-inside">
            {mockStrategy.rules.map((rule, index) => (
              <li key={index} className="text-gray-300 text-lg leading-relaxed">
                {rule}
              </li>
            ))}
          </ol>
        </div>
      </ScrollSection>

      {/* Entry Checklist */}
      <ScrollSection className="px-6 py-16" delay={400}>
        <div className="max-w-4xl mx-auto glass-section p-12">
          <h3 className="text-3xl font-semibold text-cyan-400 mb-8">Entry Checklist ✅</h3>
          <ul className="space-y-4 list-disc list-inside">
            {mockStrategy.entryChecklist.map((item, index) => (
              <li key={index} className="text-gray-300 text-lg leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </ScrollSection>

      {/* Warning Panel */}
      <ScrollSection className="px-6 py-16" delay={500}>
        <div className="max-w-4xl mx-auto glass-section p-12 border-l-4 border-yellow-400">
          <h3 className="text-3xl font-semibold text-yellow-400 mb-8">⚠️ Warnings</h3>
          <ul className="space-y-4 list-disc list-inside">
            {mockStrategy.warnings.map((warning, index) => (
              <li key={index} className="text-gray-300 text-lg leading-relaxed">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </ScrollSection>

      {/* Backtest Tips */}
      <ScrollSection className="px-6 py-16" delay={600}>
        <div className="max-w-4xl mx-auto glass-section p-12 italic">
          <h3 className="text-3xl font-semibold text-cyan-400 mb-8">Backtest Tips 💡</h3>
          <ul className="space-y-4 list-disc list-inside">
            {mockStrategy.backtestTips.map((tip, index) => (
              <li key={index} className="text-gray-300 text-lg leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </ScrollSection>

      {/* CTA Footer */}
      <ScrollSection className="px-6 py-24" delay={700}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6">
            <button className="glow-button glow-cyan">
              🔁 Backtest Strategy
            </button>
            <button className="glow-button glow-cyan">
              📓 Save to Journal
            </button>
            <button className="glow-button glow-cyan">
              📘 Learn in Academy
            </button>
            <button className="glow-button glow-cyan">
              💬 Share Strategy
            </button>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default StrategyPage;
