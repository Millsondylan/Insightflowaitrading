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
    <p className="text-gray-400 text-sm">{label}</div>
    <p className={`text-2xl font-bold ${color || ''}`}>{value}</p>
  </div>
);

const BacktestResultDisplay = ({ result, candles, ticker, timeframe }: BacktestResultDisplayProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const chartData = toChartSeries(candles, result.trades);
  
  return (
    <div className="space-y-8 mt-12">
      <Blockreveal>
        <h2 className="text-3xl font-bold text-center mb-6">Backtest Results</div />
      
      <blockreveal />
        <Kpicards />
      
      <Blockreveal  //>
        <Tabs  style={{ width: "100%" }}>
          <Tabslist  style={{ width: "100%", display: "grid" }}>
            <Tabstrigger value="overview">
              Chart View
            </div>
            <Tabstrigger value="trades">
              Trade Explorer
            </Tabstrigger />
          
          <TabsContent value="overview">
            <backtestchart />
          
          <TabsContent value="trades">
            <tradeexplorer />
        </Tabs />
    </Tabstrigger>
  );
};

export default BacktestResultDisplay; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
