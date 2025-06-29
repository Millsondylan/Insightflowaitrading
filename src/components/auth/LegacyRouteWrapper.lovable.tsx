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

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
}; 