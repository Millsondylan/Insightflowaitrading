
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type HeatmapTag = {
  tag: string;
  count: number;
  avgWinRate: number;
  dominantEmotion: "Disciplined" | "Aggressive" | "Fearful" | "Neutral";
};

type Props = {
  data: HeatmapTag[];
};

const getWinRateColor = (winRate: number): string => {
  const hue = winRate * 120;
  return `hsl(${hue}, 70%, 50%)`;
};

const StrategyHeatmap = ({ data }: Props) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {data.map((item) => {
          const fontSize = 1 + (item.count / maxCount) * 1.5;
          const tileStyle = {
            borderColor: getWinRateColor(item.avgWinRate),
            borderWidth: '2px',
          };

          return (
            <Tooltip key={item.tag}>
              <TooltipTrigger asChild>
                <div 
                  className="bg-white/10 p-4 rounded-xl text-white/80 shadow backdrop-blur-md flex flex-col justify-between h-40"
                  style={tileStyle}
                >
                  <div>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-600 text-white">
                      {item.dominantEmotion}
                    </span>
                  </div>
                  
                  <h3 
                    className="font-bold text-center text-white break-words" 
                    style={{ fontSize: `${fontSize}rem`, lineHeight: '1.1' }}
                  >
                    {item.tag}
                  </h3>
                  
                  <div className="flex justify-between text-xs text-white/70">
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
