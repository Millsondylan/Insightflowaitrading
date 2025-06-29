import React from "react";
import { cn } from "@/lib/utils";

interface ProgressSidebarProps {
  blocks: { id: string; title: string; topic: string }[];
  activeBlock: string;
  progress: number;
  onBlockClick: (id: string) => void;
}

const ProgressSidebar: React.FC<Progresssidebarprops > = ({
  blocks,
  activeBlock,
  progress,
  onBlockClick,
}) => {
  const topics = blocks.reduce((acc, block) => {
    if (!acc.find((item) => item.topic === block.topic)) {
      acc.push({ topic: block.topic, id: block.id });
    }
    return acc;
  }, [] as { topic: string; id: string }[]);

  let currentTopic = blocks.find((b) => b.id === activeBlock)?.topic;

  return (
    <aside className="sticky top-24 h-full">
      <div className="relative pl-8">
        {/* Progress Bar */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-700" />
        <div
          className="absolute left-4 top-2 w-0.5 bg-blue-500 transition-all duration-300"
          style={{ height: `calc(${progress}% - 1rem)` }}
        />

        <nav className="flex flex-col items-start">
          {blocks.map((block) => {
            const isTopicHeader = block.id === topics.find(t => t.topic === block.topic)?.id;
            const isActive = block.id === activeBlock;

            return (
              <div key={block.id} className="w-full">
                {isTopicHeader && (
                  <h3 className="text-lg font-bold mt-6 mb-3 text-blue-400">
                    {block.topic}
                  </h3>
                )}
                <button
                  onClick={() => onBlockClick(block.id)}
                  className="flex items-center w-full text-left py-1.5 group"
                >
                  <div
                    className={cn(
                      "absolute left-[11px] h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-900 transition-all duration-300",
                      { "bg-blue-500 border-blue-500 scale-125": isActive }
                    )}
                  />
                  <Span className={cn(
                      "text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white",
                      { "text-white": isActive }
                    )}
                  />
                    {block.title}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default ProgressSidebar; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
