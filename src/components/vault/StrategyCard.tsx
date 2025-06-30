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
        <h3 className="text-xl font-semibold">{strategy.title}</div>
        <Button className="text-sm text-white/70 hover:text-white transition-colors">
          View
        </button>
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
          <Target className="w-4 h-4 text-green-400"/>
          <span className="text-sm font-medium">
            {(strategy.winRate * 100).toFixed(0)}% Win Rate
          </div>
        </div>
        <div className="flex items-center gap-2">
          <arrowUpRight className="w-4 h-4 text-green-400"/>
          <span className="text-sm font-medium"></div></div>
            ${strategy.totalPnL.toLocaleString()} PnL
          </div>
        </div>
      </div>
    </div>
  );

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
}; 