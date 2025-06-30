import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';
import StrategyGenerator from '@/components/StrategyGenerator';
import { Button } from '@/components/ui/button';

export interface StrategyResponse {
  strategyName: string;
  description: string;
  rules: string[];
  entryChecklist: string[];
  warnings: string[];
  backtestTips: string[];
}

const StrategyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-glow-cyan mb-8 leading-tight">
            Strategy Builder
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create powerful trading strategies with our AI-powered builder. 
            Define your parameters, backtest your ideas, and deploy with confidence.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <StrategyGenerator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
