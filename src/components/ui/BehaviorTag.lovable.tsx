import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Predefined behavior tag definitions with colors and descriptions
 */
const BEHAVIOR_DEFINITIONS: Record<string, { color: string; description: string; category: 'positive' | 'neutral' | 'warning' | 'negative' }> = {
  // Positive behaviors
  'Disciplined': { color: 'bg-green-600/20 text-green-400 border-green-500/30', description: 'Following trading plan consistently', category: 'positive' },
  'Patient': { color: 'bg-blue-600/20 text-blue-400 border-blue-500/30', description: 'Waiting for proper setups', category: 'positive' },
  'Risk-Aware': { color: 'bg-green-600/20 text-green-400 border-green-500/30', description: 'Managing risk appropriately', category: 'positive' },
  'Analytical': { color: 'bg-blue-600/20 text-blue-400 border-blue-500/30', description: 'Using technical analysis effectively', category: 'positive' },
  'Strategic': { color: 'bg-purple-600/20 text-purple-400 border-purple-500/30', description: 'Long-term thinking approach', category: 'positive' },
  
  // Neutral behaviors
  'Learning': { color: 'bg-gray-600/20 text-gray-300 border-gray-500/30', description: 'Developing trading skills', category: 'neutral' },
  'Cautious': { color: 'bg-gray-600/20 text-gray-300 border-gray-500/30', description: 'Conservative approach to risk', category: 'neutral' },
  'Observant': { color: 'bg-gray-600/20 text-gray-300 border-gray-500/30', description: 'Watching market conditions closely', category: 'neutral' },
  
  // Warning behaviors
  'Impatient': { color: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30', description: 'Rushing into trades without proper setup', category: 'warning' },
  'Overconfident': { color: 'bg-orange-600/20 text-orange-400 border-orange-500/30', description: 'Taking excessive risk due to recent wins', category: 'warning' },
  'Emotional': { color: 'bg-orange-600/20 text-orange-400 border-orange-500/30', description: 'Making decisions based on emotions', category: 'warning' },
  'Chasing': { color: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30', description: 'Entering trades after significant moves', category: 'warning' },
  
  // Negative behaviors
  'FOMO': { color: 'bg-red-600/20 text-red-400 border-red-500/30', description: 'Fear of missing out driving poor decisions', category: 'negative' },
  'Revenge-Trading': { color: 'bg-red-600/20 text-red-400 border-red-500/30', description: 'Trading to recover losses quickly', category: 'negative' },
  'Overleveraged': { color: 'bg-red-600/20 text-red-400 border-red-500/30', description: 'Using excessive position sizes', category: 'negative' },
  'Undisciplined': { color: 'bg-red-600/20 text-red-400 border-red-500/30', description: 'Not following trading rules', category: 'negative' },
  'Panic': { color: 'bg-red-600/20 text-red-400 border-red-500/30', description: 'Making fear-based decisions', category: 'negative' },
};

interface BehaviorTagProps {
  tag: string;
  className?: string;
  animated?: boolean;
  onClick?: (tag: string) => void;
  animationDelay?: number;
}

const BehaviorTag: React.FC<Behaviortagprops> = ({ 
  tag, 
  className, 
  animated = false, 
  onClick,
  animationDelay = 0 
}) => {
  // Get behavior definition or use default
  const definition = BEHAVIOR_DEFINITIONS[tag] || {
    color: 'bg-gray-600/20 text-gray-300 border-gray-500/30',
    description: 'Behavioral pattern identified',
    category: 'neutral' as const
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };
  
  const tagElement = (
    <Badge variant="outline" />
      {tag}
    </Behaviortagprops>
  );
  
  // Wrap with tooltip if we have a description
  return (
    <Tooltipprovider >
      <Tooltip  />
        <tooltiptrigger >
          {tagElement}
        </Tooltipprovider>
        <tooltipcontent side="top">
          <Div className="text-center">
            <P className="font-medium text-sm">{tag}</Div>
            <P className="text-xs text-gray-300 mt-1">{definition.description}</P>
          </div />
      </Tooltip />
  );
};

/**
 * Container component for displaying multiple behavior tags
 */
interface BehaviorTagGroupProps {
  tags: string[];
  className?: string;
  animated?: boolean;
  onTagClick?: (tag: string) => void;
  maxTags?: number;
}

export const BehaviorTagGroup: React.FC<behaviortaggroupprops > = ({
  tags,
  className,
  animated = false,
  onTagClick,
  maxTags = 5
}) => {
  const displayTags = tags.slice(0, maxTags);
  const hiddenCount = tags.length - displayTags.length;
  
  return (
    <Div className={cn('flex flex-wrap gap-2', className)}>
      {displayTags.map((tag, index) => (
        <behaviortag >
      ))}
      {hiddenCount > 0 && (
        <Badge variant="outline"></Div></Div></Div></Div></Div></Div>
          +{hiddenCount} more
        </Div>
      )}
    </Div>
  );
};

export default BehaviorTag; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
