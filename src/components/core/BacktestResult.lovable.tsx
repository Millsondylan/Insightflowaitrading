import { useState } from 'react';
import { BacktestResult } from '@/lib/backtest/runBacktest';
import { OHLCV } from '@/lib/backtest/sampleData';
import { toChartSeries } from '@/lib/backtest/toChartSeries';
import BacktestChart from '@/components/ui/BacktestChart';
import KPICards from '@/components/ui/KPICards';
import TradeExplorer from './TradeExplorer';
import BlockReveal from '@/components/ui/BlockReveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '@/styles/backtest.css';

interface BacktestResultDisplayProps {
  result: BacktestResult;
  candles: OHLCV[];
  ticker: string;
  timeframe: string;
}

const formatPercent = (n: number) => `${(n * 100).toFixed(2)}%`;
const formatCurrency = (n: number) => n.toFixed(2);

const StatCard = ({ label, value, color }: { label: string, value: string | number, color?: string }) => (
  <div className="glass-section p-4 text-center">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-2xl font-bold ${color || ''}`}>{value}</p>
  </div>
);

const BacktestResultDisplay = ({ result, candles, ticker, timeframe }: BacktestResultDisplayProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const chartData = toChartSeries(candles, result.trades);
  
  return (
    <div className="space-y-8 mt-12">
      <blockreveal  >
        <h2 className="text-3xl font-bold text-center mb-6">Backtest Results</h2>
      </BlockReveal>
      
      <blockreveal  >
        <kpicards  >
      </BlockReveal>
      
      <blockreveal  >
        <tabs  style={{ width: "100%" }}>
          <tabslist  style={{ width: "100%", display: "grid" }}>
            <tabstrigger value="overview" >
              Chart View
            </TabsTrigger>
            <tabstrigger value="trades" >
              Trade Explorer
            </TabsTrigger>
          </TabsList>
          
          <tabscontent value="overview" >
            <backtestchart  >
          </TabsContent>
          
          <tabscontent value="trades" >
            <tradeexplorer  >
          </TabsContent>
        </Tabs>
      </BlockReveal>
    </div>
  );
};

export default BacktestResultDisplay; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
