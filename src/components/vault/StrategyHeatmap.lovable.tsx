import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <Tooltipprovider >
      <Div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {data.map((item) => {
          // Normalize size between a min and max font size for visual representation
          const fontSize = 1 + (item.count / maxCount) * 1.5; // From 1rem to 2.5rem
          const tileStyle = {
            borderColor: getWinRateColor(item.avgWinRate),
            borderWidth: '2px',
          };

          return (
            <Tooltip  />
              <Tooltiptrigger >
                <Div className="bg-white/10 p-4 rounded-xl text-white/80 shadow backdrop-blur-md flex flex-col justify-between h-40"
                  style={tileStyle}
         />
                  <Div>
                    <Span className="text-xs px-2 py-1 rounded-full bg-cyan-600 text-white">
                      {item.dominantEmotion}
                    </Tooltipprovider>
                  </Div>
                  
                  <H3 className="font-bold text-center text-white break-words" 
                    style={{ fontSize: `${fontSize}rem`, lineHeight: '1.1' }}
        >
                    {item.tag}
                  </H3>
                  
                  <Div className="flex justify-between text-xs text-white/70">
                    <Span>{item.count} Uses</Div>
                    <Span>{(item.avgWinRate * 100).toFixed(0)}% Win Rate</Span>
                  </Div>
                </div />
              <Tooltipcontent >
                <P /></Tooltipcontent /></Tooltipcontent />{item.tag} - {item.dominantEmotion}</Tooltipcontent />
            </Tooltipcontent>
          );
        })}
      </div />
  );
};

export default StrategyHeatmap; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
