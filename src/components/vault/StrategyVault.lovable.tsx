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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search >
          <Input placeholder="Search by title or tag..." /> setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 border-white/10"
          />
        </div>
        <select  >
          <selecttrigger  style={{ width: "100%" }}>
            <selectvalue placeholder="Sort by" >
          </SelectTrigger>
          <selectcontent  >
            <selectitem value="totalPnL" >Sort by PnL</SelectItem>
            <selectitem value="winRate" >Sort by Win Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button  > handleTagClick(tag)}
            className="rounded-full"
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStrategies.map(strategy => (
          <strategycard  >
        ))}
      </div>
    </div>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
