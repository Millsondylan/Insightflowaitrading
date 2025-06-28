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
      <BlockReveal>
        <h2 className="text-3xl font-bold text-center mb-6">Backtest Results</h2>
      </BlockReveal>
      
      <BlockReveal>
        <KPICards stats={result.stats} />
      </BlockReveal>
      
      <BlockReveal delay={0.2}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Chart View
            </TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
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