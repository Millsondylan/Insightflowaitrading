
import { ScrollSection } from '../hooks/use-scroll-reveal';

export interface StrategyResponse {
  strategyName: string;
  description: string;
  rules: string[];
  entryChecklist: string[];
  warnings: string[];
  backtestTips: string[];
}

const StrategyPage = () => {
  const mockStrategy: StrategyResponse = {
    strategyName: "Momentum Breakout Alpha",
    description: "A high-frequency momentum strategy designed to capitalize on explosive price movements during periods of elevated market volatility. This approach combines technical analysis with algorithmic precision to identify optimal entry points.",
    rules: [
      "Only enter trades in the direction of the prevailing trend as determined by higher timeframe analysis",
      "Wait for price to reach established support/resistance levels before considering position entry",
      "Confirm all entry signals with volume analysis and indicator confluence across multiple timeframes",
      "Maintain a minimum risk-to-reward ratio of 1:2 for all trade setups",
      "Avoid trading during major news events or periods of significantly reduced market liquidity"
    ],
    entryChecklist: [
      "Price action demonstrates clear rejection at key support or resistance level",
      "Volume profile confirms the potential directional move with increasing participation",
      "No immediate high-impact news events scheduled that could disrupt price action",
      "Position size calculated according to established risk management parameters",
      "Stop loss and take profit levels clearly defined and logged before entry"
    ],
    warnings: [
      "This strategy may significantly underperform during ranging or choppy market conditions",
      "Extended periods of low volatility may substantially reduce the frequency of valid signals",
      "Always verify signals across multiple technical indicators to minimize false positive entries",
      "Conduct thorough backtesting across various market conditions before deploying real capital"
    ],
    backtestTips: [
      "Test strategy performance across different market regimes (trending, ranging, high volatility)",
      "Include realistic transaction costs, slippage, and spread calculations in backtest models",
      "Compare strategy performance against simple buy-and-hold benchmark for context",
      "Optimize stop-loss and take-profit levels through systematic parameter testing",
      "Maintain detailed documentation of all backtest results for future strategy refinement"
    ]
  };

  return (
    <div className="theme-strategy scroll-container">
      {/* Hero Section */}
      <ScrollSection className="min-h-screen flex items-center justify-center px-6" delay={0}>
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8 leading-tight">
            Visualize Your Edge
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            AI-crafted strategies from your own intuition
          </p>
          <div className="mt-12">
            <div className="threadline-glow w-32 mx-auto"></div>
          </div>
        </div>
      </ScrollSection>

      {/* Strategy Name */}
      <ScrollSection className="px-6 py-20" delay={100}>
        <div className="max-w-5xl mx-auto glass-section motion-shadow">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-6">
              ✏️ Strategy Description
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-glow-cyan mb-8">
              {mockStrategy.strategyName}
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
              {mockStrategy.description}
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* Strategy Rules */}
      <ScrollSection className="px-6 py-20" delay={200} animation="slide-right">
        <div className="max-w-5xl mx-auto glass-section motion-shadow">
          <div className="flex items-center mb-8">
            <span className="text-3xl mr-4">🧠</span>
            <h3 className="text-3xl md:text-4xl font-semibold text-cyan-400">Strategy Rules</h3>
          </div>
          <div className="space-y-6">
            {mockStrategy.rules.map((rule, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 glass-card hover:bg-black/30 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-300 font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Entry Checklist */}
      <ScrollSection className="px-6 py-20" delay={300}>
        <div className="max-w-5xl mx-auto glass-section motion-shadow">
          <div className="flex items-center mb-8">
            <span className="text-3xl mr-4">✅</span>
            <h3 className="text-3xl md:text-4xl font-semibold text-cyan-400">Entry Checklist</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mockStrategy.entryChecklist.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 glass-card hover:bg-black/30 transition-all duration-300">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 border border-green-400/30 rounded flex items-center justify-center">
                  <span className="text-green-300 text-sm">✓</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Warning Panel */}
      <ScrollSection className="px-6 py-20" delay={400} animation="scale-in">
        <div className="max-w-5xl mx-auto glass-section warning-panel motion-shadow">
          <div className="flex items-center mb-8">
            <span className="text-3xl mr-4">⚠️</span>
            <h3 className="text-3xl md:text-4xl font-semibold text-yellow-400">Critical Warnings</h3>
          </div>
          <div className="space-y-4">
            {mockStrategy.warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-yellow-500/5 border border-yellow-400/20 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500/20 border border-yellow-400/30 rounded flex items-center justify-center">
                  <span className="text-yellow-300 text-sm">!</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* Backtest Tips */}
      <ScrollSection className="px-6 py-20" delay={500}>
        <div className="max-w-5xl mx-auto glass-section motion-shadow">
          <div className="flex items-center mb-8">
            <span className="text-3xl mr-4">📊</span>
            <h3 className="text-3xl md:text-4xl font-semibold text-cyan-400">Backtest Optimization</h3>
          </div>
          <div className="italic text-gray-300 space-y-4">
            {mockStrategy.backtestTips.map((tip, index) => (
              <p key={index} className="text-lg leading-relaxed p-4 glass-card hover:bg-black/30 transition-all duration-300">
                "{tip}"
              </p>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* CTA Footer */}
      <ScrollSection className="px-6 py-32" delay={600}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h4 className="text-2xl md:text-3xl font-semibold text-glow-cyan mb-4">Ready to Execute?</h4>
            <p className="text-gray-400 text-lg">Take your strategy to the next level</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="glow-button glow-cyan text-lg px-8 py-4">
              🔁 Backtest Strategy
            </button>
            <button className="glow-button glow-cyan text-lg px-8 py-4">
              📓 Save to Journal
            </button>
            <button className="glow-button glow-cyan text-lg px-8 py-4">
              📘 Learn in Academy
            </button>
            <button className="glow-button glow-cyan text-lg px-8 py-4">
              💬 Share Strategy
            </button>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default StrategyPage;
