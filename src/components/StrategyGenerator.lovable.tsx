import { useState } from 'react';
import { parseRules, ParsedRule } from '../lib/strategy/parseRules';
import StrategyCopilot from './StrategyCopilot';
import StrategyExport from './StrategyExport';

type StrategyOutput = {
  title: string;
  rules: string[];
  checklist: string[];
  warning?: string;
};

async function generateMockStrategy(input: string): Promise<StrategyOutput> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (input.toLowerCase().includes("breakout")) {
    return {
      title: "Momentum Breakout Edge",
      rules: [
        "Enter on 1H candle close above breakout with volume spike",
        "Confirm breakout with RSI > 60 and rising momentum",
        "Set stop-loss below consolidation low"
      ],
      checklist: [
        "Resistance level marked",
        "Volume validated",
        "News event cleared"
      ],
      warning: input.toLowerCase().includes("news") ? "⚠️ Risky near macro event—backtest cautiously." : undefined
    };
  }
  
  if (input.toLowerCase().includes("rsi")) {
    return {
      title: "RSI Divergence Hunter",
      rules: [
        "Monitor 4H RSI for divergence from price action",
        "Enter when daily RSI < 30 and bullish divergence confirmed",
        "Exit position if RSI > 70 or momentum drops below zero"
      ],
      checklist: [
        "RSI divergence confirmed",
        "Price at key level",
        "Trend alignment checked"
      ],
      warning: input.toLowerCase().includes("volatile") ? "⚠️ High volatility detected—reduce position size." : undefined
    };
  }
  
  // Default strategy
  return {
    title: "EMA Pullback Entry",
    rules: [
      "Enter when price touches rising EMA20 on 1H timeframe",
      "Confirm with bullish engulfing candle and MACD positive",
      "Place stop loss below recent swing low"
    ],
    checklist: [
      "EMA angle verified",
      "Engulfing candle formed",
      "Volatility normalized"
    ]
  };
}

interface StrategyGeneratorProps {
  onComplete?: (data: StrategyOutput) => void;
}

const StrategyGenerator = ({ onComplete }: StrategyGeneratorProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyOutput | null>(null);
  const [parsedRules, setParsedRules] = useState<ParsedRule[]>([]);
  const [showParsed, setShowParsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    setShowParsed(false);
    try {
      const strategy = await generateMockStrategy(input);
      setResult(strategy);
      
      // Parse the generated rules
      const parsed = parseRules(strategy.rules);
      setParsedRules(parsed);
      
      if (onComplete) {
        onComplete(strategy);
      }
    } catch (error) {
      console.error("Error generating strategy:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionApply = (newRule: string) => {
    if (result) {
      const updatedStrategy = {
        ...result,
        rules: [...result.rules, newRule]
      };
      setResult(updatedStrategy);
      
      // Re-parse rules with the new addition
      const parsed = parseRules(updatedStrategy.rules);
      setParsedRules(parsed);
      
      // Notify parent if needed
      if (onComplete) {
        onComplete(updatedStrategy);
      }
    }
  };

  const getRuleTypeColor = (type: ParsedRule['type']) => {
    switch (type) {
      case 'entry': return 'text-green-400';
      case 'exit': return 'text-red-400';
      case 'filter': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getRuleTypeIcon = (type: ParsedRule['type']) => {
    switch (type) {
      case 'entry': return '🟢';
      case 'exit': return '🔴';
      case 'filter': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div >
      <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
        {/* Input Section */}
        <form onSubmit={handleSubmit} >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your setup idea (e.g. breakout with EMA cross)"
            style={{ color: "white", width: "100%" }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{ paddingLeft: "16px", paddingRight: "16px", color: "white", display: "flex", alignItems: "center" }}
          >
            <span>🧠</span>
            <span>{loading ? "Generating..." : "Generate Strategy"}</span>
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div >
            <div  />
            <div >
              <div  />
              <div  />
              <div  />
            </div>
            <div >
              <div  />
              <div  />
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && !loading && (
          <div >
            {/* Title */}
            <h2 style={{ fontWeight: "700" }}>
              {result.title}
            </h2>

            {/* Toggle Parsed View */}
            {parsedRules.length > 0 && (
              <button
                onClick={() => setShowParsed(!showParsed)}
                
              >
                {showParsed ? '📝 Show Original' : '🔍 Show Parsed Analysis'}
              </button>
            )}

            {/* Rules Display */}
            <div >
              <h3 style={{ display: "flex", alignItems: "center" }}>
                <span>📌</span> Strategy Rules
              </h3>
              
              {showParsed ? (
                // Parsed Rules View
                <div >
                  {parsedRules.map((rule, index) => (
                    <div key={index} >
                      <div style={{ display: "flex" }}>
                        <span>{getRuleTypeIcon(rule.type)}</span>
                        <div >
                          <p >{rule.raw}</p>
                          <div style={{ display: "flex" }}>
                            <span className={`${getRuleTypeColor(rule.type)} font-semibold`}>
                              {rule.type.toUpperCase()}
                            </span>
                            {rule.timeframe && (
                              <span >
                                ⏱ {rule.timeframe}
                              </span>
                            )}
                            {rule.indicators.length > 0 && (
                              <span >
                                📊 {rule.indicators.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Original Rules View
                <ol >
                  {result.rules.map((rule, index) => (
                    <li key={index} >
                      {rule}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Checklist */}
            <div >
              <h3 style={{ display: "flex", alignItems: "center" }}>
                <span>✅</span> Entry Checklist
              </h3>
              <ul >
                {result.checklist.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning */}
            {result.warning && (
              <div style={{ border: "1px solid #374151", padding: "16px" }}>
                {result.warning}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Strategy Copilot - Shows after strategy is generated */}
      {result && !loading && (
        <div >
          <StrategyCopilot 
            strategy={result} 
            onSuggestionApply={handleSuggestionApply}
          />
        </div>
      )}

      {/* Strategy Export - Shows after strategy is generated */}
      {result && !loading && (
        <div  style={{ animationDelay: '200ms' }}>
          <StrategyExport strategy={result} />
        </div>
      )}
    </div>
  );
};

export default StrategyGenerator; 