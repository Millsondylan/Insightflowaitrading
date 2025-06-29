import React from 'react';

type HeatmapTag = {
  tag: string;
  count: number;
  avgWinRate: number; // Assumed to be a value between 0 and 1
  dominantEmotion: "Disciplined" | "Aggressive" | "Fearful" | "Neutral";
};

type Props = {
  data: HeatmapTag[];
};

// --- Helper Functions ---

// Generates a color from green (high win rate) to red (low win rate)
const getWinRateColor = (winRate: number): string => {
  const hue = winRate * 120; // 0 is red, 120 is green
  return `hsl(${hue}, 70%, 50%)`;
};

// --- Main Component ---

const StrategyHeatmap = ({ data }: Props) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <TooltipProvider>
      <div >
        {data.map((item) => {
          // Normalize size between a min and max font size for visual representation
          const fontSize = 1 + (item.count / maxCount) * 1.5; // From 1rem to 2.5rem
          const tileStyle = {
            borderColor: getWinRateColor(item.avgWinRate),
            borderWidth: '2px',
          };

          return (
            <Tooltip key={item.tag}>
              <TooltipTrigger asChild>
                <div 
                  style={{ padding: "16px", borderRadius: "0.75rem", display: "flex", flexDirection: "column" }}
                  style={tileStyle}
                >
                  <div>
                    <span style={{ color: "white" }}>
                      {item.dominantEmotion}
                    </span>
                  </div>
                  
                  <h3 
                    style={{ fontWeight: "700", color: "white" }} 
                    style={{ fontSize: `${fontSize}rem`, lineHeight: '1.1' }}
                  >
                    {item.tag}
                  </h3>
                  
                  <div style={{ display: "flex" }}>
                    <span>{item.count} Uses</span>
                    <span>{(item.avgWinRate * 100).toFixed(0)}% Win Rate</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.tag} - {item.dominantEmotion}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default StrategyHeatmap; 