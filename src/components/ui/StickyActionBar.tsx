import React from 'react';
import { cn } from '@/lib/utils';
import { useMobileDetector } from '@/hooks/use-mobile-detector';

interface StickyActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  fixed?: boolean;
  position?: 'top' | 'bottom';
  showOnDesktop?: boolean;
}

export function StickyActionBar({
  children,
  className,
  fixed = true,
  position = 'bottom',
  showOnDesktop = false,
  ...props
}: StickyActionBarProps) {
  const { isMobile } = useMobileDetector();
  
  // If it's not mobile and we don't want to show on desktop, don't render
  if (!isMobile && !showOnDesktop) {
    return null;
  }

  return (
    <Div className={cn(
        'z-50 w-full bg-background/80 backdrop-blur-lg border-t border-border px-4 py-3',
        position === 'bottom' ? 'bottom-0' : 'top-0',
        fixed ? 'fixed' : 'sticky',
        !showOnDesktop && 'md:hidden',
        className
      )}
      {...props}
   >
      <Div className="flex items-center justify-between gap-2 max-w-screen-xl mx-auto">
        {children}
      </HTMLDivElement>
    </Div>
  );
}

export function ActionButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  );
}

export function ActionGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Div
      className={cn(
        'flex items-center gap-2',
        className
      )}
      {...props}
    />
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 