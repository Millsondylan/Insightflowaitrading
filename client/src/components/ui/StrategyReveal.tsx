
import React from 'react';
import BlockReveal from './BlockReveal';

interface StrategyRevealProps {
  title: string;
  rules: string[];
  indicators: string[];
  timeframes: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const StrategyReveal = ({ title, rules, indicators, timeframes, riskLevel }: StrategyRevealProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <BlockReveal delay={0}>
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      </BlockReveal>

      <div className="grid md:grid-cols-2 gap-6">
        <BlockReveal delay={0.2}>
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Trading Rules</h3>
            <ul className="space-y-2">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </BlockReveal>

        <BlockReveal delay={0.4}>
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {indicators.map((indicator, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        </BlockReveal>

        <BlockReveal delay={0.6}>
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Timeframes</h3>
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {timeframe}
                </span>
              ))}
            </div>
          </div>
        </BlockReveal>

        <BlockReveal delay={0.8}>
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Risk Level</h3>
            <span className={`px-4 py-2 rounded-lg border font-medium ${getRiskColor(riskLevel)}`}>
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
            </span>
          </div>
        </BlockReveal>
      </div>
    </div>
  );
};

export default StrategyReveal;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
