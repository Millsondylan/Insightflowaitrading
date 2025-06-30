import { OHLCV } from './sampleData';
import { SMA, RSI } from 'technicalindicators';

type ConditionFunction = (candle: OHLCV, index: number, candles: OHLCV[]) => boolean;

// --- Helper Functions for Indicators ---
const calculateSMA = (period: number, candles: OHLCV[]) => {
  const prices = candles.map(c => c.close);
  return SMA.calculate({ period, values: prices });
};

const calculateRSI = (period: number, candles: OHLCV[]) => {
  const prices = candles.map(c => c.close);
  return RSI.calculate({ period, values: prices });
};

// --- Rule Parsing Logic ---
const ruleRegistry: { [key: string]: (params: number[]) => ConditionFunction } = {
  'close > sma': (params) => {
    const period = params[0];
    const smaValues = calculateSMA(period, candles);
    return (candle, index, candles) => {
      if (index < period) return false;
      return candle.close > smaValues[index - period];
    };
  },
  'close < sma': (params) => {
    const period = params[0];
    const smaValues = calculateSMA(period, candles);
    return (candle, index, candles) => {
      if (index < period) return false;
      return candle.close < smaValues[index - period];
    };
  },
  'rsi >': (params) => {
    const [rsiPeriod, value] = params;
    const rsiValues = calculateRSI(rsiPeriod, candles);
    return (candle, index, candles) => {
      if (index < rsiPeriod) return false;
      return rsiValues[index - rsiPeriod] > value;
    };
  },
  'rsi <': (params) => {
    const [rsiPeriod, value] = params;
    const rsiValues = calculateRSI(rsiPeriod, candles);
    return (candle, index, candles) => {
      if (index < rsiPeriod) return false;
      return rsiValues[index - rsiPeriod] < value;
    };
  },
};

// Global cache for candles to avoid recalculating indicators repeatedly
let candles: OHLCV[] = [];

/**
 * Parses a string of rules into a single executable function.
 * @param rules - A string containing one or more rules, separated by newlines.
 * @param allCandles - The full dataset of candles.
 * @returns A function that returns true if all conditions are met.
 */
export const parseRules = (rules: string, allCandles: OHLCV[]): ConditionFunction => {
  candles = allCandles; // Cache the candles
  const parsedConditions: ConditionFunction[] = [];

  const lines = rules.split('\n').filter(line => line.trim() !== '');

  for (const line of lines) {
    const parts = line.toLowerCase().match(/([a-z\s<>]+)\(?(\d+(?:,\s*\d+)*)\)?/);
    if (!parts) continue;
    
    const ruleKey = parts[1].trim();
    const params = parts[2] ? parts[2].split(',').map(p => parseFloat(p.trim())) : [];
    
    if (ruleRegistry[ruleKey]) {
      parsedConditions.push(ruleRegistry[ruleKey](params));
    }
  }

  if (parsedConditions.length === 0) {
    return () => false; // No valid rules found
  }

  // Return a function that checks if all parsed conditions are true
  return (candle, index, candles) => {
    return parsedConditions.every(condition => condition(candle, index, candles));
  };
}; 