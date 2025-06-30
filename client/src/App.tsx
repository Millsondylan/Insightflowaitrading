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
import OnboardingMiddleware from './components/auth/OnboardingMiddleware';
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
import Dashboard from './pages/Dashboard';
import OnboardingPage from './pages/OnboardingPage';
import MarketsPage from './pages/MarketsPage';

// Import our new AI Strategy pages
import MarketSetupPage from './pages/MarketSetupPage';
import SetupFinderPage from './pages/SetupFinderPage';
import BestSetupsPage from './pages/BestSetupsPage';
import StrategyBuilderV3 from './pages/StrategyBuilderV3';
import JournalV2 from './pages/JournalV2';
import ChatPage from './pages/ChatPage';
import PortfolioV2 from './pages/PortfolioV2';
import AcademyV2 from './pages/AcademyV2';
import IntegrationsPage from './pages/IntegrationsPage';
import AdvancedFeaturesPage from './pages/AdvancedFeaturesPage';

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
                  <OnboardingMiddleware>
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

                      {/* Onboarding Route */}
                      <Route path="/onboarding" element={<OnboardingPage/>} />

                      {/* Protected Routes - wrapped in layout */}
                      <Route path="/dashboard" element={
                        <AppLayout>
                          <Dashboard/>
                        </AppLayout>
                      } />
                      <Route path="strategy" element={
                        <AppLayout>
                          <StrategyBuilderV3/>
                        </AppLayout>
                      } />
                      <Route path="strategy-builder" element={
                        <AppLayout>
                          <StrategyBuilderV3/>
                        </AppLayout>
                      } />
                      <Route path="journal" element={
                        <AppLayout>
                          <JournalV2/>
                        </AppLayout>
                      } />
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

                      {/* Markets Route */}
                      <Route path="markets" element={
                        <AppLayout>
                          <MarketsPage/>
                        </AppLayout>
                      } />
                      <Route path="markets/:symbol" element={
                        <AppLayout>
                          <MarketsPage/>
                        </AppLayout>
                      } />

                      {/* Chat Page */}
                      <Route path="chat" element={
                        <AppLayout>
                          <ChatPage/>
                        </AppLayout>
                      } />
                      <Route path="voice" element={
                        <AppLayout>
                          <ChatPage/>
                        </AppLayout>
                      } />

                      {/* PortfolioV2 Route */}
                      <Route path="portfolio" element={
                        <AppLayout>
                          <PortfolioV2/>
                        </AppLayout>
                      } />

                      {/* AcademyV2 Route */}
                      <Route path="academy" element={
                        <AppLayout>
                          <AcademyV2/>
                        </AppLayout>
                      } />

                      {/* Integrations Page */}
                      <Route path="integrations" element={
                        <AppLayout>
                          <IntegrationsPage/>
                        </AppLayout>
                      } />

                      {/* Advanced Features Page */}
                      <Route path="advanced" element={
                        <AppLayout>
                          <AdvancedFeaturesPage/>
                        </AppLayout>
                      } />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound/>} />
                    </Routes>
                  </OnboardingMiddleware>
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
