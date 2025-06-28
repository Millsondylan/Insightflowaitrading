import React from 'react';
import { Link } from 'react-router-dom';
import { GitCommit, Star, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const strategies = [
  { id: '1', name: 'Momentum Scalper', tags: ['BTC', 'Scalping'], performance: 23.5, stars: 1200 },
  { id: '2', name: 'Arbitrage Bot', tags: ['ETH', 'Arbitrage'], performance: 18.2, stars: 850 },
  { id: '3', name: 'Trend Follower', tags: ['Forex', 'Swing'], performance: 15.1, stars: 2300 },
  { id: '4', name: 'Mean Reversion', tags: ['Stocks', 'Day Trading'], performance: 12.8, stars: 450 },
  { id: '5', name: 'Liquidity Provider', tags: ['DeFi', 'Yield Farming'], performance: 9.7, stars: 150 },
  { id: '6', name: 'AI Predictive', tags: ['Crypto', 'AI'], performance: 28.9, stars: 3100 },
];

const StrategyCard = ({ strategy }: { strategy: (typeof strategies)[0] }) => (
  <Link to={`/vault/${strategy.id}`} className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm group">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
      <div className="flex items-center gap-1 text-yellow-400">
        <Star size={16} />
        <span className="font-medium">{(strategy.stars / 1000).toFixed(1)}k</span>
      </div>
    </div>
    <div className="flex items-center gap-2 mt-2">
      {strategy.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
    </div>
    <div className="mt-6 flex justify-between items-end">
      <div>
        <p className="text-sm text-gray-400">Performance</p>
        <p className="text-2xl font-bold text-green-400 flex items-center gap-1">
          <TrendingUp size={20} />
          {strategy.performance}%
        </p>
      </div>
      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">View Details</Button>
    </div>
  </Link>
);

export default function VaultPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="bg-white/10 p-2 rounded-lg"><GitCommit className="text-blue-400" /></span>
            Strategy Vault
          </h1>
          <p className="text-gray-400 mt-1">Discover and analyze trading strategies from the community.</p>
        </div>
        <Button variant="outline">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}
