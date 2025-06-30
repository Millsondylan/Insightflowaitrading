import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  GitCommit, 
  Star, 
  TrendingUp, 
  Filter, 
  ChevronDown,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  comprehensiveStrategies, 
  strategyCategories,
  riskLevels,
  marketTypes,
  filterStrategies,
  sortStrategies,
  type Strategy
} from '@/lib/vault/comprehensiveStrategies';

const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
  const getRiskColor = (risk: string) => {
    const colors = {
      'Low': 'text-green-400 bg-green-400/20',
      'Low-Medium': 'text-green-400 bg-green-400/20',
      'Medium': 'text-yellow-400 bg-yellow-400/20',
      'Medium-High': 'text-orange-400 bg-orange-400/20',
      'High': 'text-red-400 bg-red-400/20',
      'Very High': 'text-red-600 bg-red-600/20'
    };
    return colors[risk as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  return (
    <Link to={`/vault/${strategy.id}`} className="block">
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm group h-full">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                {strategy.name}
              </CardTitle>
              <CardDescription className="text-gray-400 line-clamp-2 mt-1">
                {strategy.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{strategy.category}</Badge>
            <Badge className={getRiskColor(strategy.riskLevel)}>
              {strategy.riskLevel}
            </Badge>
            {strategy.author.verified && (
              <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-400">Total Return</p>
              <p className="text-xl font-bold text-green-400">
                +{strategy.performance.totalReturn}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-white">
                {strategy.performance.winRate}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Sharpe Ratio</p>
              <p className="text-lg font-semibold text-white">
                {strategy.performance.sharpeRatio}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Max Drawdown</p>
              <p className="text-lg font-semibold text-red-400">
                -{strategy.performance.maxDrawdown}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {(strategy.stars / 1000).toFixed(1)}k
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {strategy.users}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {strategy.timeframe}
            </span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {strategy.author.name.charAt(0)}
                </div>
                <span className="text-sm text-gray-400">{strategy.author.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                {(strategy.minimumCapital / 1000).toFixed(0)}k min
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
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
    const avgReturn = filteredStrategies.reduce((acc, s) => acc + s.performance.totalReturn, 0) / filteredStrategies.length;
    const avgSharpe = filteredStrategies.reduce((acc, s) => acc + s.performance.sharpeRatio, 0) / filteredStrategies.length;
    const totalUsers = filteredStrategies.reduce((acc, s) => acc + s.users, 0);
    const avgWinRate = filteredStrategies.reduce((acc, s) => acc + s.performance.winRate, 0) / filteredStrategies.length;
    
    return { avgReturn, avgSharpe, totalUsers, avgWinRate };
  }, [filteredStrategies]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <GitCommit className="text-white" />
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
              <TrendingUp className="w-8 h-8 text-green-400/20" />
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
              <BarChart3 className="w-8 h-8 text-blue-400/20" />
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
              <Users className="w-8 h-8 text-purple-400/20" />
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
              <Star className="w-8 h-8 text-yellow-400/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {strategyCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Risk Level" />
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
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {marketTypes.map(market => (
                  <SelectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="returns">Returns</SelectItem>
                <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                <SelectItem value="drawdown">Drawdown</SelectItem>
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
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
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
          <StrategyCard key={strategy.id} strategy={strategy} />
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
