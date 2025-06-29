import React from 'react';
import { cn } from '@/lib/utils';

export interface DivProps extends React.HTMLAttributes<HTMLDivElement></HTMLDivElement> {}

export const Div = React.forwardRef<HTMLDivElement, DivProps></HTMLDivElement>(({ className, children, ...props }, ref) => {
  return (
    <Div ref={ref} className={cn(className)} {...props}>
      {children}
    </Div>
  );
});

Div.displayName = 'Div';

export default Div;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 