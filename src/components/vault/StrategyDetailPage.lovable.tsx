import React from 'react';
import { RuleParser } from './RuleParser';

export type Strategy = {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  rules: string[];
  checklist: string[];
  winRate: number;
  totalPnL: number;
  trades: number;
};

type Props = {
  strategy: Strategy;
};

const KPICard = ({ label, value, prefix = '', suffix = '' }: { label: string, value: number, prefix?: string, suffix?: string }) => (
    <div style={{ padding: "16px", border: "1px solid #374151" }}>
        <p >{label}</p>
        <p style={{ fontWeight: "700", color: "white" }}>
            {prefix}{value.toLocaleString()}{suffix}
        </p>
    </div>
);

export const StrategyDetailPage = ({ strategy }: Props) => {
  return (
    <div style={{ padding: "16px", marginTop: "32px" }}>
      {/* Header */}
      <div >
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>{strategy.title}</h1>
        <p >{strategy.summary}</p>
        <div style={{ display: "flex" }}>
          {strategy.tags.map(tag => (
            <div key={tag} >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div >
        <div >
          <RuleParser rules={strategy.rules} />
          <div>
            <h3 >Pre-Trade Checklist</h3>
            <ul >
              {strategy.checklist.map((item, index) => (
                <li key={index} style={{ border: "1px solid #374151" }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div >
            <div>
                <h3 >Performance</h3>
                <div >
                    <KPICard label="Win Rate" value={Math.round(strategy.winRate * 100)} suffix="%" />
                    <KPICard label="Total PnL" value={strategy.totalPnL} prefix="$" />
                    <KPICard label="Total Trades" value={strategy.trades} />
                </div>
            </div>

            <Button style={{ width: "100%", paddingLeft: "16px", paddingRight: "16px", color: "white", fontWeight: "700" }}>
                Clone to Builder
            </Button>
        </div>
      </div>
    </div>
  );
}; 