
import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface BehaviorTagProps {
  tag: string;
  className?: string;
}

export const BehaviorTag: React.FC<BehaviorTagProps> = ({ tag, className }) => {
  return (
    <Badge 
      variant="secondary" 
      className={cn("text-xs", className)}
    >
      {tag}
    </Badge>
  );
};

interface BehaviorTagGroupProps {
  tags: string[];
  animated?: boolean;
  className?: string;
}

export const BehaviorTagGroup: React.FC<BehaviorTagGroupProps> = ({ 
  tags, 
  animated = false, 
  className 
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag, index) => (
        <BehaviorTag 
          key={tag} 
          tag={tag} 
          className={animated ? "animate-fade-in-up" : ""}
          style={animated ? { animationDelay: `${index * 100}ms` } : undefined}
        />
      ))}
    </div>
  );
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
