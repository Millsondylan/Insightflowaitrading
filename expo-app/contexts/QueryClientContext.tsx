import React from 'react';
import { QueryClient, QueryClientProvider as RQQueryClientProvider } from '@tanstack/react-query';
import { onlineManager, focusManager } from '@tanstack/react-query';
import { Platform, AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useAppState } from '@/hooks/useAppState';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

// Set up and provide React Query context
export const QueryClientProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Set up online/offline detection for React Query
  useOnlineManager();
  
  // Set up app state for React Query focus management
  useAppState();
  
  return (
    <RQQueryClientProvider client={queryClient}>
      {children}
    </RQQueryClientProvider>
  );
}; 