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
      <div style={{ border: "1px solid #374151", color: "white" }}>
        <p >
          {new Date(data.time * 1000).toLocaleString()}
        </p>
        <p style={{ fontWeight: "700" }}>{`Price: ${data.price.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip component for trade markers
const TradeTooltip = ({ trade }: { trade: TradeMarker }) => {
  const isEntry = trade.type === 'entry';
  const formattedTime = new Date(trade.time * 1000).toLocaleString();
  
  return (
    <div style={{ border: "1px solid #374151", color: "white" }}>
      <p style={{ fontWeight: "700" }}>
        {isEntry ? '🔼 Entry' : '🔽 Exit'} #{trade.tradeId}
      </p>
      <p>{formattedTime}</p>
      <p>Price: {trade.price.toFixed(2)}</p>
      {!isEntry && trade.pnlPercentage !== undefined && (
        <p className={trade.pnlPercentage > 0 ? 'text-green-400' : 'text-red-400'}>
          PnL: {(trade.pnlPercentage * 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
};

const BacktestChart = ({ chartData, ticker, timeframe }: BacktestChartProps) => {
  const { priceData, tradeMarkers } = chartData;
  const [hoveredTrade, setHoveredTrade] = useState<TradeMarker | null>(null);
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
    <BlockReveal>
      <div >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontWeight: "700", color: "white" }}>
            {ticker} ({timeframe})
          </h3>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={animationComplete ? priceData : []}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <span style={{fontSize: '16px'}}>❌</span> new Date(time * 1000).toLocaleDateString()}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip content={<PriceTooltip />} />
            <Line
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
          </LineChart>
        </ResponsiveContainer>
        
        {/* Hover tooltip for trade markers */}
        {hoveredTrade && (
          <div >
            <TradeTooltip trade={hoveredTrade} />
          </div>
        )}
      </div>
    </BlockReveal>
  );
};

export default BacktestChart; 