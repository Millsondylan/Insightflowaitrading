import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LineChart, BookOpen, BarChart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface TabItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth: boolean;
}

export default function BottomTabNavigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('common');
  
  const tabs: TabItem[] = [
    {
      key: 'home',
      label: t('nav.home'),
      path: '/',
      icon: <Home size={24}/>,
      requiresAuth: false,
    },
    {
      key: 'strategy',
      label: t('nav.strategy'),
      path: '/strategy',
      icon: <lineChart size={24}/>,
      requiresAuth: true,
    },
    {
      key: 'journal',
      label: t('nav.journal'),
      path: '/journal',
      icon: <BookOpen size={24}/>,
      requiresAuth: true,
    },
    {
      key: 'markets',
      label: t('nav.markets'),
      path: '/markets',
      icon: <BarChart size={24}/>,
      requiresAuth: false,
    },
    {
      key: 'settings',
      label: t('nav.settings'),
      path: '/profile',
      icon: <Settings size={24}/>,
      requiresAuth: true,
    },
  ];

  // Navigation handler
  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Check if a tab is active
  const isActive = (path: string) => {
    // Match root paths or first level paths
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="flex justify-around items-center h-16 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800 px-2">
        {tabs.map((tab) => (
          <Button             key={tab.key}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full transition-colors',
              isActive(tab.path) 
                ? 'text-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            )}
            onClick={() => navigateTo(tab.path)}
          >
            <div className="relative">
              {tab.icon}
              {isActive(tab.path) && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"/>
              )}
            </Home>
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Safe area inset for iOS devices */}
      <div className="h-6 bg-gray-900 md:hidden"/>
    </div>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 