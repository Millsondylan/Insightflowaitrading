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
          <Div className="flex justify-between items-start mb-2">
            <Div className="flex-1">
              <Cardtitle  style={{ fontSize: "1.125rem", color: "white" }}>
                {strategy.name}
              </Link>
              <Carddescription  />
                {strategy.description}
              </Carddescription>
            </Div>
          </Div>
          <Div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{strategy.category}</Div>
            <Badge  />
              {strategy.riskLevel}
            </Badge>
            {strategy.author.verified && (
              <Badge variant="outline">
                <shield >
                Verified
              </Badge>
            )}
          </div />
        <Cardcontent >
          <Div className="grid grid-cols-2 gap-4 mb-4">
            <Div>
              <P className="text-xs text-gray-400">Total Return</Cardcontent>
              <P className="text-xl font-bold text-green-400">
                +{strategy.performance.totalReturn}%
              </P>
            </Div>
            <Div>
              <P className="text-xs text-gray-400">Win Rate</Div>
              <P className="text-xl font-bold text-white">
                {strategy.performance.winRate}%
              </P>
            </Div>
            <Div>
              <P className="text-xs text-gray-400">Sharpe Ratio</Div>
              <P className="text-lg font-semibold text-white">
                {strategy.performance.sharpeRatio}
              </P>
            </Div>
            <Div>
              <P className="text-xs text-gray-400">Max Drawdown</Div>
              <P className="text-lg font-semibold text-red-400">
                -{strategy.performance.maxDrawdown}%
              </P>
            </Div>
          </Div>
          
          <Div className="flex items-center justify-between text-sm text-gray-400">
            <Div className="flex items-center gap-4">
              <Span className="flex items-center gap-1">
                <star >
                {(strategy.stars / 1000).toFixed(1)}k
              </Div>
              <Span className="flex items-center gap-1">
                <users >
                {strategy.users}
              </Span>
            </Div>
            <Span className="flex items-center gap-1">
              <clock >
              {strategy.timeframe}
            </Span>
          </Div>
          
          <Div className="mt-3 pt-3 border-t border-white/10">
            <Div className="flex items-center justify-between">
              <Div className="flex items-center gap-2">
                <Div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {strategy.author.name.charAt(0)}
                </Div>
                <Span className="text-sm text-gray-400">{strategy.author.name}</Span>
              </Div>
              <Badge variant="outline" style={{ fontSize: "0.75rem" }}>
                <dollarsign >
                {(strategy.minimumCapital / 1000).toFixed(0)}k min
              </Badge>
            </Div>
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
    <Div>
      {/* Header */}
      <Div className="flex justify-between items-center mb-8">
        <Div>
          <H1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Span className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <gitcommit  style={{ color: "white" }}>
            </Div>
            Strategy Vault
          </H1>
          <P className="text-gray-400 mt-1">
            Discover and analyze {comprehensiveStrategies.length}+ professional trading strategies
          </P>
        </Div>
      </Div>

      {/* Stats Cards */}
      <Div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card >
          <Cardcontent >
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">Avg Return</Div>
                <P className="text-2xl font-bold text-green-400">
                  +{stats.avgReturn.toFixed(1)}%
                </P>
              </Div>
              <trendingup >
            </div />
        </Card>
        <Card >
          <Cardcontent >
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">Avg Sharpe</Card>
                <P className="text-2xl font-bold text-blue-400">
                  {stats.avgSharpe.toFixed(2)}
                </P>
              </Div>
              <barchart3 >
            </div />
        </Card>
        <Card >
          <Cardcontent >
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">Total Users</Card>
                <P className="text-2xl font-bold text-purple-400">
                  {(stats.totalUsers / 1000).toFixed(1)}k
                </P>
              </Div>
              <users >
            </div />
        </Card>
        <Card >
          <Cardcontent >
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">Avg Win Rate</Card>
                <P className="text-2xl font-bold text-yellow-400">
                  {stats.avgWinRate.toFixed(1)}%
                </P>
              </Div>
              <star >
            </div />
        </Card>
      </Div>

      {/* Filters and Search */}
      <Div className="space-y-4 mb-8">
        <Div className="flex flex-col lg:flex-row gap-4">
          <Div className="flex-1">
            <Div className="relative">
              <search >
              <Input placeholder="Search strategies, tags, or descriptions..."  /> setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </Div>
          </Div>
          <Div className="flex gap-2">
            <Select >
              <selecttrigger  style={{ color: "white" }}>
                <selectvalue placeholder="Category">
              </Div>
              <selectcontent >
                <selectitem value="all">All Categories</SelectItem>
                {strategyCategories.map(cat => (
                  <selectitem >{cat}</SelectItem>
                ))}
              </SelectContent />
            
            <Select >
              <selecttrigger  style={{ color: "white" }}>
                <selectvalue placeholder="Risk Level" />
              <selectcontent >
                <selectitem value="all">All Risk Levels</Select>
                {riskLevels.map(risk => (
                  <selectitem >{risk}</SelectItem>
                ))}
              </SelectContent />
            
            <Select >
              <selecttrigger  style={{ color: "white" }}>
                <selectvalue placeholder="Market" />
              <selectcontent >
                <selectitem value="all">All Markets</Select>
                {marketTypes.map(market => (
                  <selectitem >{market}</SelectItem>
                ))}
              </SelectContent />
            
            <Select > setSortBy(v as any)}>
              <selecttrigger  style={{ color: "white" }}>
                <selectvalue placeholder="Sort by" />
              <selectcontent >
                <selectitem value="returns">Returns</Select>
                <selectitem value="sharpe">Sharpe Ratio</SelectItem>
                <selectitem value="drawdown">Drawdown</SelectItem>
                <selectitem value="winRate">Win Rate</SelectItem>
                <selectitem value="users">Users</SelectItem>
                <selectitem value="stars">Stars</SelectItem />
            </Select>
            
            <Button variant="outline" size="icon"> setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border-white/10"
            >
              {sortOrder === 'asc' ? <sortasc > : <sortdesc >}
            </Button>
          </Div>
        </Div>
        
        <Div className="flex items-center justify-between">
          <P className="text-sm text-gray-400"></Div>
            Showing {filteredStrategies.length} of {comprehensiveStrategies.length} strategies
          </Div>
          <tabs > setViewMode(v as 'grid' | 'list')}>
            <Tabslist >
              <Tabstrigger value="grid">Grid</Tabslist>
              <Tabstrigger value="list">List</Tabstrigger />
          </Tabstrigger>
        </Div>
      </Div>

      {/* Strategies Grid */}
      <Div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredStrategies.map(strategy => (
          <strategycard >
        ))}
      </Div>
      
      {filteredStrategies.length === 0 && (
        <Div className="text-center py-12">
          <P className="text-gray-400"></Div></Div></Div></Div>No strategies found matching your criteria.</Div>
          <Button variant="ghost"> {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedRisk('all');
              setSelectedMarket('all');
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </Div>
      )}
    </Div>
  );
}


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
