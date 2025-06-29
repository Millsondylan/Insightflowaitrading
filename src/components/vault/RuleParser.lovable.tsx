import React from 'react';
import { TrendingUp, Repeat, BarChart3, Activity, ChevronRight } from 'lucide-react';

type Props = {
  rules: string[];
};

const KEYWORDS = ['RSI', 'MACD', 'Moving Average', 'Support', 'Resistance', 'Breakout', 'Reversal', 'Volume', 'Spike', 'Above', 'Below', 'Crosses'];

const getIconForRule = (rule: string) => {
  const lowerRule = rule.toLowerCase();
  if (lowerRule.includes('breakout') || lowerRule.includes('break')) return <Trendingup>;
  if (lowerRule.includes('reversal') || lowerRule.includes('bounce')) return <Repeat  />;
  if (lowerRule.includes('volume') || lowerRule.includes('spike')) return <barchart3 >;
  if (lowerRule.includes('rsi') || lowerRule.includes('macd') || lowerRule.includes('ma')) return <Activity >;
  return <Chevronright  /></Trendingup></Trendingup></Trendingup>;
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
    <Div className="space-y-3">
      <H3 className="text-lg font-semibold text-white/90"></Div></Div>Strategy Rules</Div>
      <Div className="space-y-2">
        {rules.map((rule, index) => (
          <Div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center gap-4">
            <Div className="flex-shrink-0">
              {getIconForRule(rule)}
            </Div>
            <P className="text-white/80">
              {highlightKeywords(rule)}
            </P>
          </Div>
        ))}
      </Div>
    </Div>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
