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

const BehaviorTag: React.FC<BehaviorTagProps> = ({ 
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
    <Badge
      variant="outline"
      className={cn(
        'cursor-default transition-all duration-200',
        definition.color,
        'hover:scale-105 hover:shadow-md',
        // Glow effect based on category
        definition.category === 'positive' && 'hover:shadow-green-500/20',
        definition.category === 'warning' && 'hover:shadow-yellow-500/20',
        definition.category === 'negative' && 'hover:shadow-red-500/20',
        definition.category === 'neutral' && 'hover:shadow-gray-500/20',
        // Animation classes
        animated && 'opacity-0 translate-y-2 animate-tag-slide-in',
        onClick && 'cursor-pointer hover:brightness-110',
        className
      )}
      style={{
        animationDelay: animated ? `${animationDelay}ms` : undefined,
        animationFillMode: animated ? 'forwards' : undefined,
      }}
      onClick={handleClick}
    >
      {tag}
    </Badge>
  );
  
  // Wrap with tooltip if we have a description
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {tagElement}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-center">
            <p className="font-medium text-sm">{tag}</p>
            <p className="text-xs text-gray-300 mt-1">{definition.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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

export const BehaviorTagGroup: React.FC<BehaviorTagGroupProps> = ({
  tags,
  className,
  animated = false,
  onTagClick,
  maxTags = 5
}) => {
  const displayTags = tags.slice(0, maxTags);
  const hiddenCount = tags.length - displayTags.length;
  
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayTags.map((tag, index) => (
        <BehaviorTag
          key={tag}
          tag={tag}
          animated={animated}
          animationDelay={index * 100} // Stagger the animations
          onClick={onTagClick}
        />
      ))}
      {hiddenCount > 0 && (
        <Badge variant="outline" className="bg-gray-600/20 text-gray-400 border-gray-500/30">
          +{hiddenCount} more
        </Badge>
      )}
    </div>
  );
};

export default BehaviorTag; 