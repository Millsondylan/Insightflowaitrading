import React from 'react';
import { ProtectedRoute as OldProtectedRoute } from '../core/ProtectedRoute';

interface LegacyRouteWrapperProps {
  accessLevel: 'admin' | 'subscribed' | 'trial' | 'pro';
  children: React.ReactNode;
}

const LegacyRouteWrapper: React.FC<Legacyroutewrapperprops > = ({ 
  accessLevel, 
  children 
}) => {
  return (
    <oldprotectedroute  />
      {children}
    </Legacyroutewrapperprops>
  );
};

export default LegacyRouteWrapper; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
