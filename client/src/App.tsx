import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/core/ErrorBoundary';
import { useAuthMiddleware } from './middleware';
import MobileAppWrapper from './components/mobile/MobileAppWrapper';
import AppLayout from './components/layout/AppLayout';
import './App.css';
import { initJobProcessor } from './lib/background/job-processor';
import { env } from './env';
import { HelmetProvider } from 'react-helmet-async';

// Import pages
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import Strategy from './pages/Strategy';
import Journal from './pages/Journal';
import Vision from './pages/Vision';
import Academy from './pages/Academy';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import AuthPage from './pages/AuthPage';
import UserSettings from './pages/UserSettings';
import ProfilePage from './pages/ProfilePage';

// Import our new AI Strategy pages
import MarketSetupPage from './pages/MarketSetupPage';
import SetupFinderPage from './pages/SetupFinderPage';
import BestSetupsPage from './pages/BestSetupsPage';

const queryClient = new QueryClient();

// Auth middleware wrapper component
const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check authentication on route changes
  useEffect(() => {
    useAuthMiddleware(navigate, location);
  }, [navigate, location]);
  
  return <>{children}</>;
};

function App() {
  // Initialize background jobs
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.MODE === 'production') {
      initJobProcessor();
    }
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <OnboardingProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <MobileAppWrapper>
                  <Routes>
                    {/* Public Landing Pages */}
                    <Route index element={<LandingPage/>} />
                    <Route path="about" element={<About/>} />
                    <Route path="privacy" element={<Privacy/>} />
                    <Route path="terms" element={<Terms/>} />
                    <Route path="pricing" element={<Pricing/>} />
                    
                    {/* Auth Pages */}
                    <Route path="auth" element={<AuthPage/>} />
                    <Route path="register" element={<Register/>} />
                    <Route path="verify" element={<VerifyEmail/>} />

                    {/* Protected Routes - wrapped in layout */}
                    <Route path="/dashboard" element={<AppLayout><Index/></AppLayout>} />
                    <Route path="/strategy" element={<AppLayout><Strategy/></AppLayout>} />
                    <Route path="/journal" element={<AppLayout><Journal/></AppLayout>} />
                    <Route path="/vision" element={<AppLayout><Vision/></AppLayout>} />
                    <Route path="/academy" element={<AppLayout><Academy/></AppLayout>} />
                    <Route path="/wallet" element={<AppLayout><Wallet/></AppLayout>} />
                    <Route path="/admin" element={<AppLayout><Admin/></AppLayout>} />
                    <Route path="/profile" element={<AppLayout><ProfilePage/></AppLayout>} />
                    <Route path="/settings" element={<AppLayout><UserSettings/></AppLayout>} />

                    {/* New AI Trading Setup Routes */}
                    <Route path="/market-setup" element={<AppLayout><MarketSetupPage/></AppLayout>} />
                    <Route path="/setup-finder" element={<AppLayout><SetupFinderPage/></AppLayout>} />
                    <Route path="/best-setups" element={<AppLayout><BestSetupsPage/></AppLayout>} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound/>} />
                  </Routes>
                <OnboardingModal />
                <Toaster />
                </MobileAppWrapper>
              </Router>
            </QueryClientProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
