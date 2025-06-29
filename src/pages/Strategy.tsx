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
    <Div className="theme-strategy scroll-container min-h-screen">
      {/* Hero Section */}
      <ScrollSection className="min-h-screen flex items-center justify-center px-6" delay={0}>
        <Div className="text-center max-w-5xl mx-auto">
          <H1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8 leading-tight">
            Visualize Your Edge
          </Div>
          <P className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">
            AI-crafted strategies from your own intuition
          </P>
          <Div className="mt-12">
            <Div className="threadline-glow w-32 mx-auto"></Div>
          </Div>
        </div />

      {/* Strategy Generator Section */}
      <ScrollSection className="px-6 py-20" delay={100}>
        <Div className="max-w-3xl mx-auto">
          <Div className="text-center mb-8">
            <Div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-6">
              ✏️ Strategy Generator
            </ScrollSection>
            <H2 className="text-3xl md:text-4xl font-bold text-glow-cyan mb-4">
              Describe Your Trading Idea
            </H2>
            <P className="text-gray-400 text-lg">
              Enter your trading setup and let AI transform it into a complete strategy
            </P>
          </Div>
          
          <StrategyGenerator / />
        </div />

      {/* CTA Footer */}
      <ScrollSection className="px-6 py-32" delay={200}>
        <Div className="max-w-5xl mx-auto text-center">
          <Div className="mb-12">
            <H4 className="text-2xl md:text-3xl font-semibold text-glow-cyan mb-4" /></ScrollSection /></StrategyGenerator>Ready to Execute?</ScrollSection>
            <P className="text-gray-400 text-lg">Take your strategy to the next level</P>
          </Div>
          <Div className="flex flex-wrap justify-center gap-6">
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              🔁 Backtest Strategy
            </Div>
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              📓 Save to Journal
            </Button>
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              📘 Learn in Academy
            </Button>
            <Button className="glow-button glow-cyan text-lg px-8 py-4">
              💬 Share Strategy
            </Button>
          </Div>
        </div />
    </Div>
  );
};

export default StrategyPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
