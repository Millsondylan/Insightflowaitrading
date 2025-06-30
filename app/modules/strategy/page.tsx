'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Settings,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  tags: string[];
  performance: {
    winRate: number;
    totalTrades: number;
    avgReturn: number;
  };
  lastUpdated: string;
  isPublic: boolean;
  isFavorite: boolean;
}

export default function StrategyPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data - in real app this would come from Supabase
  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Breakout with RSI Filter',
      description: 'Enter on breakout above resistance with RSI confirmation below 70',
      tags: ['breakout', 'RSI', 'momentum'],
      performance: {
        winRate: 68,
        totalTrades: 45,
        avgReturn: 2.3
      },
      lastUpdated: '2024-01-15',
      isPublic: true,
      isFavorite: true
    },
    {
      id: '2',
      name: 'Mean Reversion Scalper',
      description: 'Scalp trades on oversold/overbought conditions with tight stops',
      tags: ['scalping', 'mean-reversion', 'Bollinger'],
      performance: {
        winRate: 72,
        totalTrades: 128,
        avgReturn: 0.8
      },
      lastUpdated: '2024-01-14',
      isPublic: false,
      isFavorite: false
    }
  ];

  const availableTags = ['breakout', 'RSI', 'momentum', 'scalping', 'mean-reversion', 'Bollinger', 'trend-following', 'swing-trading'];

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => strategy.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Brain className="h-8 w-8 text-blue-400 mr-3" />
              Strategy Intelligence
            </h1>
            <p className="text-slate-300">AI-powered strategy builder and vault management</p>
          </div>
          <button
            onClick={() => router.push('/modules/strategy/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Strategy
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tags Filter */}
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Strategies Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStrategies.map(strategy => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStrategies.map(strategy => (
              <StrategyListItem key={strategy.id} strategy={strategy} />
            ))}
          </div>
        )}

        {filteredStrategies.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No strategies found</h3>
            <p className="text-slate-500">Create your first AI-powered strategy to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: Strategy }) {
  const router = useRouter();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/strategy/${strategy.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{strategy.name}</h3>
          <p className="text-slate-400 text-sm mb-3">{strategy.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {strategy.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
          {strategy.isPublic && <Eye className="h-4 w-4 text-blue-400" />}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {strategy.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{strategy.performance.winRate}%</div>
          <div className="text-xs text-slate-400">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-400">{strategy.performance.totalTrades}</div>
          <div className="text-xs text-slate-400">Trades</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{strategy.performance.avgReturn}%</div>
          <div className="text-xs text-slate-400">Avg Return</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Updated {strategy.lastUpdated}</span>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-slate-700 rounded">
            <Edit className="h-3 w-3" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StrategyListItem({ strategy }: { strategy: Strategy }) {
  const router = useRouter();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/strategy/${strategy.id}`)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
            {strategy.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
            {strategy.isPublic && <Eye className="h-4 w-4 text-blue-400" />}
          </div>
          <p className="text-slate-400 text-sm mb-3">{strategy.description}</p>
          <div className="flex flex-wrap gap-2">
            {strategy.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400">{strategy.performance.winRate}%</div>
            <div className="text-xs text-slate-400">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-400">{strategy.performance.totalTrades}</div>
            <div className="text-xs text-slate-400">Trades</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-400">{strategy.performance.avgReturn}%</div>
            <div className="text-xs text-slate-400">Avg Return</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-700 rounded">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 