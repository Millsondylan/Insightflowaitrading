
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Typography = ({ children, className }: TypographyProps) => {
  return (
    <div className={cn("text-base", className)}>
      {children}
    </div>
  );
};

export default Typography;
