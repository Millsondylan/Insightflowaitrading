import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const H3: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
};

export const P: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
};

export const H1: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
      {children}
    </h1>
  );
};

export const H2: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)}>
      {children}
    </h2>
  );
};

export const H4: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>
      {children}
    </h4>
  );
};

export const Blockquote: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  );
};

export const Code: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)}>
      {children}
    </code>
  );
};

export const Lead: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={cn("text-xl text-muted-foreground", className)}>
      {children}
    </p>
  );
};

export const Large: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <div className={cn("text-lg font-semibold", className)}>
      {children}
    </div>
  );
};

export const Small: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <small className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </small>
  );
};

export const Muted: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}; 