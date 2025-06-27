import { useState } from 'react';
import StrategyForm from '../components/core/StrategyForm';
import StrategyResult from '../components/core/StrategyResult';
import { motion } from 'framer-motion';
import { StrategyFormData, buildStrategyPrompt } from '../lib/strategy/promptBuilder';

export interface StrategyResponse {
  strategyName: string;
  description: string;
  rules: string[];
  entryChecklist: string[];
  warnings: string[];
  backtestTips: string[];
}

const StrategyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [strategyResult, setStrategyResult] = useState<StrategyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStrategyGeneration = async (formData: StrategyFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build the prompt (in a real app, this would be sent to an API)
      const prompt = buildStrategyPrompt(formData);
      console.log('Generated prompt:', prompt);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const result = getMockStrategyResponse(formData);
      setStrategyResult(result);
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById('strategy-result')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock response generator for development
  function getMockStrategyResponse(formData: StrategyFormData): StrategyResponse {
    const strategyName = formData.strategyName || `${formData.tradeStyle} ${formData.instruments} Strategy`;
    
    return {
      strategyName: strategyName,
      description: `A ${formData.tradeStyle} strategy for ${formData.instruments} on the ${formData.timeframe} timeframe. This approach combines technical analysis with risk management to identify optimal entry and exit points.`,
      rules: [
        "Rule 1: Only enter trades in the direction of the overall trend as determined by the higher timeframe.",
        "Rule 2: Wait for price to reach key support/resistance levels before considering entry.",
        "Rule 3: Confirm entry signals with volume analysis and indicator confluence.",
        "Rule 4: Maintain a risk-to-reward ratio of at least 1:2 for all trades.",
        "Rule 5: Avoid trading during major news events or periods of low liquidity."
      ],
      entryChecklist: [
        `Entry signal confirmed on ${formData.timeframe} chart: ${formData.entryConditions}`,
        "Price action shows rejection at support/resistance level",
        "Volume confirms the potential move",
        "No immediate news events that could impact price",
        "Position size calculated according to risk management rules"
      ],
      warnings: [
        "Warning: This strategy may underperform in ranging or choppy market conditions.",
        "Warning: Extended periods of low volatility may reduce the frequency of valid signals.",
        "Warning: Always verify signals across multiple indicators to reduce false positives.",
        "Warning: Backtest thoroughly before trading with real capital."
      ],
      backtestTips: [
        "Test across different market conditions (trending, ranging, volatile).",
        "Include transaction costs and slippage in your backtest calculations.",
        "Compare performance against a simple buy-and-hold strategy as baseline.",
        "Test various stop-loss and take-profit levels to optimize performance.",
        "Document all results systematically for future reference and strategy refinement."
      ]
    };
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-glow-cyan">Strategy Builder</h1>
        <p className="text-gray-400">
          Design your trading strategy with AI-powered insights. Fill in the form below to generate a comprehensive strategy.
        </p>
      </motion.div>

      <StrategyForm onSubmit={handleStrategyGeneration} isLoading={isLoading} />
      
      {error && (
        <div className="mt-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-white">
          {error}
        </div>
      )}
      
      {(strategyResult || isLoading) && (
        <div id="strategy-result" className="mt-16">
          <StrategyResult result={strategyResult} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default StrategyPage; 