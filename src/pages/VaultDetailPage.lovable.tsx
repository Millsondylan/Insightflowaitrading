import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PlayCircle, TrendingUp, BarChart, Star, GitCommit } from 'lucide-react';

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
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="flex justify-center items-center gap-2 text-gray-400 text-sm mb-2">
                <Icon>
                {title}
            </div>
            <p className="text-2xl font-bold text-white">{value}{unit}</p>
        </div>
    );
};


export default function VaultDetailPage() {
  const { id } = useParams<{ id: string }>();
  // In a real app, you'd fetch strategy details based on the id
  const strategy = strategyDetails;

  return (
    <div>
      <Link to="/vault" style={{ display: "flex", alignItems: "center" }}>
        <Arrowleft />
        Back to Vault
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-4">
                    <span className="bg-white/10 p-3 rounded-lg"><Gitcommit ></span>
                    {strategy.name}
                </h1>
                <p className="text-gray-400 mt-2">by {strategy.author}</p>
            </div>
            <Link  />
                <Button size="lg" style={{ color: "white" }}>
                    <playcircle  >
                    Launch Replay
                </Button>
            </Link>
        </header>

        <p className="text-gray-300 max-w-3xl mb-6">{strategy.description}</p>
        
        <div className="flex items-center gap-2 mb-8">
          {strategy.tags.map(tag => <badge variant="secondary" >{tag}</Badge>)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <glasscard title="Performance" unit="%" >
            <glasscard title="Win Rate" unit="%" >
            <glasscard title="Avg PnL/Trade" unit="%" >
            <glasscard title="Backtests" >
        </div>
      </div>
    </div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
