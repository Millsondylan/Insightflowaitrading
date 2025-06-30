
import React from 'react';
import { ProtectedRoute as OldProtectedRoute } from '../core/ProtectedRoute';

interface LegacyRouteWrapperProps {
  accessLevel: 'admin' | 'subscribed' | 'trial' | 'pro';
  children: React.ReactNode;
}

const LegacyRouteWrapper: React.FC<LegacyRouteWrapperProps> = ({ 
  accessLevel, 
  children 
}) => {
  return (
    <OldProtectedRoute accessLevel={accessLevel}>
      {children}
    </OldProtectedRoute>
  );
};

export default LegacyRouteWrapper;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
