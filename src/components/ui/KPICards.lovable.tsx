import { useEffect, useState } from 'react';
import { BacktestStats } from '@/lib/backtest/runBacktest';
import BlockReveal from './BlockReveal';
import '@/styles/backtest.css';

interface KPICardsProps {
  stats: BacktestStats;
}

// Helper function to format percentages
const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

// Helper to determine card type based on value
const getCardType = (value: number, isInverse = false): 'positive' | 'negative' | 'neutral' => {
  if (isInverse) {
    return value > 0 ? 'negative' : value < 0 ? 'positive' : 'neutral';
  }
  return value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
};

// Component for a single KPI card with animated value
const KPICard = ({
  label,
  value,
  icon,
  type,
  format = (v: number) => v.toFixed(2),
  delay = 0,
}: {
  label: string;
  value: number;
  icon: string;
  type: 'positive' | 'negative' | 'neutral';
  format?: (value: number) => string;
  delay?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    // Simple animation for counting up
    const duration = 1000; // 1 second
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        setDisplayValue(progress * value);
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return (
    <div className={`kpi-card ${type}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span >{label}</span>
        <span >{icon}</span>
      </div>
      <div className={`kpi-value ${type}`}>
        {format(displayValue)}
      </div>
    </div>
  );
};

const KPICards = ({ stats }: KPICardsProps) => {
  type CardType = {
    label: string;
    value: number;
    icon: string;
    type: 'positive' | 'negative' | 'neutral';
    format: (value: number) => string;
    delay: number;
  };

  const cards: CardType[] = [
    {
      label: 'Total Return',
      value: stats.totalReturn,
      icon: '💰',
      type: getCardType(stats.totalReturn),
      format: formatPercent,
      delay: 0,
    },
    {
      label: 'Win Rate',
      value: stats.winRate,
      icon: '🎯',
      type: getCardType(stats.winRate - 0.5), // Above 50% is good
      format: formatPercent,
      delay: 100,
    },
    {
      label: 'Total Trades',
      value: stats.totalTrades,
      icon: '🔄',
      type: 'neutral',
      format: (v) => Math.round(v).toString(),
      delay: 200,
    },
    {
      label: 'Avg Win',
      value: stats.avgWin,
      icon: '📈',
      type: getCardType(stats.avgWin),
      format: formatPercent,
      delay: 300,
    },
    {
      label: 'Avg Loss',
      value: stats.avgLoss,
      icon: '📉',
      type: getCardType(stats.avgLoss),
      format: formatPercent,
      delay: 400,
    },
    {
      label: 'Max Drawdown',
      value: stats.maxDrawdown,
      icon: '🚨',
      type: getCardType(stats.maxDrawdown, true), // Inverse: lower is better
      format: formatPercent,
      delay: 500,
    },
  ];

  return (
    <div >
      {cards.map((card, index) => (
        <BlockReveal key={card.label} delay={index * 0.1}>
          <KPICard {...card} />
        </BlockReveal>
      ))}
    </div>
  );
};

export default KPICards; 