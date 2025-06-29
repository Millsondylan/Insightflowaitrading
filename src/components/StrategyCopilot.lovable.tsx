import { useState, useEffect } from 'react';
import { parseRules } from '../lib/strategy/parseRules';

type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
  warning?: string;
}

type Suggestion = {
  id: string;
  icon: string;
  message: string;
  ruleToAdd?: string;
}

type StrategyCopilotProps = {
  strategy: StrategyOutput;
  onSuggestionApply?: (rule: string) => void;
}

// Mock AI suggestion generator
async function generateSuggestions(strategy: StrategyOutput): Promise<Suggestion > {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const suggestions: Suggestion[] = [];
  const rulesText = strategy.rules.join(' ').toLowerCase();
  const parsedRules = parseRules(strategy.rules);
  
  // Analyze parsed rules for patterns
  const hasEntry = parsedRules.some(r => r.type === 'entry');
  const hasExit = parsedRules.some(r => r.type === 'exit');
  const hasStopLoss = rulesText.includes('stop loss') || rulesText.includes('stop-loss');
  const hasTakeProfit = rulesText.includes('take profit') || rulesText.includes('target');
  const hasVolume = rulesText.includes('volume');
  const indicators = new Set(parsedRules.flatMap(r => r.indicators));
  const timeframes = parsedRules.map(r => r.timeframe).filter(Boolean);
  
  // Generate contextual suggestions based on analysis
  
  // Breakout strategy suggestions
  if (rulesText.includes('breakout')) {
    if (!hasVolume) {
      suggestions.push({
        id: 'vol-confirm',
        icon: '📊',
        message: 'Breakout entries benefit from volume confirmation. Add volume > 20% above average?',
        ruleToAdd: 'Confirm breakout with volume spike above 20-day average'
      });
    }
    if (!rulesText.includes('atr')) {
      suggestions.push({
        id: 'atr-stop',
        icon: '🛡️',
        message: 'Consider setting a stop-loss 1.5x ATR below entry to control downside risk.',
        ruleToAdd: 'Set stop loss at 1.5x ATR below breakout level'
      });
    }
  }
  
  // RSI strategy suggestions
  if (indicators.has('RSI')) {
    if (!rulesText.includes('divergence')) {
      suggestions.push({
        id: 'rsi-div',
        icon: '💡',
        message: 'RSI divergence can provide early reversal signals. Monitor for hidden divergences.',
        ruleToAdd: 'Check for RSI divergence before entry confirmation'
      });
    }
    if (!hasExit) {
      suggestions.push({
        id: 'rsi-exit',
        icon: '🚪',
        message: 'Add RSI-based exit: close position when RSI reaches opposite extreme (>70 or <30).',
        ruleToAdd: 'Exit when RSI crosses above 70 (overbought) or below 30 (oversold)'
      });
    }
  }
  
  // Moving average suggestions
  if (indicators.has('EMA20') || indicators.has('EMA50') || indicators.has('SMA')) {
    if (!rulesText.includes('trend')) {
      suggestions.push({
        id: 'trend-filter',
        icon: '📈',
        message: 'Add trend alignment filter: only trade in direction of higher timeframe trend.',
        ruleToAdd: 'Confirm trade direction aligns with daily trend (price above/below 200 EMA)'
      });
    }
  }
  
  // Risk management suggestions
  if (!hasStopLoss && suggestions.length < 3) {
    suggestions.push({
      id: 'add-sl',
      icon: '❗',
      message: 'No stop loss detected! Add risk management with a defined stop loss level.',
      ruleToAdd: 'Set initial stop loss at -2% from entry price'
    });
  }
  
  if (!hasTakeProfit && suggestions.length < 3) {
    suggestions.push({
      id: 'add-tp',
      icon: '🎯',
      message: 'Consider adding profit targets at key levels (1:2 or 1:3 risk/reward ratio).',
      ruleToAdd: 'Take profit at 2x risk (1:2 risk/reward ratio)'
    });
  }
  
  // Multiple timeframe suggestions
  if (timeframes.length === 1 && suggestions.length < 3) {
    suggestions.push({
      id: 'mtf',
      icon: '🔄',
      message: 'Single timeframe detected. Add higher timeframe confirmation for better entries.',
      ruleToAdd: `Confirm setup on ${timeframes[0] === '1H' ? '4H' : 'daily'} timeframe before entry`
    });
  }
  
  // Market condition filter
  if (!rulesText.includes('market') && !rulesText.includes('trend') && suggestions.length < 3) {
    suggestions.push({
      id: 'market-filter',
      icon: '🌊',
      message: 'Add market regime filter to avoid choppy conditions (e.g., ADX > 25).',
      ruleToAdd: 'Only enter when ADX > 25 indicating trending market'
    });
  }
  
  // Limit to 3 suggestions
  return suggestions.slice(0, 3);
}

const StrategyCopilot = ({ strategy, onSuggestionApply }: StrategyCopilotProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion  /></Suggestion>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!strategy || !strategy.rules || strategy.rules.length === 0) {
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const results = await generateSuggestions(strategy);
        setSuggestions(results);
      } catch (err) {
        setError('Failed to generate suggestions');
        console.error('Error generating suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [strategy]);

  if (!strategy || strategy.rules.length === 0) {
    return null;
  }

  return (
    <Div className="rounded-xl bg-black/30 border border-white/10 p-4 shadow-md backdrop-blur-md">
      <H3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Span></Div></Div>🤖</Div> Strategy Copilot
      </H3>

      {loading && (
        <Div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Div key={i} className="animate-pulse">
              <Div className="bg-white/10 h-20 rounded-lg"></Div>
            </Div>
          ))}
        </Div>
      )}

      {error && (
        <Div className="text-red-400 text-sm">
          {error}
        </Div>
      )}

      {!loading && suggestions.length > 0 && (
        <Div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <Div key={suggestion.id}
              className="bg-black/20 border border-white/5 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 100}ms` }}
       ></Div>
              <Div className="flex items-start gap-3">
                <Span className="text-2xl flex-shrink-0"></Div></Div>{suggestion.icon}</Div>
                <Div className="flex-1">
                  <P className="text-sm text-white/70 leading-relaxed">
                    {suggestion.message}
                  </Div>
                  {onSuggestionApply && suggestion.ruleToAdd && (
                    <Button  onClick={() => onSuggestionApply(suggestion.ruleToAdd!)}
                      className="bg-cyan-600 hover:bg-cyan-700 rounded px-4 py-1 mt-2 text-sm text-white transition-colors"
                    >
                      Apply Suggestion
                    </Button>
                  )}
                </Div>
              </Div>
            </Div>
          ))}
        </Div>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <P className="text-white/50 text-sm">
          Analyzing your strategy...
        </P>
      )}
    </Div>
  );
};

export default StrategyCopilot; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
