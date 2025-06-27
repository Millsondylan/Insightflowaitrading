import { useState } from 'react';
import BacktestForm, { BacktestFormState } from '@/components/core/BacktestForm';
import BacktestResultDisplay from '@/components/core/BacktestResult';
import { getSampleData } from '@/lib/backtest/sampleData';
import { parseRules } from '@/lib/backtest/parseRules';
import { runBacktest, BacktestResult } from '@/lib/backtest/runBacktest';
import { motion } from 'framer-motion';
import '@/styles/backtest.css';

const BacktestPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BacktestFormState | null>(null);
  const [candles, setCandles] = useState<any[]>([]);

  const handleBacktestRun = (data: BacktestFormState) => {
    setIsLoading(true);
    setBacktestResult(null);
    setError(null);
    setFormData(data);

    // Use a timeout to allow the UI to update to the loading state
    setTimeout(() => {
      try {
        const candleData = getSampleData(data.ticker, data.timeframe);
        setCandles(candleData);
        
        if (candleData.length === 0) {
          throw new Error('No candle data available for the selected ticker/timeframe.');
        }

        const entryFn = parseRules(data.entryLogic, candleData);
        const exitFn = parseRules(data.exitLogic, candleData);

        const result = runBacktest({
          candles: candleData,
          entryFn,
          exitFn,
        });
        
        setBacktestResult(result);
        
        // Scroll to result
        setTimeout(() => {
          document.getElementById('backtest-result')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred during backtest.');
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-glow-cyan">Backtest Engine</h1>
        <p className="text-gray-400">
          Simulate your trading strategies against historical data.
        </p>
      </motion.div>

      <BacktestForm onSubmit={handleBacktestRun} isLoading={isLoading} />
      
      {error && (
        <div className="mt-8 p-4 text-center bg-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {backtestResult && !isLoading && formData && (
        <div id="backtest-result">
          <BacktestResultDisplay 
            result={backtestResult} 
            candles={candles}
            ticker={formData.ticker}
            timeframe={formData.timeframe}
          />
        </div>
      )}
    </div>
  );
};

export default BacktestPage; 