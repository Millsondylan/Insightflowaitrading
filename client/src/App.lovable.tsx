import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/futuristic-theme.css';
import './styles/lovable.css';
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

// Lovable pages
import LovableEditorPage from './pages/LovableEditor.lovable';

import { ProtectedRoute as OldProtectedRoute } from './components/core/ProtectedRoute';

const queryClient = new QueryClient();

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<LandingPage/>} />
              <Route path="/auth" element={<AuthPage/>} />

              {/* Strategy Routes */}
              <Route path="/strategy/copilot" element={<StrategyCopilot/>} />
              <Route path="/strategy/export" element={<StrategyExport/>} />

              {/* Backtest Routes */}
              <Route path="/backtest/replay" element={<BacktestReplay/>} />

              {/* Profile Routes */}
              <Route path="/profile/risk-map" element={<ProfileRiskMap/>} />

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
              <Route path="/landing" element={<LandingBuilder/>} />
              <Route path="/strategy-builder" element={<StrategyBuilder/>} />
              <Route path="/journal-builder" element={<JournalBuilder/>} />
              <Route path="/academy-builder" element={<AcademyBuilder/>} />

              {/* Lovable Routes */}
              <Route path="/lovable/editor" element={<LovableEditorPage/>} />
              <Route path="/lovable/demo" element={<Demo/>} />

              {/* Legacy Routes */}
              <Route path="/legacy" element={<OldProtectedRoute accessLevel="subscribed"><Index /></OldProtectedRoute>} />
              <Route path="/legacy/strategy" element={<OldProtectedRoute accessLevel="pro"><Strategy /></OldProtectedRoute>} />
              <Route path="/legacy/vision" element={<OldProtectedRoute accessLevel="subscribed"><Vision /></OldProtectedRoute>} />
              <Route path="/legacy/academy" element={<OldProtectedRoute accessLevel="subscribed"><Academy /></OldProtectedRoute>} />
              <Route path="/legacy/wallet" element={<OldProtectedRoute accessLevel="subscribed"><Wallet /></OldProtectedRoute>} />
              <Route path="/legacy/admin" element={<OldProtectedRoute accessLevel="admin"><Admin /></OldProtectedRoute>} />

              {/* Public Routes */}
              <Route path="/markets" element={<Markets/>} />
              <Route path="/portfolio" element={<Portfolio/>} />
              <Route path="/community" element={<Community/>} />
              <Route path="/digest" element={<Digest/>} />
              <Route path="/demo" element={<Demo/>} />
              <Route path="/notifications" element={<Notifications/>} />
              <Route path="/settings/notifications" element={<SettingsNotifications/>} />
              <Route path="/help" element={<Help/>} />
              <Route path="/faq" element={<FAQ/>} />
              <Route path="/docs" element={<Docs/>} />
              <Route path="/chat" element={<Chat/>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </AppLayout>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
