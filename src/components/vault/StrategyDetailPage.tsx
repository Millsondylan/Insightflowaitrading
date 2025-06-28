import React from 'react';
import { RuleParser } from './RuleParser';
import { Button } from '@/components/ui/button';

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
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <p className="text-sm text-white/60">{label}</p>
        <p className="text-2xl font-bold text-white">
            {prefix}{value.toLocaleString()}{suffix}
        </p>
    </div>
);

export const StrategyDetailPage = ({ strategy }: Props) => {
  return (
    <div className="theme-vault p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{strategy.title}</h1>
        <p className="text-white/70 max-w-2xl">{strategy.summary}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {strategy.tags.map(tag => (
            <div key={tag} className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <RuleParser rules={strategy.rules} />
          <div>
            <h3 className="text-lg font-semibold text-white/90">Pre-Trade Checklist</h3>
            <ul className="space-y-2 mt-2">
              {strategy.checklist.map((item, index) => (
                <li key={index} className="text-white/80 bg-white/5 p-3 rounded-lg border border-white/10">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    <KPICard label="Win Rate" value={Math.round(strategy.winRate * 100)} suffix="%" />
                    <KPICard label="Total PnL" value={strategy.totalPnL} prefix="$" />
                    <KPICard label="Total Trades" value={strategy.trades} />
                </div>
            </div>

            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-full text-white h-12 text-lg font-bold">
                Clone to Builder
            </Button>
        </div>
      </div>
    </div>
  );
}; 