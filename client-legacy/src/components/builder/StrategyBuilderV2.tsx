
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
};

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

const validateStrategy = (strategy: StrategyOutput): string | null => {
  if (strategy.rules.length === 0 || strategy.rules[0].includes('not recognized')) {
    return 'Could not determine a clear entry rule. Please describe your entry condition.';
  }
  if (strategy.checklist.length === 0) {
    return 'Warning: No pre-trade checklist was generated. Consider adding confirmation steps.';
  }
  return null;
};

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
    <div className="theme-builder p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">AI Strategy Builder V2</h1>
        <p className="text-white/70 mt-2">Describe your trading strategy in plain English.</p>
      </div>

      <div className="space-y-4">
        <Textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A simple RSI strategy that buys on oversold signals and sells on overbought signals. Also look for a breakout with volume confirmation.'"
          className="bg-white/5 p-4 rounded-lg text-white/80 w-full min-h-[120px]"
        />
        <Button 
          onClick={handleSubmit}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Generate Strategy
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700 text-red-300">
          <p className="font-bold">Validation Error</p>
          <p>{error}</p>
        </div>
      )}

      {strategy && (
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{strategy.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Trading Rules</h3>
              <ul className="space-y-1">
                {strategy.rules.map((rule, index) => (
                  <li key={index} className="text-white/80">
                    • {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Pre-Trade Checklist</h3>
              <ul className="space-y-1">
                {strategy.checklist.map((item, index) => (
                  <li key={index} className="text-white/80">
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrategyBuilderV2;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
