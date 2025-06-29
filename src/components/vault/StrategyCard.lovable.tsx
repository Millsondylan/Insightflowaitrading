import React from 'react';
import { ArrowUpRight, Target } from "lucide-react";

export type Strategy = {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  winRate: number;
  totalPnL: number;
};

type Props = {
  strategy: Strategy;
};

export const StrategyCard = ({ strategy }: Props) => {
  return (
    <div className="bg-black/30 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{strategy.title}</h3>
        <button className="text-sm text-white/70 hover:text-white transition-colors">
          View
        </Button>
      </div>
      <p className="text-sm text-white/70 h-10">{strategy.summary}</p>
      <div className="flex flex-wrap gap-2">
        {strategy.tags.map((tag) => (
          <div key={tag} className="bg-white/10 px-2 py-1 rounded-full text-xs text-white/70">
            {tag}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
        <div className="flex items-center gap-2">
          <Target >
          <span className="text-sm font-medium">
            {(strategy.winRate * 100).toFixed(0)}% Win Rate
          </span>
        </div>
        <div className="flex items-center gap-2">
          <arrowupright  />
          <span className="text-sm font-medium">
            ${strategy.totalPnL.toLocaleString()} PnL
          </span>
        </div>
      </div>
    </div>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
