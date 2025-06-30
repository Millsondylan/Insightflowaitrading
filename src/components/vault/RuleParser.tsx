import React from 'react';
import { TrendingUp, Repeat, BarChart3, Activity, ChevronRight } from 'lucide-react';

type Props = {
  rules: string[];
};

const KEYWORDS = ['RSI', 'MACD', 'Moving Average', 'Support', 'Resistance', 'Breakout', 'Reversal', 'Volume', 'Spike', 'Above', 'Below', 'Crosses'];

const getIconForRule = (rule: string) => {
  const lowerRule = rule.toLowerCase();
  if (lowerRule.includes('breakout') || lowerRule.includes('break')) return <TrendingUp className="w-5 h-5 text-cyan-400" />;
  if (lowerRule.includes('reversal') || lowerRule.includes('bounce')) return <Repeat className="w-5 h-5 text-purple-400" />;
  if (lowerRule.includes('volume') || lowerRule.includes('spike')) return <BarChart3 className="w-5 h-5 text-yellow-400" />;
  if (lowerRule.includes('rsi') || lowerRule.includes('macd') || lowerRule.includes('ma')) return <Activity className="w-5 h-5 text-orange-400" />;
  return <ChevronRight className="w-5 h-5 text-white/50" />;
};

const highlightKeywords = (rule: string) => {
    const regex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'gi');
    const parts = rule.split(regex);

    return parts.map((part, index) => {
        const isKeyword = KEYWORDS.some(kw => kw.toLowerCase() === part.toLowerCase());
        if (isKeyword) {
            return <strong key={index} className="text-cyan-400 font-medium">{part}</strong>;
        }
        return part;
    });
};

export const RuleParser = ({ rules }: Props) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white/90">Strategy Rules</h3>
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center gap-4">
            <div className="flex-shrink-0">
              {getIconForRule(rule)}
            </div>
            <p className="text-white/80">
              {highlightKeywords(rule)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}; 