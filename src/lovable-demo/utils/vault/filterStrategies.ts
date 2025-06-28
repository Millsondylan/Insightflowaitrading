type Strategy = {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  winRate: number;
  totalPnL: number;
};

export function filterStrategies(
  strategies: Strategy[],
  search: string,
  selectedTags: string[]
): Strategy[] {
  return strategies.filter(strategy => {
    // Check search term match (case-insensitive)
    const searchMatch = !search || 
      strategy.title.toLowerCase().includes(search.toLowerCase()) ||
      strategy.summary.toLowerCase().includes(search.toLowerCase());

    // Check that all selected tags are present in strategy tags
    const tagsMatch = selectedTags.length === 0 || 
      selectedTags.every(selectedTag => strategy.tags.includes(selectedTag));

    return searchMatch && tagsMatch;
  });
} 