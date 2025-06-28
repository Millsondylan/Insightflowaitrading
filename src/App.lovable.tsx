import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/futuristic-theme.css';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import Strategy from './pages/Strategy';
import StrategyCopilot from './pages/StrategyCopilot';
import StrategyExport from './pages/StrategyExport';
import Vision from './pages/Vision';
import Journal from './pages/Journal';
import Academy from './pages/Academy';
import Wallet from './pages/Wallet';
// import Backtest from './pages/Backtest';
import BacktestReplay from './pages/BacktestReplay';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// New themed builder pages
import LandingBuilder from './pages/LandingBuilder';
import StrategyBuilder from './pages/StrategyBuilder';
import JournalBuilder from './pages/JournalBuilder';
import AcademyBuilder from './pages/AcademyBuilder';

// New themed pages
import Markets from './pages/Markets';
import Portfolio from './pages/Portfolio';
import ProfileRiskMap from './pages/ProfileRiskMap';
import Community from './pages/Community';
import VaultPage from './pages/VaultHeatmap';
import VaultDetailPage from './pages/VaultDetailPage';
import ReplayPage from './pages/ReplayPage';
import Digest from './pages/Digest';
import Demo from './pages/Demo';
import Notifications from './pages/Notifications';
import SettingsNotifications from './pages/SettingsNotifications';
import Help from './pages/Help';
import FAQ from './pages/FAQ';
import Docs from './pages/Docs';
import Chat from './pages/Chat';
import PlannerPage from './pages/PlannerPage';
import CoachPage from './pages/CoachPage';
import FeedPage from './pages/FeedPage';
import BroadcastPage from './pages/BroadcastPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { ProtectedRoute as OldProtectedRoute } from './components/core/ProtectedRoute';

const queryClient = new QueryClient();

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Strategy Routes */}
              <Route path="/strategy/copilot" element={<StrategyCopilot />} />
              <Route path="/strategy/export" element={<StrategyExport />} />

              {/* Backtest Routes */}
              <Route path="/backtest/replay" element={<BacktestReplay />} />

              {/* Profile Routes */}
              <Route path="/profile/risk-map" element={<ProfileRiskMap />} />

              {/* Protected Routes */}
              <Route path="/vault" element={<ProtectedRoute><VaultPage /></ProtectedRoute>} />
              <Route path="/vault/:id" element={<ProtectedRoute><VaultDetailPage /></ProtectedRoute>} />
              <Route path="/replay/:id" element={<ProtectedRoute><ReplayPage /></ProtectedRoute>} />
              <Route path="/planner" element={<ProtectedRoute><PlannerPage /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/coach" element={<ProtectedRoute><CoachPage /></ProtectedRoute>} />
              <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
              <Route path="/broadcast" element={<ProtectedRoute><BroadcastPage /></ProtectedRoute>} />

              {/* New Themed Builder Routes */}
              <Route path="/landing" element={<LandingBuilder />} />
              <Route path="/strategy-builder" element={<StrategyBuilder />} />
              <Route path="/journal-builder" element={<JournalBuilder />} />
              <Route path="/academy-builder" element={<AcademyBuilder />} />

              {/* New Themed Pages */}
              <Route path="/markets" element={<Markets />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/community" element={<Community />} />
              <Route path="/digest" element={<Digest />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/help" element={<Help />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/README.md" element={<Docs />} />
              <Route path="/chat" element={<Chat />} />

              {/* Admin Routes */}
              <Route element={<OldProtectedRoute accessLevel="admin" />}>
                <Route path="/admin" element={<Admin />} />
              </Route>

              {/* Pro Routes */}
              <Route element={<OldProtectedRoute accessLevel="pro" />}>
                <Route path="/strategy" element={<Strategy />} />
              </Route>

              {/* Subscribed Routes */}
              <Route element={<OldProtectedRoute accessLevel="subscribed" />}>
                <Route path="/vision" element={<Vision />} />
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
    </ThemeProvider>
  );
}
