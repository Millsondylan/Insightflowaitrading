import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth/sessionStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
    
    if (!isAuthenticated()) {
        // Redirect to sign-in page while saving the attempted URL
        return <navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
} 