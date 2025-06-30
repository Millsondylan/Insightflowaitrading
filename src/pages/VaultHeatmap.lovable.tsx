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
    <Link  style={{ display: "block" }}>
      <Card  style={{ height: "100%" }}>
        <Cardheader >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <Cardtitle  style={{ fontSize: "1.125rem", color: "white" }}>
                {strategy.name}
              </Link>
              <Carddescription />
                {strategy.description}
              </Carddescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{strategy.category}</div>
            <Badge />
              {strategy.riskLevel}
            </Badge>
            {strategy.author.verified && (
              <Badge variant="outline">
                <Shield >
                Verified
              </Badge>
            )}
          </div />
        <Cardcontent >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-400">Total Return</Cardcontent>
              <p className="text-xl font-bold text-green-400">
                +{strategy.performance.totalReturn}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Win Rate</div>
              <p className="text-xl font-bold text-white">
                {strategy.performance.winRate}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Sharpe Ratio</div>
              <p className="text-lg font-semibold text-white">
                {strategy.performance.sharpeRatio}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Max Drawdown</div>
              <p className="text-lg font-semibold text-red-400">
                -{strategy.performance.maxDrawdown}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Star >
                {(strategy.stars / 1000).toFixed(1)}k
              </div>
              <span className="flex items-center gap-1">
                <Users >
                {strategy.users}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Clock >
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
              <Badge variant="outline" style={{ fontSize: "0.75rem" }}>
                <DollarSign >
                {(strategy.minimumCapital / 1000).toFixed(0)}k min
              </Badge>
            </div>
          </div />
      </Card />
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
              <gitcommit  style={{ color: "white" }}>
            </div>
            Strategy Vault
          </h1>
          <p className="text-gray-400 mt-1">
            Discover and analyze {comprehensiveStrategies.length}+ professional trading strategies
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card >
          <Cardcontent >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Return</div>
                <p className="text-2xl font-bold text-green-400">
                  +{stats.avgReturn.toFixed(1)}%
                </p>
              </div>
              <TrendingUp >
            </div />
        </TrendingUp>
        <Card >
          <Cardcontent >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Sharpe</Card>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.avgSharpe.toFixed(2)}
                </p>
              </div>
              <BarChart3 >
            </div />
        </BarChart3>
        <Card >
          <Cardcontent >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</Card>
                <p className="text-2xl font-bold text-purple-400">
                  {(stats.totalUsers / 1000).toFixed(1)}k
                </p>
              </div>
              <Users >
            </div />
        </Users>
        <Card >
          <Cardcontent >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Win Rate</Card>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.avgWinRate.toFixed(1)}%
                </p>
              </div>
              <Star >
            </div />
        </Star>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search >
              <Input placeholder="Search strategies, tags, or descriptions..."/> setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select >
              <SelectTrigger  style={{ color: "white" }}>
                <SelectValue placeholder="Category">
              </div>
              <SelectContent >
                <SelectItem value="all">All Categories</SelectContent>
                {strategyCategories.map(cat => (
                  <SelectItem >{cat}</SelectItem>
                ))}
              </SelectContent />
            
            <Select >
              <SelectTrigger  style={{ color: "white" }}>
                <SelectValue placeholder="Risk Level"/>
              <SelectContent >
                <SelectItem value="all">All Risk Levels</Select>
                {riskLevels.map(risk => (
                  <SelectItem >{risk}</SelectItem>
                ))}
              </SelectContent />
            
            <Select >
              <SelectTrigger  style={{ color: "white" }}>
                <SelectValue placeholder="Market"/>
              <SelectContent >
                <SelectItem value="all">All Markets</Select>
                {marketTypes.map(market => (
                  <SelectItem >{market}</SelectItem>
                ))}
              </SelectContent />
            
            <Select > setSortBy(v as any)}>
              <SelectTrigger  style={{ color: "white" }}>
                <SelectValue placeholder="Sort by"/>
              <SelectContent >
                <SelectItem value="returns">Returns</Select>
                <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                <SelectItem value="drawdown">Drawdown</SelectItem>
                <SelectItem value="winRate">Win Rate</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="stars">Stars</SelectItem />
            </SelectItem>
            
            <Button variant="outline" size="icon"> setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border-white/10"
            >
              {sortOrder === 'asc' ? <sortasc > : <sortdesc >}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400"></div>
            Showing {filteredStrategies.length} of {comprehensiveStrategies.length} strategies
          </div>
          <Tabs > setViewMode(v as 'grid' | 'list')}>
            <Tabslist >
              <Tabstrigger value="grid">Grid</Tabs>
              <Tabstrigger value="list">List</Tabstrigger />
          </Tabstrigger>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredStrategies.map(strategy => (
          <strategycard >
        ))}
      </div>
      
      {filteredStrategies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400"></div></div>No strategies found matching your criteria.</div>
          <Button variant="ghost"></button></div> {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedRisk('all');
              setSelectedMarket('all');
            }}
            className="mt-4"
          >
            Reset Filters
          </button>
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
