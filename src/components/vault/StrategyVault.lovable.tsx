import React, { useState, useMemo } from 'react';
import { StrategyCard, Strategy } from './StrategyCard';

type Props = {
  strategies: Strategy[];
};

export const StrategyVault = ({ strategies }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('totalPnL');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    strategies.forEach(s => s.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [strategies]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredStrategies = useMemo(() => {
    let result = [...strategies];

    if (searchTerm) {
      result = result.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(s => 
        selectedTags.every(st => s.tags.includes(st))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'winRate') {
        return b.winRate - a.winRate;
      }
      return b.totalPnL - a.totalPnL;
    });

    return result;
  }, [strategies, searchTerm, selectedTags, sortBy]);

  return (
    <div >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div >
          <span style={{fontSize: '16px'}}>🔍</span>
          <Input 
            placeholder="Search by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger style={{ width: "100%" }}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="totalPnL">Sort by PnL</SelectItem>
            <SelectItem value="winRate">Sort by Win Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div style={{ display: "flex" }}>
        {allTags.map(tag => (
          <Button 
            key={tag}
            variant={selectedTags.includes(tag) ? 'secondary' : 'outline'}
            onClick={() => handleTagClick(tag)}
            
          >
            {tag}
          </Button>
        ))}
      </div>

      <div >
        {filteredStrategies.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}; 