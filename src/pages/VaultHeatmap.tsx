import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Star, 
  Search, 
  SortAsc, 
  SortDesc, 
  GitCommit,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: string;
  market: string;
  tags: string[];
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  users: number;
  stars: number;
  views: number;
  createdAt: string;
}

const comprehensiveStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Golden Cross Momentum',
    description: 'Advanced momentum strategy using moving average crossovers with risk management',
    category: 'Momentum',
    riskLevel: 'Medium',
    market: 'Crypto',
    tags: ['momentum', 'moving-averages', 'crypto'],
    performance: {
      totalReturn: 45.2,
      sharpeRatio: 1.8,
      maxDrawdown: -12.3,
      winRate: 68.5
    },
    users: 1250,
    stars: 89,
    views: 5600,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mean Reversion Pro',
    description: 'Statistical arbitrage using Bollinger Bands and RSI divergence',
    category: 'Mean Reversion',
    riskLevel: 'Low',
    market: 'Forex',
    tags: ['mean-reversion', 'bollinger-bands', 'rsi'],
    performance: {
      totalReturn: 28.7,
      sharpeRatio: 2.1,
      maxDrawdown: -8.9,
      winRate: 72.1
    },
    users: 890,
    stars: 67,
    views: 4200,
    createdAt: '2024-02-03'
  },
  {
    id: '3',
    name: 'Volatility Breakout',
    description: 'High-frequency strategy capturing volatility expansion patterns',
    category: 'Volatility',
    riskLevel: 'High',
    market: 'Stocks',
    tags: ['volatility', 'breakout', 'high-frequency'],
    performance: {
      totalReturn: 67.3,
      sharpeRatio: 1.4,
      maxDrawdown: -18.7,
      winRate: 58.9
    },
    users: 567,
    stars: 45,
    views: 3100,
    createdAt: '2024-01-28'
  }
];

const strategyCategories = ['Momentum', 'Mean Reversion', 'Volatility', 'Trend Following', 'Arbitrage'];
const riskLevels = ['Low', 'Medium', 'High'];
const marketTypes = ['Crypto', 'Forex', 'Stocks', 'Commodities'];

const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{strategy.name}</CardTitle>
            <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {strategy.category}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getRiskColor(strategy.riskLevel)}`}>
                {strategy.riskLevel} Risk
              </Badge>
              <Badge variant="outline" className="text-xs">
                {strategy.market}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">Total Return</p>
            <p className="text-lg font-bold text-green-400">
              +{strategy.performance.totalReturn.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Sharpe Ratio</p>
            <p className="text-lg font-bold text-blue-400">
              {strategy.performance.sharpeRatio.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Max Drawdown</p>
            <p className="text-lg font-bold text-red-400">
              {strategy.performance.maxDrawdown.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Win Rate</p>
            <p className="text-lg font-bold text-purple-400">
              {strategy.performance.winRate.toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4"/>
              {strategy.users}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4"/>
              {strategy.stars}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4"/>
              {strategy.views}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Heart className="w-4 h-4"/>
            </Button>
            <Button size="sm" variant="ghost">
              <Share2 className="w-4 h-4"/>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const filterStrategies = (strategies: Strategy[], filters: {
  category?: string;
  riskLevel?: string;
  market?: string;
}) => {
  return strategies.filter(strategy => {
    if (filters.category && strategy.category !== filters.category) return false;
    if (filters.riskLevel && strategy.riskLevel !== filters.riskLevel) return false;
    if (filters.market && strategy.market !== filters.market) return false;
    return true;
  });
};

const sortStrategies = (strategies: Strategy[], sortBy: string, sortOrder: 'asc' | 'desc') => {
  return [...strategies].sort((a, b) => {
    let aValue: number;
    let bValue: number;
    
    switch (sortBy) {
      case 'returns':
        aValue = a.performance.totalReturn;
        bValue = b.performance.totalReturn;
        break;
      case 'sharpe':
        aValue = a.performance.sharpeRatio;
        bValue = b.performance.sharpeRatio;
        break;
      case 'drawdown':
        aValue = a.performance.maxDrawdown;
        bValue = b.performance.maxDrawdown;
        break;
      case 'winRate':
        aValue = a.performance.winRate;
        bValue = b.performance.winRate;
        break;
      case 'users':
        aValue = a.users;
        bValue = b.users;
        break;
      case 'stars':
        aValue = a.stars;
        bValue = b.stars;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
};

export default function VaultPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'returns' | 'sharpe' | 'drawdown' | 'winRate' | 'users' | 'stars'>('returns');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredStrategies = useMemo(() => {
    let strategies = [...comprehensiveStrategies];
    
    // Apply search filter
    if (searchTerm) {
      strategies = strategies.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply filters
    strategies = filterStrategies(strategies, {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      riskLevel: selectedRisk !== 'all' ? selectedRisk : undefined,
      market: selectedMarket !== 'all' ? selectedMarket : undefined,
    });
    
    // Apply sorting
    strategies = sortStrategies(strategies, sortBy, sortOrder);
    
    return strategies;
  }, [searchTerm, selectedCategory, selectedRisk, selectedMarket, sortBy, sortOrder]);

  const stats = useMemo(() => {
    if (filteredStrategies.length === 0) return { avgReturn: 0, avgSharpe: 0, totalUsers: 0, avgWinRate: 0 };
    
    const avgReturn = filteredStrategies.reduce((acc, s) => acc + s.performance.totalReturn, 0) / filteredStrategies.length;
    const avgSharpe = filteredStrategies.reduce((acc, s) => acc + s.performance.sharpeRatio, 0) / filteredStrategies.length;
    const totalUsers = filteredStrategies.reduce((acc, s) => acc + s.users, 0);
    const avgWinRate = filteredStrategies.reduce((acc, s) => acc + s.performance.winRate, 0) / filteredStrategies.length;
    
    return { avgReturn, avgSharpe, totalUsers, avgWinRate };
  }, [filteredStrategies]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <GitCommit className="text-white"/>
            </span>
            Strategy Vault
          </h1>
          <p className="text-gray-400 mt-1">
            Discover and analyze {comprehensiveStrategies.length}+ professional trading strategies
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Return</p>
                <p className="text-2xl font-bold text-green-400">
                  +{stats.avgReturn.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400/20"/>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Sharpe</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.avgSharpe.toFixed(2)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400/20"/>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-purple-400">
                  {(stats.totalUsers / 1000).toFixed(1)}k
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-400/20"/>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Win Rate</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.avgWinRate.toFixed(1)}%
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-400/20"/>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <Input 
                placeholder="Search strategies, tags, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {strategyCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Risk Level"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                {riskLevels.map(risk => (
                  <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Market"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {marketTypes.map(market => (
                  <SelectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sort By"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="returns">Returns</SelectItem>
                <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                <SelectItem value="drawdown">Max Drawdown</SelectItem>
                <SelectItem value="winRate">Win Rate</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="stars">Stars</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border-white/10"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4"/> : <SortDesc className="w-4 h-4"/>}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {filteredStrategies.length} of {comprehensiveStrategies.length} strategies
          </p>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredStrategies.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy}/>
        ))}
      </div>
      
      {filteredStrategies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No strategies found matching your criteria.</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedRisk('all');
              setSelectedMarket('all');
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 