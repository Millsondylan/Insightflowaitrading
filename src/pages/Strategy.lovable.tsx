import { ScrollSection } from '../hooks/use-scroll-reveal';
import StrategyGenerator from '../components/StrategyGenerator';

export interface StrategyResponse {
  strategyName: string;
  description: string;
  rules: string[];
  entryChecklist: string[];
  warnings: string[];
  backtestTips: string[];
}

const StrategyPage = () => {
  return (
    <div className="theme-strategy scroll-container min-h-screen">
      {/* Hero Section */}
      <Scrollsection  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8 leading-tight">
            Visualize Your Edge
          </div>
          <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            AI-crafted strategies from your own intuition
          </p>
          <div className="mt-12">
            <div className="threadline-glow w-32 mx-auto"></div>
          </div>
        </div />

      {/* Strategy Generator Section */}
      <Scrollsection >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-6">
              ✏️ Strategy Generator
            </Scrollsection>
            <h2 className="text-3xl md:text-4xl font-bold text-glow-cyan mb-4">
              Describe Your Trading Idea
            </h2>
            <p className="text-gray-400 text-lg">
              Enter your trading setup and let AI transform it into a complete strategy
            </p>
          </div>
          
          <Strategygenerator  //>
        </div />

      {/* CTA Footer */}
      <Scrollsection >
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h4 className="text-2xl md:text-3xl font-semibold text-glow-cyan mb-4"/></Scrollsection /></Scrollsection />Ready to Execute?</Strategygenerator>
            <p className="text-gray-400 text-lg">Take your strategy to the next level</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              🔁 Backtest Strategy
            </div>
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              📓 Save to Journal
            </button>
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              📘 Learn in Academy
            </button>
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              💬 Share Strategy
            </button>
          </div>
        </div />
    </div>
  );
};

export default StrategyPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
