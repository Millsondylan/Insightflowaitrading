
import React from 'react';
import { Button } from '@/components/ui/button';

interface StickyActionBarProps {
  children: React.ReactNode;
  show?: boolean;
  className?: string;
}

const StickyActionBar = ({ children, show = true, className = '' }: StickyActionBarProps) => {
  if (!show) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 ${className}`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        {children}
      </div>
    </div>
  );
};

export default StickyActionBar;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
