import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
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
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      initJobProcessor();
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <OnboardingProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <MobileAppWrapper>
                <Routes>
                <Route path="/" element={<appLayout/>}>
                  {/* Public Landing Pages */}
                  <Route index element={<LandingPage/>} />
                  <Route path="about" element={<about/>} />
                  <Route path="privacy" element={<privacy/>} />
                  <Route path="terms" element={<Terms/>} />
                  <Route path="pricing" element={<pricing/>} />
                  
                  {/* Auth Pages */}
                  <Route path="auth" element={<authPage/>} />
                  <Route path="register" element={<Register/>} />
                  <Route path="verify" element={<VerifyEmail/>} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<Index/>} />
                  <Route path="/strategy" element={<Strategy/>} />
                  <Route path="/journal" element={<Journal/>} />
                  <Route path="/vision" element={<Vision/>} />
                  <Route path="/academy" element={<academy/>} />
                  <Route path="/wallet" element={<Wallet/>} />
                  <Route path="/admin" element={<admin/>} />
                  <Route path="/profile" element={<profilePage/>} />
                  <Route path="/settings" element={<UserSettings/>} />

                  {/* New AI Trading Setup Routes */}
                  <Route path="/market-setup" element={<MarketSetupPage/>} />
                  <Route path="/setup-finder" element={<SetupFinderPage/>} />
                  <Route path="/best-setups" element={<BestSetupsPage/>} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound/>} />
                </Route>
              </Routes>
              <OnboardingModal />
              <Toaster />
              </MobileAppWrapper>
            </Router>
          </QueryClientProvider>
        </OnboardingProvider>
      </ThemeProvider>
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
