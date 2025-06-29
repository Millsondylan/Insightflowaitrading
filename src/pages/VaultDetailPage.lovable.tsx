import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock data, in a real app this would come from an API
const strategyDetails = {
  id: '1',
  name: 'Momentum Scalper',
  author: 'CryptoWhale',
  description: 'A high-frequency strategy that aims to capture small profits from short-term momentum shifts in volatile assets like Bitcoin. It uses a combination of EMA crosses and RSI indicators.',
  tags: ['BTC', 'Scalping', 'High-Frequency'],
  performance: 23.5,
  stars: 1200,
  winRate: 68,
  avgPnl: 0.8,
  backtests: 124,
};

const GlassCard = ({ title, value, icon, unit = '' }: { title: string, value: string | number, icon: React.ElementType, unit?: string }) => {
    const Icon = icon;
    return (
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#9CA3AF" }}>
                <Icon size={14} />
                {title}
            </div>
            <p style={{ fontWeight: "700", color: "white" }}>{value}{unit}</p>
        </div>
    );
};


export default function VaultDetailPage() {
  const { id } = useParams<{ id: string }>();
  // In a real app, you'd fetch strategy details based on the id
  const strategy = strategyDetails;

  return (
    <div>
      <Link to="/vault" style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
        <ArrowLeft size={16} />
        Back to Vault
      </Link>

      <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "32px" }}>
        <header style={{ display: "flex", marginBottom: "32px" }}>
            <div>
                <h1 style={{ fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
                    <span ><GitCommit  /></span>
                    {strategy.name}
                </h1>
                <p style={{ color: "#9CA3AF" }}>by {strategy.author}</p>
            </div>
            <Link to={`/replay/${id}`}>
                <Button size="lg" style={{ color: "white" }}>
                    <PlayCircle size={20} />
                    Launch Replay
                </Button>
            </Link>
        </header>

        <p >{strategy.description}</p>
        
        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
          {strategy.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>

        <div >
            <GlassCard title="Performance" value={strategy.performance} unit="%" icon={TrendingUp} />
            <GlassCard title="Win Rate" value={strategy.winRate} unit="%" icon={Star} />
            <GlassCard title="Avg PnL/Trade" value={strategy.avgPnl} unit="%" icon={BarChart} />
            <GlassCard title="Backtests" value={strategy.backtests} icon={BarChart} />
        </div>
      </div>
    </div>
  );
} 