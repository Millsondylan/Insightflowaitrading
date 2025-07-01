export interface DetectionResult {
  patterns: string[];
  summary: string;
  confidence: number;
}

/**
 * Returns a hardcoded sample detection result to simulate AI analysis.
 */
export const getSampleDetections = (): DetectionResult => {
  const allPatterns = [
    "Double Top", "RSI Divergence", "Volume Spike", "Head and Shoulders",
    "Bullish Engulfing", "Support Break", "Rising Wedge", "Descending Triangle"
  ];

  // Pick a few random patterns for variety
  const shuffled = allPatterns.sort(() => 0.5 - Math.random());
  const selectedPatterns = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);

  return {
    patterns: selectedPatterns,
    summary: "This chart shows strong confluence for a potential trend reversal near a key price zone. The identified patterns suggest increasing selling pressure and a potential breakdown.",
    confidence: Math.floor(Math.random() * (95 - 75 + 1)) + 75, // Random confidence between 75 and 95
  };
}; 