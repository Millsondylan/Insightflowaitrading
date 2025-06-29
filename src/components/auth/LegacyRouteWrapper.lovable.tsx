import React from 'react';
import { ProtectedRoute as OldProtectedRoute } from '../core/ProtectedRoute';

interface LegacyRouteWrapperProps {
  accessLevel: 'admin' | 'subscribed' | 'trial' | 'pro';
  children: React.ReactNode;
}

const LegacyRouteWrapper: React.FC<legacyroutewrapperprops  > = ({ 
  accessLevel, 
  children 
}) => {
  return (
    <oldprotectedroute  >
      {children}
    </OldProtectedRoute>
  );
};

export default LegacyRouteWrapper; 
export const lovable = { component: true };
