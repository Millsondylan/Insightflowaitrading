
import React, { useState, useEffect } from 'react';
import { Strategy, VaultGridOptions } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface VaultGridProps {
  initialOptions?: Partial<VaultGridOptions>;
  onStrategySelect: (strategy: Strategy) => void;
  onCreateStrategy: () => void;
}

export const VaultGrid: React.FC<VaultGridProps> = ({
  initialOptions,
  onStrategySelect,
  onCreateStrategy
}) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<VaultGridOptions>({
    sortBy: initialOptions?.sortBy || 'updatedAt',
    sortDirection: initialOptions?.sortDirection || 'desc',
    filter: initialOptions?.filter || {},
    view: initialOptions?.view || 'grid',
    pageSize: initialOptions?.pageSize || 12,
    page: initialOptions?.page || 1
  });
  
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  useEffect(() => {
    fetchStrategies();
  }, [options]);
  
  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockStrategies: Strategy[] = Array.from({ length: 20 }, (_, i) => ({
        id: `strategy-${i + 1}`,
        name: `Strategy ${i + 1}`,
        description: `This is a mock strategy ${i + 1} for development purposes.`,
        author: `user-${Math.floor(i / 3) + 1}`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
        version: '1.0.0',
        isPublished: i % 3 === 0,
        rules: [],
        tags: [
          i % 2 === 0 ? 'trend' : 'reversal',
          i % 3 === 0 ? 'macd' : i % 3 === 1 ? 'rsi' : 'bollinger',
          i % 4 === 0 ? 'btc' : i % 4 === 1 ? 'eth' : i % 4 === 2 ? 'forex' : 'stocks'
        ],
        risk: i % 3 === 0 ? 'Low' : i % 3 === 1 ? 'Medium' : 'High',
        performance: {
          winRate: 0.4 + Math.random() * 0.4,
          profitFactor: 1 + Math.random() * 2,
          totalReturn: `${(Math.random() * 50 - 10).toFixed(1)}%`,
          maxDrawdown: Math.random() * 0.3,
          sharpeRatio: 0.5 + Math.random() * 2,
          totalTrades: 50 + Math.floor(Math.random() * 200),
          profitableTrades: 20 + Math.floor(Math.random() * 100),
          averageWin: 1 + Math.random() * 3,
          averageLoss: 0.5 + Math.random() * 1.5,
          expectancy: 0.2 + Math.random() * 0.8,
          timeframe: ['1h', '4h', '1d'][Math.floor(Math.random() * 3)],
          period: {
            start: new Date(Date.now() - 30 * 86400000).toISOString(),
            end: new Date().toISOString()
          }
        }
      }));
      
      // Extract all unique tags
      const tags = new Set<string>();
      mockStrategies.forEach(strategy => {
        strategy.tags.forEach(tag => tags.add(tag));
      });
      
      setAvailableTags(Array.from(tags));
      setStrategies(mockStrategies);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching strategies:', err);
      setError('Failed to load strategies. Please try again.');
      setLoading(false);
    }
  };
  
  const handleSortChange = (sortBy: VaultGridOptions['sortBy']) => {
    setOptions(prev => ({
      ...prev,
      sortBy,
      sortDirection: prev.sortBy === sortBy && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleViewChange = (view: VaultGridOptions['view']) => {
    setOptions(prev => ({ ...prev, view }));
  };
  
  const handleFilterChange = (filterKey: string, value: unknown) => {
    setOptions(prev => ({
      ...prev,
      filter: { ...prev.filter, [filterKey]: value }
    }));
  };
  
  const handlePageChange = (newPage: number) => {
    setOptions(prev => ({ ...prev, page: newPage }));
  };
  
  const renderGridView = () => {
    return (
      <Card className="w-full h-[600px] bg-black/80 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Strategy Vault Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="bg-zinc-900 border-zinc-700 text-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{strategy.name}</h3>
                      <Badge variant="secondary">{strategy.risk}</Badge>
                    </div>
                    <div className="mt-2 text-green-400 font-semibold">
                      Performance: {strategy.performance.totalReturn}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="text-white" onClick={() => onStrategySelect(strategy)}>
                        View
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };
  
  const renderListView = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Win Rate</th>
              <th className="px-4 py-3 text-left">Profit Factor</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-left">Tags</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map(strategy => (
              <tr
                key={strategy.id}
                className="border-b border-zinc-700 hover:bg-zinc-800 cursor-pointer"
                onClick={() => onStrategySelect(strategy)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="font-medium">{strategy.name}</span>
                    {strategy.isPublished && (
                      <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                        Published
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{strategy.author}</td>
                <td className="px-4 py-3">
                  <span className={
                    strategy.performance.winRate > 0.5 ? 'text-green-400' : 
                    strategy.performance.winRate > 0.4 ? 'text-yellow-400' : 'text-red-400'
                  }>
                    {(strategy.performance.winRate * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={
                    strategy.performance.profitFactor > 2 ? 'text-green-400' : 
                    strategy.performance.profitFactor > 1.5 ? 'text-yellow-400' : 'text-white'
                  }>
                    {strategy.performance.profitFactor.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(strategy.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {strategy.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-zinc-700 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="vault-grid">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Button 
            className={`px-3 py-1 rounded ${options.view === 'grid' ? 'bg-blue-600 text-white' : 'bg-zinc-800'}`}
            onClick={() => handleViewChange('grid')}
          >
            Grid
          </Button>
          <Button 
            className={`px-3 py-1 rounded ${options.view === 'list' ? 'bg-blue-600 text-white' : 'bg-zinc-800'}`}
            onClick={() => handleViewChange('list')}
          >
            List
          </Button>
          <Button 
            className={`px-3 py-1 rounded ${options.view === 'compact' ? 'bg-blue-600 text-white' : 'bg-zinc-800'}`}
            onClick={() => handleViewChange('compact')}
          >
            Compact
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={options.sortBy} onValueChange={(value) => handleSortChange(value as VaultGridOptions['sortBy'])}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
              <SelectItem value="performance.winRate">Win Rate</SelectItem>
              <SelectItem value="performance.profitFactor">Profit Factor</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setOptions(prev => ({
              ...prev,
              sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {options.sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="mb-6 p-4 bg-zinc-900 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div>
            <Label className="block text-sm mb-1">Tags</Label>
            <Select
              value={options.filter.tags?.[0] || ''}
              onValueChange={(value) => handleFilterChange('tags', value ? [value] : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm mb-1">Min Win Rate</Label>
            <Select
              value={options.filter.minWinRate?.toString() || ''}
              onValueChange={(value) => handleFilterChange('minWinRate', value ? Number(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="0.4">40%+</SelectItem>
                <SelectItem value="0.5">50%+</SelectItem>
                <SelectItem value="0.6">60%+</SelectItem>
                <SelectItem value="0.7">70%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm mb-1">Published</Label>
            <Select
              value={options.filter.isPublished === undefined ? '' : options.filter.isPublished ? 'true' : 'false'}
              onValueChange={(value) => handleFilterChange('isPublished', value === '' ? undefined : value === 'true')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={() => setOptions(prev => ({ ...prev, filter: {} }))}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="text-xl font-semibold mb-2">Loading strategies...</div>
          <div className="text-gray-400">Please wait while we fetch your strategies</div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      ) : strategies.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-xl font-semibold mb-2">No strategies found</div>
          <div className="text-gray-400 mb-6">Create your first strategy to get started</div>
          <Button
            onClick={onCreateStrategy}
          >
            Create Strategy
          </Button>
        </div>
      ) : (
        <>
          {options.view === 'grid' && renderGridView()}
          {options.view === 'list' && renderListView()}
          {options.view === 'compact' && (
            <div className="text-center p-6">
              Compact view is not yet implemented
            </div>
          )}
          
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <Button
                disabled={options.page === 1}
                onClick={() => handlePageChange(options.page - 1)}
              >
                Prev
              </Button>
              
              {[...Array(3)].map((_, i) => {
                const pageNum = options.page - 1 + i;
                if (pageNum < 1) return null;
                
                return (
                  <Button
                    key={pageNum}
                    className={pageNum === options.page ? 'bg-blue-600 text-white' : 'bg-zinc-800'}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => handlePageChange(options.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['strategies'],
  aiBlocks: ['strategyAnalysis'],
  functions: ['getStrategies', 'filterStrategies']
};
