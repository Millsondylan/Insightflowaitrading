import { supabase } from './lib/db/supabase-client';
import { NavigateFunction } from 'react-router-dom';

// Function to check authentication and handle redirects
export const checkAuth = (navigate: NavigateFunction, currentPath: string) => {
  const token = localStorage.getItem('sb-auth-token');
  
  const isProtectedRoute = 
    currentPath.startsWith('/dashboard') ||
    currentPath.startsWith('/vault') ||
    currentPath.startsWith('/strategy-builder') ||
    currentPath.startsWith('/backtest') ||
    currentPath.startsWith('/trade-journal') ||
    currentPath.startsWith('/ai-vision') ||
    currentPath.startsWith('/academy') ||
    currentPath.startsWith('/notifications') ||
    currentPath.startsWith('/chat') ||
    currentPath.startsWith('/voice') ||
    currentPath.startsWith('/profile') ||
    currentPath.startsWith('/position-calculator') ||
    currentPath.startsWith('/upload-chart') ||
    currentPath.startsWith('/import-csv') ||
    currentPath.startsWith('/journal') ||
    currentPath.startsWith('/coach') ||
    currentPath.startsWith('/feed') ||
    currentPath.startsWith('/broadcast') ||
    currentPath.startsWith('/planner') ||
    currentPath.startsWith('/replay');
    
  const isAdminRoute = 
    currentPath.startsWith('/admin');

  // If trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    navigate('/auth', { state: { redirect: currentPath } });
    return false;
  }
  
  // If trying to access admin routes, verify admin status
  if (isAdminRoute) {
    // We need to verify if the user is an admin
    if (!token) {
      navigate('/auth', { state: { redirect: currentPath } });
      return false;
    }
    
    // This check would be done in the Admin component itself
  }

  return true;
};

// Hook to use in App.tsx to protect routes
export const useAuthMiddleware = (navigate: NavigateFunction, location: { pathname: string }) => {
  const isAuthenticated = checkAuth(navigate, location.pathname);
  return isAuthenticated;
}; 