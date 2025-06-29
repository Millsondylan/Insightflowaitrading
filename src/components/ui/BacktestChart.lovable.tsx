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
      <div className="bg-black/80 backdrop-blur border border-white/20 rounded-lg p-2 text-white shadow-lg">
        <p className="text-gray-300 text-xs">
          {new Date(data.time * 1000).toLocaleString()}
        </p>
        <p className="font-bold">{`Price: ${data.price.toFixed(2)}`}</p>
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
    <div className="bg-black/80 backdrop-blur border border-white/20 rounded-lg p-2 text-white shadow-lg">
      <p className="font-bold">
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
  const [hoveredTrade, setHoveredTrade] = useState<Trademarker>(null);
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
    <blockreveal  />
      <div className="chart-container">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {ticker} ({timeframe})
          </h3>
        </div>
        <Responsivecontainer width="100%" height="90%">
          <Linechart  />
            <cartesiangrid strokeDasharray="3 3" >
            <xaxis dataKey="time" > new Date(time * 1000).toLocaleDateString()}
              tick={{ fill: '#9ca3af' }}
            />
            <yaxis  > value.toFixed(0)}
            />
            <tooltip  >} />
            <line type="monotone" dataKey="price" stroke="#22d3ee" >
            
            {/* Trade entry markers */}
            {animationComplete && tradeMarkers.filter(m => m.type === 'entry').map((marker, idx) => (
              <referencedot fill="#22c55e" stroke="#22c55e" > setHoveredTrade(marker)}
                onMouseOut={() => setHoveredTrade(null)}
              />
            ))}
            
            {/* Trade exit markers */}
            {animationComplete && tradeMarkers.filter(m => m.type === 'exit').map((marker, idx) => (
              <referencedot fill="#ef4444" stroke="#ef4444" > setHoveredTrade(marker)}
                onMouseOut={() => setHoveredTrade(null)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Hover tooltip for trade markers */}
        {hoveredTrade && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
            <tradetooltip  >
          </div>
        )}
      </div>
    </BlockReveal>
  );
};

export default BacktestChart; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
