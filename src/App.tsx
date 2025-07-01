import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './hooks/use-auth.tsx';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { Toaster } from './components/ui/toaster';
import { Loader2 } from 'lucide-react';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/core/ProtectedRoute';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/AuthPage'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Markets = lazy(() => import('./pages/Markets'));
const StrategyBuilder = lazy(() => import('./pages/StrategyBuilderV3'));
const Backtest = lazy(() => import('./pages/BacktestReplay'));
const Journal = lazy(() => import('./pages/JournalV2'));
const Academy = lazy(() => import('./pages/Academy'));
const Chat = lazy(() => import('./pages/ChatPage'));
const Voice = lazy(() => import('./pages/VoiceRoomPage'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/UserSettings'));
const Admin = lazy(() => import('./pages/Admin'));
const Billing = lazy(() => import('./pages/BillingPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const MarketDetail = lazy(() => import('./pages/MarketDetailPage'));
const StrategyDetail = lazy(() => import('./pages/StrategyDetailPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const Wallet = lazy(() => import('./pages/Wallet'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <OnboardingProvider>
            <Router>
              <div className="min-h-screen">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes with layout */}
                    <Route element={<ProtectedRoute />}>
                      <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/onboarding" element={<OnboardingPage />} />
                        <Route path="/markets" element={<Markets />} />
                        <Route path="/markets/:symbol" element={<MarketDetail />} />
                        <Route path="/strategy-builder" element={<StrategyBuilder />} />
                        <Route path="/strategy/:id" element={<StrategyDetail />} />
                        <Route path="/backtest" element={<Backtest />} />
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/academy" element={<Academy />} />
                        <Route path="/academy/lesson/:id" element={<LessonPage />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/voice" element={<Voice />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="/wallet" element={<Wallet />} />
                      </Route>
                    </Route>
                    
                    {/* Admin routes */}
                    <Route element={<ProtectedRoute requireAdmin />}>
                      <Route element={<AppLayout />}>
                        <Route path="/admin" element={<Admin />} />
                      </Route>
                    </Route>
                    
                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
            <Toaster />
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
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
