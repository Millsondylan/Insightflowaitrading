import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import NotificationCenter from '@/components/core/NotificationCenter';
import { initializeSession, useAuditLog } from '@/lib/monitoring/auditLogger';
import { SystemStatusPanel } from '@/components/core/SystemStatusPanel';
import { useDeveloperMode } from '@/hooks/use-developer-mode';
import BottomTabNavigator from '../mobile/BottomTabNavigator';

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  const { logNavigation } = useAuditLog();
  const { developerMode, toggleDeveloperMode } = useDeveloperMode();
  const location = useLocation();

  // Check if the current page is a public landing page
  const isPublicPage = ['/', '/about', '/pricing', '/terms', '/privacy', '/faq'].includes(location.pathname);
  
  // Initialize session for audit logging
  useEffect(() => {
    const sessionId = initializeSession();
    console.log(`Session initialized: ${sessionId}`);
    
    // Log page visit
    if (user) {
      logNavigation('previous_page', window.location.pathname);
    }
    
    // Track page changes
    const handleLocationChange = () => {
      if (user) {
        logNavigation(window.location.pathname, window.location.pathname);
      }
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [user]);
  
  if (loading) {
    return (
      <Div className="flex items-center justify-center h-screen bg-gray-900">
        <Div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></Div>
      </Div>
    );
  }
  
  // For public pages or when user is not logged in
  if (isPublicPage || !user) {
    return (
      <Div className="flex flex-col min-h-screen bg-gray-950">
        <Div className="flex-1">
          <Outlet />
        </Div>
        <Footer />
      </Footer>
    );
  }
  
  // For authenticated app pages
  return (
    <Div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar />
      <Div className="flex-1 flex flex-col overflow-hidden">
        <Header className="h-16 shrink-0 border-b border-gray-800 bg-gray-900">
          <Div className="flex h-full items-center justify-end px-6 gap-4">
            {/* Developer-mode toggle – visible only in dev or admin builds */}
            <Button variant={developerMode ? 'default' : 'outline'}
              size="sm"
              onClick={toggleDeveloperMode}
              className="hidden md:flex"
         >
              {developerMode ? 'Dev-Mode: ON' : 'Dev-Mode: OFF'}
            </Div>
            <NotificationCenter />
            <Button variant="ghost" onClick={logout}>Logout</NotificationCenter>
          </Div>
        </Header>
        <Main className="flex-1 overflow-auto p-6 space-y-6 pb-20 md:pb-6">
          {/* Render system status when admin or developerMode enabled */}
          <SystemStatusPanel />
          <Outlet />
        </Main>
        {/* Add the BottomTabNavigator for mobile view */}
        <BottomTabNavigator /></BottomTabNavigator>
      </Div>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
