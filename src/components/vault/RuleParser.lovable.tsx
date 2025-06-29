import React from 'react';

type Props = {
  rules: string[];
};

const KEYWORDS = ['RSI', 'MACD', 'Moving Average', 'Support', 'Resistance', 'Breakout', 'Reversal', 'Volume', 'Spike', 'Above', 'Below', 'Crosses'];

const getIconForRule = (rule: string) => {
  const lowerRule = rule.toLowerCase();
  if (lowerRule.includes('breakout') || lowerRule.includes('break')) return <span style={{fontSize: '16px'}}>📈</span>;
  if (lowerRule.includes('reversal') || lowerRule.includes('bounce')) return <Repeat  />;
  if (lowerRule.includes('volume') || lowerRule.includes('spike')) return <BarChart3  />;
  if (lowerRule.includes('rsi') || lowerRule.includes('macd') || lowerRule.includes('ma')) return <Activity  />;
  return <ChevronRight  />;
};

const highlightKeywords = (rule: string) => {
    const regex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'gi');
    const parts = rule.split(regex);

    return parts.map((part, index) => {
        const isKeyword = KEYWORDS.some(kw => kw.toLowerCase() === part.toLowerCase());
        if (isKeyword) {
            return <strong key={index} >{part}</strong>;
        }
        return part;
    });
};

export const RuleParser = ({ rules }: Props) => {
  return (
    <div >
      <h3 >Strategy Rules</h3>
      <div >
        {rules.map((rule, index) => (
          <div key={index} style={{ padding: "16px", border: "1px solid #374151", display: "flex", alignItems: "center" }}>
            <div >
              {getIconForRule(rule)}
            </div>
            <p >
              {highlightKeywords(rule)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}; 