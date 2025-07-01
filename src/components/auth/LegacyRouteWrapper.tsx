
import React from 'react';
import ProtectedRoute from '../core/ProtectedRoute';

interface LegacyRouteWrapperProps {
  accessLevel: 'admin' | 'subscribed' | 'trial' | 'pro';
  children: React.ReactNode;
}

const LegacyRouteWrapper: React.FC<LegacyRouteWrapperProps> = ({ 
  accessLevel, 
  children 
}) => {
  // For now, just render children directly since ProtectedRoute uses Outlet
  return <>{children}</>;
};

export default LegacyRouteWrapper;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
