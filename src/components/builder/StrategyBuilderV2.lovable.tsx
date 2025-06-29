import React, { useState } from 'react';

// Define the structure for the parsed strategy output
type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
};

// --- Mock Functions (to be replaced with actual logic) ---

// Mock function to parse a natural language prompt into a strategy object
const parseStrategyPrompt = (prompt: string): StrategyOutput => {
  const lowerPrompt = prompt.toLowerCase();
  const rules = [];
  const checklist = [];

  if (lowerPrompt.includes('breakout')) {
    rules.push('Enter on breakout above previous high.');
    checklist.push('Confirm breakout on high volume.');
  }
  if (lowerPrompt.includes('rsi') && lowerPrompt.includes('oversold')) {
    rules.push('Buy when RSI is below 30 (Oversold).');
  }
  if (lowerPrompt.includes('rsi') && lowerPrompt.includes('overbought')) {
    rules.push('Sell when RSI is above 70 (Overbought).');
  }
  if (lowerPrompt.includes('moving average cross')) {
    rules.push('Enter when fast MA crosses above slow MA.');
    checklist.push('Verify trend direction on a higher timeframe.');
  }
  if (rules.length === 0) {
    rules.push('Entry condition not recognized. Please be more specific.');
  }

  return {
    title: 'AI-Generated Strategy',
    rules,
    checklist,
  };
};

// Mock function to validate the parsed strategy
const validateStrategy = (strategy: StrategyOutput): string | null => {
  if (strategy.rules.length === 0 || strategy.rules[0].includes('not recognized')) {
    return 'Could not determine a clear entry rule. Please describe your entry condition.';
  }
  if (strategy.checklist.length === 0) {
    return 'Warning: No pre-trade checklist was generated. Consider adding confirmation steps.';
  }
  return null;
};

// --- Main Component ---

const StrategyBuilderV2 = () => {
  const [prompt, setPrompt] = useState('');
  const [strategy, setStrategy] = useState<StrategyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    setStrategy(null);

    const parsed = parseStrategyPrompt(prompt);
    const validationError = validateStrategy(parsed);

    if (validationError) {
      setError(validationError);
    } else {
      setStrategy(parsed);
    }
  };

  return (
    <div style={{ padding: "16px", marginTop: "32px" }}>
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>AI Strategy Builder V2</h1>
        <p >Describe your trading strategy in plain English.</p>
      </div>

      <div >
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A simple RSI strategy that buys on oversold signals and sells on overbought signals. Also look for a breakout with volume confirmation.'"
          style={{ padding: "16px", width: "100%" }}
        />
        <Button onClick={handleSubmit} style={{ color: "white" }}>
          Generate Strategy
        </Button>
      </div>

      {error && (
        <div style={{ padding: "16px", border: "1px solid #374151" }}>
          <p style={{ fontWeight: "700" }}>Validation Error</p>
          <p>{error}</p>
        </div>
      )}

      {strategy && (
        <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151" }}>
          <div>
            <h2 style={{ fontWeight: "700", color: "white" }}>{strategy.title}</h2>
          </div>

          <div>
            <h3 >Parsed Rules</h3>
            <ul >
              {strategy.rules.map((rule, i) => <li key={i}>{rule}</li>)}
            </ul>
          </div>

          <div>
            <h3 >Pre-Trade Checklist</h3>
            <ul >
              {strategy.checklist.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          
          <div >
            <h3 >Mock Backtest Preview</h3>
            <div style={{ display: "flex" }}>
                <div >
                    <p >Est. Win Rate</p>
                    <p style={{ fontWeight: "700" }}>62%</p>
                </div>
                <div >
                    <p >Est. PnL</p>
                    <p style={{ fontWeight: "700" }}>$12,450</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyBuilderV2; 