
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

export const H1 = ({ children, className }: TypographyProps) => {
  return (
    <h1 className={cn("text-4xl font-bold", className)}>
      {children}
    </h1>
  );
};

export const H2 = ({ children, className }: TypographyProps) => {
  return (
    <h2 className={cn("text-3xl font-bold", className)}>
      {children}
    </h2>
  );
};

export const H3 = ({ children, className }: TypographyProps) => {
  return (
    <h3 className={cn("text-2xl font-semibold", className)}>
      {children}
    </h3>
  );
};

export const P = ({ children, className }: TypographyProps) => {
  return (
    <p className={cn("text-base", className)}>
      {children}
    </p>
  );
};

export default Typography;
