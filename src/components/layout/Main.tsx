import React from 'react';

const Main = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <main className={className}>
      {children}
    </main>
  );
};

export default Main; 
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 
