import { useState } from 'react';
import { BacktestResult } from '@/lib/backtest/runBacktest';
import { OHLCV } from '@/lib/backtest/sampleData';
import { toChartSeries } from '@/lib/backtest/toChartSeries';
import BacktestChart from '@/components/ui/BacktestChart';
import KPICards from '@/components/ui/KPICards';
import TradeExplorer from './TradeExplorer';
import BlockReveal from '@/components/ui/BlockReveal';
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
  <div style={{ padding: "16px" }}>
    <p style={{ color: "#9CA3AF" }}>{label}</p>
    <p className={`text-2xl font-bold ${color || ''}`}>{value}</p>
  </div>
);

const BacktestResultDisplay = ({ result, candles, ticker, timeframe }: BacktestResultDisplayProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const chartData = toChartSeries(candles, result.trades);
  
  return (
    <div style={{ marginTop: "32px" }}>
      <BlockReveal>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700" }}>Backtest Results</h2>
      </BlockReveal>
      
      <BlockReveal>
        <KPICards stats={result.stats} />
      </BlockReveal>
      
      <BlockReveal delay={0.2}>
        <Tabs value={activeTab} onValueChange={setActiveTab} style={{ width: "100%" }}>
          <TabsList style={{ width: "100%" }}>
            <TabsTrigger value="overview" >
              Chart View
            </TabsTrigger>
            <TabsTrigger value="trades" >
              Trade Explorer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <BacktestChart chartData={chartData} ticker={ticker} timeframe={timeframe} />
          </TabsContent>
          
          <TabsContent value="trades">
            <TradeExplorer trades={result.trades} />
          </TabsContent>
        </Tabs>
      </BlockReveal>
    </div>
  );
};

export default BacktestResultDisplay; 