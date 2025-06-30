export interface PatternZone {
  id: string;
  label: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage of image width
  height: number; // percentage of image height
  confidence?: number; // optional confidence score
  type?: 'bullish' | 'bearish' | 'neutral'; // optional pattern type
}

/**
 * Returns mock pattern zones for chart overlays
 */
export const getSampleOverlays = (): PatternZone[] => {
  // Return a random selection of overlays for variety
  const allOverlays = [
    {
      id: "zone1",
      label: "Double Top",
      description: "Bearish reversal pattern near resistance level",
      x: 65,
      y: 15,
      width: 25,
      height: 15,
      confidence: 92,
      type: 'bearish' as const
    },
    {
      id: "zone2",
      label: "Support Zone",
      description: "Historical price support area",
      x: 10,
      y: 65,
      width: 80,
      height: 10,
      confidence: 88,
      type: 'bullish' as const
    },
    {
      id: "zone3",
      label: "RSI Divergence",
      description: "Price making higher high but RSI making lower high",
      x: 50,
      y: 20,
      width: 30,
      height: 25,
      confidence: 76,
      type: 'bearish' as const
    },
    {
      id: "zone4",
      label: "Volume Spike",
      description: "Unusually high volume indicating strong interest",
      x: 75,
      y: 70,
      width: 15,
      height: 20,
      confidence: 94,
      type: 'neutral' as const
    },
    {
      id: "zone5",
      label: "Trend Line Break",
      description: "Price breaking below established trend line",
      x: 35,
      y: 40,
      width: 40,
      height: 20,
      confidence: 85,
      type: 'bearish' as const
    }
  ];
  
  // Return 2-4 random zones
  const shuffled = [...allOverlays].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
}; 