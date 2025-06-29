import React from 'react';

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
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151" }}>
      <div style={{ display: "flex" }}>
        <h3 >{strategy.title}</h3>
        <button >
          View
        </button>
      </div>
      <p >{strategy.summary}</p>
      <div style={{ display: "flex" }}>
        {strategy.tags.map((tag) => (
          <div key={tag} >
            {tag}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{fontSize: '16px'}}>🎯</span>
          <span >
            {(strategy.winRate * 100).toFixed(0)}% Win Rate
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{fontSize: '16px'}}>⬆️</span>
          <span >
            ${strategy.totalPnL.toLocaleString()} PnL
          </span>
        </div>
      </div>
    </div>
  );
}; 