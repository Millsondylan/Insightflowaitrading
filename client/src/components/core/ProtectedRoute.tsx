import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth.tsx';
import { FC } from 'react';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { session, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Admin required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
