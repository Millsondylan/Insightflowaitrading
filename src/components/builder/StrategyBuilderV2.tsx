import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProfilePersonalization } from '@/hooks/use-profile-personalization';

// Define the structure for the parsed strategy output
type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
  name?: string;
  description?: string;
  timeframe?: string;
  indicators?: string[];
  riskPerTrade?: number;
  stopLossPercent?: number;
  takeProfitRatio?: number;
};

interface StrategyBuilderProps {
  initialData?: StrategyOutput;
  onSave?: (strategy: StrategyOutput) => void;
}

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

const StrategyBuilderV2 = ({ initialData, onSave }: StrategyBuilderProps) => {
  const [prompt, setPrompt] = useState('');
  const [strategy, setStrategy] = useState<StrategyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [symbols, setSymbols] = useState<string[]>([]);
  const isInitialized = React.useRef(false);

  // Get personalized settings from user profile
  const { 
    profile, 
    defaultChartSettings, 
    strategyTemplate, 
    riskParameters 
  } = useProfilePersonalization() || {};
  
  // Initialize with personalized defaults if no initial data
  useEffect(() => {
    if (!initialData && strategyTemplate && !isInitialized.current) {
      // Apply personalized defaults if no initial data was provided
      setStrategy(prev => ({
        ...prev || { title: '', rules: [], checklist: [] },
        name: strategyTemplate?.name,
        description: strategyTemplate?.description,
        timeframe: defaultChartSettings?.timeframe,
        indicators: strategyTemplate?.indicators,
        riskPerTrade: riskParameters?.riskPerTrade,
        stopLossPercent: riskParameters?.stopLossPercent,
        takeProfitRatio: riskParameters?.takeProfitRatio
      }));
      
      // Set favorite symbols if available
      if (defaultChartSettings?.symbols?.length) {
        setSymbols(defaultChartSettings.symbols);
      }
      
      isInitialized.current = true;
    }
  }, [initialData, strategyTemplate, defaultChartSettings, riskParameters]);

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

  // Update AI prompt to include user profile context
  const generateAIPrompt = useCallback(() => {
    if (!strategy) return '';
    
    const { aiPromptContext } = useProfilePersonalization() || {};
    
    return `
      ${aiPromptContext || ''}
      
      Based on the user's profile and preferences, generate a trading strategy with the following details:
      
      Strategy Name: ${strategy.name || ''}
      Description: ${strategy.description || ''}
      Timeframe: ${strategy.timeframe || ''}
      Symbols: ${symbols.join(', ')}
      Indicators: ${strategy.indicators?.join(', ') || ''}
      Risk per trade: ${strategy.riskPerTrade || 0}%
      
      Please provide entry rules, exit rules, and risk management guidelines tailored to this user's experience level and risk profile.
    `;
  }, [strategy, symbols]);

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
        <Button onClick={handleSubmit} className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-full text-white font-semibold">
          Generate Strategy
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700 text-red-300">
          <p className="font-bold">Validation Error</p>
          <p>{error}</p>
        </div>
      )}

      {strategy && (
        <div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{strategy.title}</h2>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-2">Parsed Rules</h3>
            <ul className="list-disc pl-6 space-y-1 text-white/80">
              {strategy.rules.map((rule, i) => <li key={i}>{rule}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-2">Pre-Trade Checklist</h3>
            <ul className="list-disc pl-6 space-y-1 text-white/80">
              {strategy.checklist.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <h3 className="text-lg font-semibold text-white/90 mb-2">Mock Backtest Preview</h3>
            <div className="flex gap-4 text-center">
                <div className="bg-white/10 p-3 rounded-lg flex-1">
                    <p className="text-sm text-white/60">Est. Win Rate</p>
                    <p className="text-xl font-bold text-green-400">62%</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg flex-1">
                    <p className="text-sm text-white/60">Est. PnL</p>
                    <p className="text-xl font-bold text-green-400">$12,450</p>
                </div>
            </div>
          </div>
        </div>
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