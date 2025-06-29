import { useState } from 'react';
import StrategyGenerator from '../components/StrategyGenerator';

const DemoPage = () => {
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

  const handleStrategyComplete = (data: any) => {
    console.log('Strategy generated:', data);
    setGeneratedStrategy(data);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <div >
          <h1 style={{ fontWeight: "700", marginBottom: "16px" }}>
            Strategy Generator + Copilot Demo
          </h1>
          <p style={{ color: "#9CA3AF" }}>
            Generate strategies with AI-powered suggestions
          </p>
        </div>

        <div style={{ marginBottom: "32px", padding: "16px" }}>
          <h2 style={{ marginBottom: "16px" }}>🧪 Try these examples:</h2>
          <div >
            <div >
              <h3 style={{ color: "white" }}>Breakout Strategy:</h3>
              <p >Type "breakout" to see momentum strategy with volume suggestions</p>
            </div>
            <div >
              <h3 style={{ color: "white" }}>RSI Strategy:</h3>
              <p >Type "RSI divergence" for oscillator-based strategy</p>
            </div>
            <div >
              <h3 style={{ color: "white" }}>EMA Strategy:</h3>
              <p >Type anything else for moving average pullback strategy</p>
            </div>
            <div >
              <h3 style={{ color: "white" }}>Risk Warnings:</h3>
              <p >Add "news" or "volatile" to see risk warnings</p>
            </div>
          </div>
        </div>

        <StrategyGenerator onComplete={handleStrategyComplete} />

        {generatedStrategy && (
          <div style={{ padding: "24px" }}>
            <h3 style={{ color: "white", marginBottom: "16px" }}>📊 Generated Strategy Summary</h3>
            <div >
              <p><strong>Title:</strong> {generatedStrategy.title}</p>
              <p><strong>Rules:</strong> {generatedStrategy.rules.length}</p>
              <p><strong>Checklist Items:</strong> {generatedStrategy.checklist.length}</p>
              {generatedStrategy.warning && (
                <p ><strong>Warning:</strong> Yes</p>
              )}
            </div>
            <div style={{ color: "#9CA3AF" }}>
              The Strategy Copilot above provides AI-powered suggestions to improve your strategy!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;
