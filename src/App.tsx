
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Index from './pages/Index';
import Strategy from './pages/Strategy';
import Vision from './pages/Vision';
import Journal from './pages/Journal';
import Academy from './pages/Academy';
import Wallet from './pages/Wallet';
import Backtest from './pages/Backtest';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/core/ProtectedRoute';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute accessLevel="admin" />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route element={<ProtectedRoute accessLevel="pro" />}>
              <Route path="/journal" element={<Journal />} />
              <Route path="/strategy" element={<Strategy />} />
            </Route>
            <Route element={<ProtectedRoute accessLevel="subscribed" />}>
              <Route path="/vision" element={<Vision />} />
              <Route path="/backtest" element={<Backtest />} />
            </Route>

            {/* Public Routes */}
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/academy" element={<Academy />} />
            
            {/* Stubs and Catch-all */}
            <Route path="/support" element={<div className="container mx-auto p-4"><h2>Support Page (Stub)</h2></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
}
