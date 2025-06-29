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
                <Icon size={14} />
                {title}
            </div>
            <p className="text-2xl font-bold text-white">{value}{unit}</p>
        </div>
    );
};


export default function VaultDetailPage() {
  const { id } = useParams<{ id: string }>();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  // In a real app, you'd fetch strategy details based on the id
  const strategy = strategyDetails;

  return (
    <div>
      <Link to="/vault" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Vault
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-4">
                    <span className="bg-white/10 p-3 rounded-lg"><GitCommit className="text-blue-400" /></span>
                    {strategy.name}
                </h1>
                <p className="text-gray-400 mt-2">by {strategy.author}</p>
            </div>
            <Link to={`/replay/${id}`}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <playCircle size={20} className="mr-2"/>
                    Launch Replay
                </Button>
            </Link>
        </header>

        <p className="text-gray-300 max-w-3xl mb-6">{strategy.description}</p>
        
        <div className="flex items-center gap-2 mb-8">
          {strategy.tags.map(tag => <badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard title="Performance" value={strategy.performance} unit="%" icon={TrendingUp} />
            <GlassCard title="Win Rate" value={strategy.winRate} unit="%" icon={Star} />
            <GlassCard title="Avg PnL/Trade" value={strategy.avgPnl} unit="%" icon={BarChart} />
            <GlassCard title="Backtests" value={strategy.backtests} icon={BarChart} />
        </div>
      </div>
    </div>
  );
} 