import { useState } from 'react';
import StrategyGenerator from '../components/StrategyGenerator';

const DemoPage = () => {
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

  const handleStrategyComplete = (data: any) => {
    console.log('Strategy generated:', data);
    setGeneratedStrategy(data);
  };

  return (
    <Div className="theme-strategy min-h-screen px-6 py-20">
      <Div className="max-w-4xl mx-auto">
        <Div className="text-center mb-12">
          <H1 className="text-4xl md:text-6xl font-bold text-glow-cyan mb-4"></Div>
            Strategy Generator + Copilot Demo
          </Div>
          <P className="text-xl text-gray-400">
            Generate strategies with AI-powered suggestions
          </P>
        </Div>

        <Div className="mb-8 glass-section p-4">
          <H2 className="text-2xl font-semibold text-cyan-300 mb-4"></Div>🧪 Try these examples:</Div>
          <Div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <Div className="space-y-2">
              <H3 className="text-white font-medium"></Div>Breakout Strategy:</Div>
              <P className="text-sm">Type "breakout" to see momentum strategy with volume suggestions</P>
            </Div>
            <Div className="space-y-2">
              <H3 className="text-white font-medium"></Div>RSI Strategy:</Div>
              <P className="text-sm">Type "RSI divergence" for oscillator-based strategy</P>
            </Div>
            <Div className="space-y-2">
              <H3 className="text-white font-medium"></Div>EMA Strategy:</Div>
              <P className="text-sm">Type anything else for moving average pullback strategy</P>
            </Div>
            <Div className="space-y-2">
              <H3 className="text-white font-medium"></Div>Risk Warnings:</Div>
              <P className="text-sm">Add "news" or "volatile" to see risk warnings</P>
            </Div>
          </Div>
        </Div>

        <Strategygenerator  /></Strategygenerator>

        {generatedStrategy && (
          <Div className="mt-12 glass-section p-6 animate-in fade-in slide-up">
            <H3 className="text-xl font-semibold text-white mb-4"></Div>📊 Generated Strategy Summary</Div>
            <Div className="space-y-2 text-gray-300">
              <P><strong>Title:</strong> {generatedStrategy.title}</Div>
              <P><strong>Rules:</strong> {generatedStrategy.rules.length}</P>
              <P><strong>Checklist Items:</strong> {generatedStrategy.checklist.length}</P>
              {generatedStrategy.warning && (
                <P className="text-yellow-400"><strong>Warning:</strong> Yes</P>
              )}
            </Div>
            <Div className="mt-4 text-sm text-gray-400">
              The Strategy Copilot above provides AI-powered suggestions to improve your strategy!
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
};

export default DemoPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
