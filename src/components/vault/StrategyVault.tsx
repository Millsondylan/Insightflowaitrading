import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrategyCard, Strategy } from './StrategyCard';
import { Search } from 'lucide-react';

type Props = {
  strategies: Strategy[];
};

export const StrategyVault = ({ strategies }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
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
    <Div className="space-y-6">
      <Div className="flex flex-col md:flex-row gap-4">
        <Div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input placeholder="Search by title or tag..."
            value={searchTerm}
            onChange={(e) = /> setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 border-white/10"
          />
        </Div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <selectTrigger className="w-full md:w-[180px] bg-black/30 border-white/10">
            <selectValue placeholder="Sort by" / />
          <selectContent>
            <selectItem value="totalPnL">Sort by PnL</Select>
            <selectItem value="winRate">Sort by Win Rate</SelectItem />
        </Select>
      </Div>

      <Div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Button key={tag}
            variant={selectedTags.includes(tag) ? 'secondary' : 'outline'}
            onClick={() => handleTagClick(tag)}
            className="rounded-full"
          >
            {tag}
          </Div>
        ))}
      </Div>

      <Div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStrategies.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} /></Div></Div></Div>
        ))}
      </Div>
    </Div>
  );
}; 