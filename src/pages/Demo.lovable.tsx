import { useState } from 'react';
import StrategyGenerator from '../components/StrategyGenerator';

const DemoPage = () => {
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

  const handleStrategyComplete = (data: any) => {
    console.log('Strategy generated:', data);
    setGeneratedStrategy(data);
  };

  return (
    <div className="theme-strategy min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-glow-cyan mb-4"></div>
            Strategy Generator + Copilot Demo
          </div>
          <p className="text-xl text-gray-400">
            Generate strategies with AI-powered suggestions
          </p>
        </div>

        <div className="mb-8 glass-section p-4">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4"></div>🧪 Try these examples:</div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div className="space-y-2">
              <h3 className="text-white font-medium"></div>Breakout Strategy:</div>
              <p className="text-sm">Type "breakout" to see momentum strategy with volume suggestions</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium"></div>RSI Strategy:</div>
              <p className="text-sm">Type "RSI divergence" for oscillator-based strategy</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium"></div>EMA Strategy:</div>
              <p className="text-sm">Type anything else for moving average pullback strategy</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium"></div>Risk Warnings:</div>
              <p className="text-sm">Add "news" or "volatile" to see risk warnings</p>
            </div>
          </div>
        </div>

        <Strategygenerator /></Strategygenerator>

        {generatedStrategy && (
          <div className="mt-12 glass-section p-6 animate-in fade-in slide-up">
            <h3 className="text-xl font-semibold text-white mb-4"></div></div>📊 Generated Strategy Summary</div>
            <div className="space-y-2 text-gray-300">
              <p><strong>Title:</strong> {generatedStrategy.title}</div>
              <p><strong>Rules:</strong> {generatedStrategy.rules.length}</p>
              <p><strong>Checklist Items:</strong> {generatedStrategy.checklist.length}</p>
              {generatedStrategy.warning && (
                <p className="text-yellow-400"><strong>Warning:</strong> Yes</p>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              The Strategy Copilot above provides AI-powered suggestions to improve your strategy!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
