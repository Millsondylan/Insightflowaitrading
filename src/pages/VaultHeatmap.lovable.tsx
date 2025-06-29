import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
    <Link to={`/vault/${strategy.id}`} >
      <Card >
        <CardHeader>
          <div style={{ display: "flex" }}>
            <div >
              <CardTitle style={{ color: "white" }}>
                {strategy.name}
              </CardTitle>
              <CardDescription style={{ color: "#9CA3AF" }}>
                {strategy.description}
              </CardDescription>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Badge variant="secondary">{strategy.category}</Badge>
            <Badge className={getRiskColor(strategy.riskLevel)}>
              {strategy.riskLevel}
            </Badge>
            {strategy.author.verified && (
              <Badge variant="outline" >
                <span style={{fontSize: '16px'}}>🛡️</span>
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: "16px" }}>
            <div>
              <p style={{ color: "#9CA3AF" }}>Total Return</p>
              <p style={{ fontWeight: "700" }}>
                +{strategy.performance.totalReturn}%
              </p>
            </div>
            <div>
              <p style={{ color: "#9CA3AF" }}>Win Rate</p>
              <p style={{ fontWeight: "700", color: "white" }}>
                {strategy.performance.winRate}%
              </p>
            </div>
            <div>
              <p style={{ color: "#9CA3AF" }}>Sharpe Ratio</p>
              <p style={{ color: "white" }}>
                {strategy.performance.sharpeRatio}
              </p>
            </div>
            <div>
              <p style={{ color: "#9CA3AF" }}>Max Drawdown</p>
              <p >
                -{strategy.performance.maxDrawdown}%
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={{fontSize: '16px'}}>⭐</span>
                {(strategy.stars / 1000).toFixed(1)}k
              </span>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={{fontSize: '16px'}}>👤</span>
                {strategy.users}
              </span>
            </div>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>⏰</span>
              {strategy.timeframe}
            </span>
          </div>
          
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "white" }}>
                  {strategy.author.name.charAt(0)}
                </div>
                <span style={{ color: "#9CA3AF" }}>{strategy.author.name}</span>
              </div>
              <Badge variant="outline" >
                <span style={{fontSize: '16px'}}>💰</span>
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
      <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
            <span >
              <GitCommit style={{ color: "white" }} />
            </span>
            Strategy Vault
          </h1>
          <p style={{ color: "#9CA3AF" }}>
            Discover and analyze {comprehensiveStrategies.length}+ professional trading strategies
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ marginBottom: "32px" }}>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>Avg Return</p>
                <p style={{ fontWeight: "700" }}>
                  +{stats.avgReturn.toFixed(1)}%
                </p>
              </div>
              <span style={{fontSize: '16px'}}>📈</span>
            </div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>Avg Sharpe</p>
                <p style={{ fontWeight: "700" }}>
                  {stats.avgSharpe.toFixed(2)}
                </p>
              </div>
              <BarChart3  />
            </div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>Total Users</p>
                <p style={{ fontWeight: "700" }}>
                  {(stats.totalUsers / 1000).toFixed(1)}k
                </p>
              </div>
              <span style={{fontSize: '16px'}}>👤</span>
            </div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>Avg Win Rate</p>
                <p style={{ fontWeight: "700" }}>
                  {stats.avgWinRate.toFixed(1)}%
                </p>
              </div>
              <span style={{fontSize: '16px'}}>⭐</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div >
            <div >
              <span style={{fontSize: '16px'}}>🔍</span>
              <Input
                placeholder="Search strategies, tags, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ color: "white" }}
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger style={{ color: "white" }}>
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
              <SelectTrigger style={{ color: "white" }}>
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
              <SelectTrigger style={{ color: "white" }}>
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
              <SelectTrigger style={{ color: "white" }}>
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
              
            >
              {sortOrder === 'asc' ? <SortAsc  /> : <SortDesc  />}
            </Button>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ color: "#9CA3AF" }}>
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
        <div >
          <p style={{ color: "#9CA3AF" }}>No strategies found matching your criteria.</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedRisk('all');
              setSelectedMarket('all');
            }}
            
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
