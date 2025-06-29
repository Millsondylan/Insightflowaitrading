import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useDeveloperMode } from '@/hooks/use-developer-mode';
import { Button } from '@/components/ui/button';
// import NotificationCenter from '@/components/core/NotificationCenter';
import BottomTabNavigator from '@/components/mobile/BottomTabNavigator';
// import { Div } from '@/components/ui/div';
import Footer from './Footer';
// import Header from './Header';
// import Main from './Main';
// import Sidebar from './Sidebar';
// import { useMediaQuery } from '@/hooks/use-media-query';
import { auditLogger } from '@/lib/monitoring/auditLogger';
import { SystemStatusPanel } from '@/components/core/SystemStatusPanel';

interface AppLayoutProps {
  children?: React.ReactNode;
}

/**
 * Main layout component that wraps the entire application
 * Includes common elements like header, sidebar, and footer
 */
const AppLayout: React.FC<AppLayoutProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { developerMode, toggleDeveloperMode } = useDeveloperMode();
  // const isMobile = useMediaQuery('(max-width: 768px)');
  const isMobile = false; // Hardcode for now

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Log navigation events
    const lastPath = sessionStorage.getItem('lastPath') || '/';
    const currentPath = location.pathname;
    
    if (lastPath !== currentPath) {
      auditLogger.logNavigation(lastPath, currentPath);
      sessionStorage.setItem('lastPath', currentPath);
    }
  }, [location]);

  // Show minimalist layout for special pages
  if (location.pathname.includes('/auth/') || location.pathname.includes('/landing')) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <Button 
            variant="ghost"
            className="mr-2 md:hidden"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="sr-only">Toggle Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
          
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleDeveloperMode}>
              {developerMode ? 'Dev-Mode: ON' : 'Dev-Mode: OFF'}
            </Button>
            {/* <NotificationCenter /> */}
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* {sidebarOpen && <Sidebar className="hidden md:block" />} */}
        <main className="flex-1">
          <Outlet />
        </main>
        {/* Add the BottomTabNavigator for mobile view */}
        {isMobile && <BottomTabNavigator />}
      </div>
      
      {/* Developer Mode System Status Panel */}
      {developerMode && <SystemStatusPanel />}
    </div>
  );
};

export default AppLayout;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
