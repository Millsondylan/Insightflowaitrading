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

async function generateMockStrategy(input: string): Promise<Strategyoutput > {
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
  const [result, setResult] = useState<Strategyoutput  />(null);
  const [parsedRules, setParsedRules] = useState<Parsedrule >([]);
  const [showParsed, setShowParsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement >) => {
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
    <Div className="space-y-6">
      <Div className="rounded-xl p-6 border border-white/10 backdrop-blur-md bg-black/30 space-y-6 shadow-md">
        {/* Input Section */}
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your setup idea (e.g. breakout with EMA cross)"
            className="bg-black/20 text-white w-full p-3 rounded-md outline-none resize-none h-32 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            disabled={loading}
          />
          <Button type="submit"
            disabled={!input.trim() || loading}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 px-4 py-2 rounded-full text-white transition-all duration-200 flex items-center gap-2"
          />
            <Span>🧠</Strategyoutput>
            <Span>{loading ? "Generating..." : "Generate Strategy"}</Span>
          </Button>
        </Form>

        {/* Loading State */}
        {loading && (
          <Div className="space-y-4">
            <Div className="bg-white/10 h-8 rounded animate-pulse" />
            <Div className="space-y-2">
              <Div className="bg-white/10 h-4 rounded animate-pulse" />
              <Div className="bg-white/10 h-4 rounded animate-pulse w-5/6" />
              <Div className="bg-white/10 h-4 rounded animate-pulse w-4/6" />
            </Div>
            <Div className="space-y-2">
              <Div className="bg-white/10 h-4 rounded animate-pulse w-4/6" />
              <Div className="bg-white/10 h-4 rounded animate-pulse w-3/6" />
            </Div>
          </Div>
        )}

        {/* Result Display */}
        {result && !loading && (
          <Div className="space-y-6 animate-in fade-in duration-500">
            {/* Title */}
            <H2 className="text-cyan-300 text-xl font-bold"></Div>
              {result.title}
            </Div>

            {/* Toggle Parsed View */}
            {parsedRules.length > 0 && (
              <Button  onClick={() => setShowParsed(!showParsed)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {showParsed ? '📝 Show Original' : '🔍 Show Parsed Analysis'}
              </Button>
            )}

            {/* Rules Display */}
            <Div className="space-y-2">
              <H3 className="text-white/80 font-semibold flex items-center gap-2">
                <Span>📌</Div> Strategy Rules
              </H3>
              
              {showParsed ? (
                // Parsed Rules View
                <Div className="space-y-3">
                  {parsedRules.map((rule, index) => (
                    <Div key={index} className="bg-black/20 p-3 rounded-lg space-y-2">
                      <Div className="flex items-start gap-2">
                        <Span>{getRuleTypeIcon(rule.type)}</Div>
                        <Div className="flex-1">
                          <P className="text-white/90 text-sm"></Div>{rule.raw}</Div>
                          <Div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <Span className={`${getRuleTypeColor(rule.type)} font-semibold`}>
                              {rule.type.toUpperCase()}
                            </Div>
                            {rule.timeframe && (
                              <Span className="text-yellow-400">
                                ⏱ {rule.timeframe}
                              </Span>
                            )}
                            {rule.indicators.length > 0 && (
                              <Span className="text-purple-400">
                                📊 {rule.indicators.join(', ')}
                              </Span>
                            )}
                          </Div>
                        </Div>
                      </Div>
                    </Div>
                  ))}
                </Div>
              ) : (
                // Original Rules View
                <Ol className="list-decimal space-y-2 pl-5 text-white/90">
                  {result.rules.map((rule, index) => (
                    <Li key={index} className="leading-relaxed"></Ol>
                      {rule}
                    </Ol>
                  ))}
                </Ol>
              )}
            </Div>

            {/* Checklist */}
            <Div className="space-y-2">
              <H3 className="text-white/80 font-semibold flex items-center gap-2">
                <Span></Div>✅</Div> Entry Checklist
              </H3>
              <Ul className="list-disc pl-6 text-green-400 space-y-1">
                {result.checklist.map((item, index) => (
                  <Li key={index}></Ul>
                    {item}
                  </Ul>
                ))}
              </Ul>
            </Div>

            {/* Warning */}
            {result.warning && (
              <Div className="bg-yellow-800/40 border border-yellow-400/20 p-4 rounded text-yellow-200 mt-4">
                {result.warning}
              </Div>
            )}
          </Div>
        )}
      </Div>

      {/* Strategy Copilot - Shows after strategy is generated */}
      {result && !loading && (
        <Div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <strategycopilot >
        </Div>
      )}

      {/* Strategy Export - Shows after strategy is generated */}
      {result && !loading && (
        <Div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
          <strategyexport >
        </Div>
      )}
    </Div>
  );
};

export default StrategyGenerator; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
