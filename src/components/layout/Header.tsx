import React from 'react';

const Header = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <header className={className}>
      {children}
    </header>
  );
};

export default Header; 
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 
