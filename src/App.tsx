import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/core/ErrorBoundary';
import LoadingSpinner from './components/ui/loading-spinner';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Landing = React.lazy(() => import('./pages/Landing'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Strategy = React.lazy(() => import('./pages/Strategy'));
const Academy = React.lazy(() => import('./pages/Academy'));
const Journal = React.lazy(() => import('./pages/Journal'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Community = React.lazy(() => import('./pages/Community'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth/*" element={<Auth />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/strategy/*" element={<Strategy />} />
                <Route path="/academy/*" element={<Academy />} />
                <Route path="/journal/*" element={<Journal />} />
                <Route path="/portfolio/*" element={<Portfolio />} />
                <Route path="/community/*" element={<Community />} />
                <Route path="/settings/*" element={<Settings />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            
            {/* Global toast notifications */}
            <Toaster 
              position="top-right" 
              richColors 
              closeButton 
              duration={4000}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

// Add Lovable.dev compatibility
export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true,
  entryPoint: true
}; 