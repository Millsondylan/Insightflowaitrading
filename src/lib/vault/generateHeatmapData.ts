type Strategy = {
  tags: string[];
  winRate: number;
  emotion: "Disciplined" | "Aggressive" | "Fearful" | "Neutral";
};

type HeatmapTag = {
  tag: string;
  count: number;
  avgWinRate: number;
  dominantEmotion: "Disciplined" | "Aggressive" | "Fearful" | "Neutral";
};

export function generateHeatmapData(strategies: Strategy[]): HeatmapTag[] {
  // Group strategies by tag (case-insensitive)
  const tagMap = new Map<string, {
    strategies: Strategy[];
    totalWinRate: number;
    emotions: Record<string, number>;
  }>();

  strategies.forEach(strategy => {
    strategy.tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      
      if (!tagMap.has(normalizedTag)) {
        tagMap.set(normalizedTag, {
          strategies: [],
          totalWinRate: 0,
          emotions: { Disciplined: 0, Aggressive: 0, Fearful: 0, Neutral: 0 }
        });
      }

      const tagData = tagMap.get(normalizedTag)!;
      tagData.strategies.push(strategy);
      tagData.totalWinRate += strategy.winRate;
      tagData.emotions[strategy.emotion]++;
    });
  });

  // Convert map to HeatmapTag array
  const heatmapTags: HeatmapTag[] = [];

  tagMap.forEach((data, normalizedTag) => {
    // Find the original case for the tag (use first occurrence)
    const originalTag = data.strategies[0].tags.find(
      tag => tag.toLowerCase() === normalizedTag
    ) || normalizedTag;

    // Calculate average win rate
    const avgWinRate = Math.round((data.totalWinRate / data.strategies.length) * 10) / 10;

    // Find dominant emotion
    let dominantEmotion: HeatmapTag['dominantEmotion'] = 'Neutral';
    let maxCount = 0;

    Object.entries(data.emotions).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion as HeatmapTag['dominantEmotion'];
      }
    });

    heatmapTags.push({
      tag: originalTag,
      count: data.strategies.length,
      avgWinRate,
      dominantEmotion
    });
  });

  // Sort by count descending
  return heatmapTags.sort((a, b) => b.count - a.count);
} 