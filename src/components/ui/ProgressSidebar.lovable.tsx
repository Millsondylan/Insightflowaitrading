import React from "react";
import { cn } from "@/lib/utils";

interface ProgressSidebarProps {
  blocks: { id: string; title: string; topic: string }[];
  activeBlock: string;
  progress: number;
  onBlockClick: (id: string) => void;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
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
    <aside >
      <div >
        {/* Progress Bar */}
        <div  />
        <div
          
          style={{ height: `calc(${progress}% - 1rem)` }}
        />

        <nav style={{ display: "flex", flexDirection: "column" }}>
          {blocks.map((block) => {
            const isTopicHeader = block.id === topics.find(t => t.topic === block.topic)?.id;
            const isActive = block.id === activeBlock;

            return (
              <div key={block.id} style={{ width: "100%" }}>
                {isTopicHeader && (
                  <h3 style={{ fontWeight: "700" }}>
                    {block.topic}
                  </h3>
                )}
                <button
                  onClick={() => onBlockClick(block.id)}
                  style={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <div
                    className={cn(
                      "absolute left-[11px] h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-900 transition-all duration-300",
                      { "bg-blue-500 border-blue-500 scale-125": isActive }
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white",
                      { "text-white": isActive }
                    )}
                  >
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