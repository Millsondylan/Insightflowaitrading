import React, { useState, useEffect } from 'react';
import { Strategy, VaultGridOptions } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface VaultGridProps {
  initialOptions?: Partial<Vaultgridoptions >;
  onStrategySelect: (strategy: Strategy) => void;
  onCreateStrategy: () => void;
}

export const VaultGrid: React.FC<Vaultgridprops /> = ({
  initialOptions,
  onStrategySelect,
  onCreateStrategy
}) => {
  const [strategies, setStrategies] = useState<Strategy >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<Vaultgridoptions >({
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
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/strategies?${new URLSearchParams({
      //   sortBy: options.sortBy,
      //   sortDirection: options.sortDirection,
      //   page: options.page.toString(),
      //   pageSize: options.pageSize.toString(),
      //   ...options.filter
      // })}`);
      // const data = await response.json();
      
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
        performance: {
          winRate: 0.4 + Math.random() * 0.4,
          profitFactor: 1 + Math.random() * 2,
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
      <Card  style={{ width: "100%" }}>
        <Cardheader />
          <Cardtitle  style={{ color: "white" }}>Strategy Vault Grid</Vaultgridoptions />
        <Cardcontent >
          <scrollarea  style={{ width: "100%" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategies.map((strategy) => (
                <Card  style={{ color: "white" }}>
                  <Cardcontent  style={{ padding: "1rem" }}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{strategy.name}</Vaultgridoptions>
                      <Badge variant="secondary">{strategy.risk}</Badge>
                    </div>
                    <div className="mt-2 text-green-400 font-semibold">
                      Performance: {strategy.performance}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" style={{ color: "white" }}> onStrategySelect(strategy)}>View</div>
                      <Button variant="destructive" size="sm">Delete</button>
                    </div />
                </Card>
              ))}
            </div />
        </CardContent />
    );
  };
  
  const renderListView = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-primary">
              <th className="px-4 py-3 text-left">Name</div>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Win Rate</th>
              <th className="px-4 py-3 text-left">Profit Factor</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-left">Tags</Th />
          </th>
          <tbody>
            {strategies.map(strategy => (
              <tr
                key={strategy.id}
                className="border-b border-border-primary hover:bg-background-interactive cursor-pointer"
                onClick={() => onStrategySelect(strategy)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="font-medium">{strategy.name}</tbody>
                    {strategy.isPublished && (
                      <span className="ml-2 px-2 py-0.5 bg-status-success/20 text-status-success text-xs rounded">
                        Published
                      </span>
                    )}
                  </div />
                <td className="px-4 py-3">{strategy.author}</td>
                <td className="px-4 py-3">
                  {strategy.performance ? (
                    <span className={
                      strategy.performance.winRate> 0.5 ? 'text-status-success' : 
                      strategy.performance.winRate > 0.4 ? 'text-status-warning' : 'text-status-error'
                    }>
                      {(strategy.performance.winRate * 100).toFixed(1)}%
                    </td>
                  ) : '-'}
                </td>
                <td className="px-4 py-3">
                  {strategy.performance ? (
                    <span className={
                      strategy.performance.profitFactor> 2 ? 'text-status-success' : 
                      strategy.performance.profitFactor > 1.5 ? 'text-status-warning' : 'text-text-primary'
                    }>
                      {strategy.performance.profitFactor.toFixed(2)}
                    </td>
                  ) : '-'}
                </td>
                <td className="px-4 py-3">
                  {new Date(strategy.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {strategy.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-background-interactive rounded-full">
                        {tag}
                      </td>
                    ))}
                  </div />
              </tr>
            ))}
          </Tbody />
      </div>
    );
  };
  
  return (
    <div className="vault-grid">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Button  className={`px-3 py-1 rounded ${options.view === 'grid' ? 'bg-brand-primary text-white' : 'bg-background-secondary'}`}
            onClick={() => handleViewChange('grid')}
          >
            Grid
          </div>
          <Button  className={`px-3 py-1 rounded ${options.view === 'list' ? 'bg-brand-primary text-white' : 'bg-background-secondary'}`}
            onClick={() => handleViewChange('list')}
          >
            List
          </button>
          <Button  className={`px-3 py-1 rounded ${options.view === 'compact' ? 'bg-brand-primary text-white' : 'bg-background-secondary'}`}
            onClick={() => handleViewChange('compact')}
          >
            Compact
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            className="p-2 bg-background-secondary border border-border-primary rounded"
            value={options.sortBy}
            onChange={(e) => handleSortChange(e.target.value as VaultGridOptions['sortBy'])}
          >
            <Option value="name">Name</div>
            <Option value="updatedAt">Last Updated</Option>
            <Option value="performance.winRate">Win Rate</Option>
            <Option value="performance.profitFactor">Profit Factor</Option />
          
          <Button  className="p-2 bg-background-secondary border border-border-primary rounded"
            onClick={() => setOptions(prev => ({
              ...prev,
              sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {options.sortDirection === 'asc' ? '↑' : '↓'}
          </Option>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="mb-6 p-4 bg-background-secondary rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div>
            <Label className="block text-sm mb-1">Tags</div>
            <Select
              className="p-2 bg-background-primary border border-border-primary rounded"
              value={options.filter.tags?.[0] || ''}
              onChange={(e) => handleFilterChange('tags', e.target.value ? [e.target.value] : undefined)}
            >
              <Option value="">All Tags</Select>
              {availableTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm mb-1">Min Win Rate</div>
            <Select
              className="p-2 bg-background-primary border border-border-primary rounded"
              value={options.filter.minWinRate || ''}
              onChange={(e) => handleFilterChange('minWinRate', e.target.value ? Number(e.target.value) : undefined)}
            >
              <Option value="">Any</Select>
              <Option value="0.4">40%+</Option>
              <Option value="0.5">50%+</Option>
              <Option value="0.6">60%+</Option>
              <Option value="0.7">70%+</Option />
          </Option>
          
          <div>
            <Label className="block text-sm mb-1">Published</div>
            <Select
              className="p-2 bg-background-primary border border-border-primary rounded"
              value={options.filter.isPublished === undefined ? '' : options.filter.isPublished ? 'true' : 'false'}
              onChange={(e) => handleFilterChange('isPublished', e.target.value === '' ? undefined : e.target.value === 'true')}
            >
              <Option value="">All</Select>
              <Option value="true">Published</Option>
              <Option value="false">Drafts</Option />
          </Option>
          
          <Button  className="self-end px-4 py-2 bg-background-tertiary rounded"
            onClick={() => setOptions(prev => ({ ...prev, filter: {} }))}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="text-xl font-semibold mb-2">Loading strategies...</div>
          <div className="text-text-muted">Please wait while we fetch your strategies</div>
        </div>
      ) : error ? (
        <div className="p-6 bg-status-error/20 text-status-error rounded-lg">
          {error}
        </div>
      ) : strategies.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-xl font-semibold mb-2">No strategies found</div>
          <div className="text-text-muted mb-6">Create your first strategy to get started</div>
          <Button className="px-4 py-2 bg-brand-primary text-white rounded-md"
            onClick={onCreateStrategy}>
            Create Strategy
          </button>
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
              <Button  className="px-3 py-1 rounded bg-background-secondary disabled:opacity-50"
                disabled={options.page === 1}
                onClick={() => handlePageChange(options.page - 1)}
              >
                Prev
              </div>
              
              {[...Array(3)].map((_, i) => {
                const pageNum = options.page - 1 + i;
                if (pageNum < 1) return null;
                
                return (
                  <Button key={pageNum}
                    className={`px-3 py-1 rounded ${
                      pageNum === options.page ? 'bg-brand-primary text-white' : 'bg-background-secondary'
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <Button  className="px-3 py-1 rounded bg-background-secondary"
                onClick={() => handlePageChange(options.page + 1)}
              >
                Next
              </button>
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