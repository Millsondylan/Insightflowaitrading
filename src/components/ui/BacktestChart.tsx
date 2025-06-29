import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { ChartSeries, TradeMarker } from '@/lib/backtest/toChartSeries';
import BlockReveal from './BlockReveal';
import '@/styles/backtest.css';

interface BacktestChartProps {
  chartData: ChartSeries;
  ticker: string;
  timeframe: string;
}

// Custom tooltip component for price data
const PriceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Div className="bg-black/80 backdrop-blur border border-white/20 rounded-lg p-2 text-white shadow-lg">
        <P className="text-gray-300 text-xs">
          {new Date(data.time * 1000).toLocaleString()}
        </Div>
        <P className="font-bold">{`Price: ${data.price.toFixed(2)}`}</P>
      </Div>
    );
  }
  return null;
};

// Custom tooltip component for trade markers
const TradeTooltip = ({ trade }: { trade: TradeMarker }) => {
  const isEntry = trade.type === 'entry';
  const formattedTime = new Date(trade.time * 1000).toLocaleString();
  
  return (
    <Div className="bg-black/80 backdrop-blur border border-white/20 rounded-lg p-2 text-white shadow-lg">
      <P className="font-bold">
        {isEntry ? '🔼 Entry' : '🔽 Exit'} #{trade.tradeId}
      </Div>
      <P>{formattedTime}</P>
      <P>Price: {trade.price.toFixed(2)}</P>
      {!isEntry && trade.pnlPercentage !== undefined && (
        <P className={trade.pnlPercentage> 0 ? 'text-green-400' : 'text-red-400'}>
          PnL: {(trade.pnlPercentage * 100).toFixed(2)}%
        </P>
      )}
    </Div>
  );
};

const BacktestChart = ({ chartData, ticker, timeframe }: BacktestChartProps) => {
  const { priceData, tradeMarkers } = chartData;
  const [hoveredTrade, setHoveredTrade] = useState<tradeMarker | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Start animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate price domain with some padding
  const prices = priceData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;

  return (
    <blockReveal>
      <Div className="chart-container">
        <Div className="flex justify-between items-center mb-4">
          <H3 className="text-xl font-bold text-white">
            {ticker} ({timeframe})
          </Div>
        </Div>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={animationComplete ? priceData : []}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
 >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => new Date(time * 1000).toLocaleDateString()}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip content={<priceTooltip />} />
            <line
              type="monotone"
              dataKey="price"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
            
            {/* Trade entry markers */}
            {animationComplete && tradeMarkers.filter(m => m.type === 'entry').map((marker, idx) => (
              <ReferenceDot
                key={`entry-${idx}`}
                x={marker.time}
                y={marker.price}
                r={6}
                fill="#22c55e"
                stroke="#22c55e"
                strokeWidth={2}
                onMouseOver={() => setHoveredTrade(marker)}
                onMouseOut={() => setHoveredTrade(null)}
              />
            ))}
            
            {/* Trade exit markers */}
            {animationComplete && tradeMarkers.filter(m => m.type === 'exit').map((marker, idx) => (
              <ReferenceDot
                key={`exit-${idx}`}
                x={marker.time}
                y={marker.price}
                r={6}
                fill="#ef4444"
                stroke="#ef4444"
                strokeWidth={2}
                onMouseOver={() => setHoveredTrade(marker)}
                onMouseOut={() => setHoveredTrade(null)}
              />
            ))}
          </ResponsiveContainer />
        
        {/* Hover tooltip for trade markers */}
        {hoveredTrade && (
          <Div className="absolute top-1/2 right-8 transform -translate-y-1/2">
            <tradeTooltip trade={hoveredTrade} />
          </ResponsiveContainer>
        )}
      </div />
  );
};

export default BacktestChart;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 