import React, { useState, useEffect } from 'react';
import { Strategy, VaultGridOptions } from './types';

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
  
  const handleFilterChange = (filterKey: string, value: any) => {
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
      <Card style={{ width: "100%" }}>
        <CardHeader>
          <CardTitle style={{ color: "white" }}>Strategy Vault Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea style={{ width: "100%" }}>
            <div >
              {strategies.map((strategy) => (
                <Card key={strategy.id} style={{ color: "white" }}>
                  <CardContent style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h3 style={{ fontWeight: "700" }}>{strategy.name}</h3>
                      <Badge variant="secondary">{strategy.risk}</Badge>
                    </div>
                    <div >
                      Performance: {strategy.performance}
                    </div>
                    <div style={{ display: "flex" }}>
                      <Button variant="outline" size="sm" style={{ color: "white" }} onClick={() => onStrategySelect(strategy)}>View</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
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
      <div >
        <table style={{ width: "100%" }}>
          <thead>
            <tr >
              <th style={{ paddingLeft: "16px", paddingRight: "16px" }}>Name</th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px" }}>Author</th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px" }}>Win Rate</th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px" }}>Profit Factor</th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px" }}>Updated</th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px" }}>Tags</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map(strategy => (
              <tr
                key={strategy.id}
                
                onClick={() => onStrategySelect(strategy)}
              >
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span >{strategy.name}</span>
                    {strategy.isPublished && (
                      <span >
                        Published
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>{strategy.author}</td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  {strategy.performance ? (
                    <span className={
                      strategy.performance.winRate > 0.5 ? 'text-status-success' : 
                      strategy.performance.winRate > 0.4 ? 'text-status-warning' : 'text-status-error'
                    }>
                      {(strategy.performance.winRate * 100).toFixed(1)}%
                    </span>
                  ) : '-'}
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  {strategy.performance ? (
                    <span className={
                      strategy.performance.profitFactor > 2 ? 'text-status-success' : 
                      strategy.performance.profitFactor > 1.5 ? 'text-status-warning' : 'text-text-primary'
                    }>
                      {strategy.performance.profitFactor.toFixed(2)}
                    </span>
                  ) : '-'}
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  {new Date(strategy.updatedAt).toLocaleDateString()}
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <div style={{ display: "flex" }}>
                    {strategy.tags.map((tag, i) => (
                      <span key={i} >
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
    <div >
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            className={`px-3 py-1 rounded ${options.view === 'grid' ? 'bg-brand-primary text-white' : 'bg-background-secondary'}`}
            onClick={() => handleViewChange('grid')}
          >
            Grid
          </button>
          <button
            className={`px-3 py-1 rounded ${options.view === 'list' ? 'bg-brand-primary text-white' : 'bg-background-secondary'}`}
            onClick={() => handleViewChange('list')}
          >
            List
          </button>
          <button
            className={`px-3 py-1 rounded ${options.view === 'compact' ? 'bg-brand-primary text-white' : 'bg-background-secondary'}`}
            onClick={() => handleViewChange('compact')}
          >
            Compact
          </button>
        </div>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            style={{ border: "1px solid #374151" }}
            value={options.sortBy}
            onChange={(e) => handleSortChange(e.target.value as VaultGridOptions['sortBy'])}
          >
            <option value="name">Name</option>
            <option value="updatedAt">Last Updated</option>
            <option value="performance.winRate">Win Rate</option>
            <option value="performance.profitFactor">Profit Factor</option>
          </select>
          
          <button
            style={{ border: "1px solid #374151" }}
            onClick={() => setOptions(prev => ({
              ...prev,
              sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {options.sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      {/* Filter Section */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex" }}>
          <div>
            <label >Tags</label>
            <select
              style={{ border: "1px solid #374151" }}
              value={options.filter.tags?.[0] || ''}
              onChange={(e) => handleFilterChange('tags', e.target.value ? [e.target.value] : undefined)}
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label >Min Win Rate</label>
            <select
              style={{ border: "1px solid #374151" }}
              value={options.filter.minWinRate || ''}
              onChange={(e) => handleFilterChange('minWinRate', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Any</option>
              <option value="0.4">40%+</option>
              <option value="0.5">50%+</option>
              <option value="0.6">60%+</option>
              <option value="0.7">70%+</option>
            </select>
          </div>
          
          <div>
            <label >Published</label>
            <select
              style={{ border: "1px solid #374151" }}
              value={options.filter.isPublished === undefined ? '' : options.filter.isPublished ? 'true' : 'false'}
              onChange={(e) => handleFilterChange('isPublished', e.target.value === '' ? undefined : e.target.value === 'true')}
            >
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Drafts</option>
            </select>
          </div>
          
          <button
            style={{ paddingLeft: "16px", paddingRight: "16px" }}
            onClick={() => setOptions(prev => ({ ...prev, filter: {} }))}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div >
          <div >Loading strategies...</div>
          <div >Please wait while we fetch your strategies</div>
        </div>
      ) : error ? (
        <div style={{ padding: "24px" }}>
          {error}
        </div>
      ) : strategies.length === 0 ? (
        <div >
          <div >No strategies found</div>
          <div >Create your first strategy to get started</div>
          <button
            style={{ paddingLeft: "16px", paddingRight: "16px", color: "white" }}
            onClick={onCreateStrategy}
          >
            Create Strategy
          </button>
        </div>
      ) : (
        <>
          {options.view === 'grid' && renderGridView()}
          {options.view === 'list' && renderListView()}
          {options.view === 'compact' && (
            <div style={{ padding: "24px" }}>
              Compact view is not yet implemented
            </div>
          )}
          
          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex" }}>
              <button
                
                disabled={options.page === 1}
                onClick={() => handlePageChange(options.page - 1)}
              >
                Prev
              </button>
              
              {[...Array(3)].map((_, i) => {
                const pageNum = options.page - 1 + i;
                if (pageNum < 1) return null;
                
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded ${
                      pageNum === options.page ? 'bg-brand-primary text-white' : 'bg-background-secondary'
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                
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