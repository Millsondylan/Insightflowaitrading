import React from 'react';
import { ProtectedRoute as OldProtectedRoute } from '../core/ProtectedRoute';
import { Outlet } from 'react-router-dom';

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
      <div>
        {children}
        <Outlet />
      </div>
    </OldProtectedRoute>
  );
};

export default LegacyRouteWrapper; 