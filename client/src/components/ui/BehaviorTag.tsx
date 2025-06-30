
import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface BehaviorTagProps {
  tag: string;
  className?: string;
  style?: React.CSSProperties;
}

const BehaviorTag: React.FC<BehaviorTagProps> = ({ tag, className, style }) => {
  const getBehaviorColor = (behavior: string) => {
    const lowerBehavior = behavior.toLowerCase();
    
    if (lowerBehavior.includes('fear') || lowerBehavior.includes('panic')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    if (lowerBehavior.includes('greed') || lowerBehavior.includes('fomo')) {
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
    if (lowerBehavior.includes('confidence') || lowerBehavior.includes('patient')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (lowerBehavior.includes('doubt') || lowerBehavior.includes('hesitat')) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
    
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'text-xs',
        getBehaviorColor(tag),
        className
      )}
      style={style}
    >
      {tag}
    </Badge>
  );
};

export default BehaviorTag;

// Helper function to render multiple behavior tags with staggered animation
export const renderBehaviorTags = (tags: string[], className?: string) => {
  return tags.map((tag, index) => (
    <BehaviorTag
      key={`${tag}-${index}`}
      tag={tag}
      className={className}
      style={{ 
        animationDelay: `${index * 100}ms` 
      }}
    />
  ));
};

// Group component for behavior tags
export const BehaviorTagGroup: React.FC<{ tags: string[]; className?: string }> = ({ 
  tags, 
  className 
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {renderBehaviorTags(tags)}
    </div>
  );
};
