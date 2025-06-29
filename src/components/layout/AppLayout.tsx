import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import NotificationCenter from '@/components/core/NotificationCenter';
import { initializeSession, useAuditLog } from '@/lib/monitoring/auditLogger';
import { SystemStatusPanel } from '@/components/core/SystemStatusPanel';
import { useDeveloperMode } from '@/hooks/use-developer-mode';

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  const { logNavigation } = useAuditLog();
  const { developerMode, toggleDeveloperMode } = useDeveloperMode();

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
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Outlet />;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 shrink-0 border-b border-gray-800 bg-gray-900">
          <div className="flex h-full items-center justify-end px-6 gap-4">
            {/* Developer-mode toggle – visible only in dev or admin builds */}
            <Button
              variant={developerMode ? 'default' : 'outline'}
              size="sm"
              onClick={toggleDeveloperMode}
            >
              {developerMode ? 'Dev-Mode: ON' : 'Dev-Mode: OFF'}
            </Button>
            <NotificationCenter />
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Render system status when admin or developerMode enabled */}
          <SystemStatusPanel />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
