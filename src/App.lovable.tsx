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
    <themeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <appLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<authPage />} />

              {/* Strategy Routes */}
              <Route path="/strategy/copilot" element={<StrategyCopilot />} />
              <Route path="/strategy/export" element={<StrategyExport />} />

              {/* Backtest Routes */}
              <Route path="/backtest/replay" element={<backtestReplay />} />

              {/* Profile Routes */}
              <Route path="/profile/risk-map" element={<profileRiskMap />} />

              {/* Protected Routes */}
              <Route path="/vault" element={<protectedRoute><VaultPage /></ProtectedRoute>} />
              <Route path="/vault/:id" element={<protectedRoute><VaultDetailPage /></ProtectedRoute>} />
              <Route path="/replay/:id" element={<protectedRoute><ReplayPage /></ProtectedRoute>} />
              <Route path="/planner" element={<protectedRoute><plannerPage /></ProtectedRoute>} />
              <Route path="/journal" element={<protectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/coach" element={<protectedRoute><CoachPage /></ProtectedRoute>} />
              <Route path="/feed" element={<protectedRoute><FeedPage /></ProtectedRoute>} />
              <Route path="/broadcast" element={<protectedRoute><broadcastPage /></ProtectedRoute>} />

              {/* New Themed Builder Routes */}
              <Route path="/landing" element={<LandingBuilder />} />
              <Route path="/strategy-builder" element={<StrategyBuilder />} />
              <Route path="/journal-builder" element={<JournalBuilder />} />
              <Route path="/academy-builder" element={<academyBuilder />} />

              {/* Lovable Routes */}
              <Route path="/lovable/editor" element={<LovableEditorPage />} />
              <Route path="/lovable/demo" element={<Demo />} />

              {/* Legacy Routes */}
              <Route path="/legacy" element={<oldProtectedRoute accessLevel="subscribed"><index /></OldProtectedRoute>} />
              <Route path="/legacy/strategy" element={<oldProtectedRoute accessLevel="pro"><Strategy /></OldProtectedRoute>} />
              <Route path="/legacy/vision" element={<oldProtectedRoute accessLevel="subscribed"><Vision /></OldProtectedRoute>} />
              <Route path="/legacy/academy" element={<oldProtectedRoute accessLevel="subscribed"><academy /></OldProtectedRoute>} />
              <Route path="/legacy/wallet" element={<oldProtectedRoute accessLevel="subscribed"><Wallet /></OldProtectedRoute>} />
              <Route path="/legacy/admin" element={<oldProtectedRoute accessLevel="admin"><admin /></OldProtectedRoute>} />

              {/* Public Routes */}
              <Route path="/markets" element={<markets />} />
              <Route path="/portfolio" element={<portfolio />} />
              <Route path="/community" element={<Community />} />
              <Route path="/digest" element={<Digest />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings/notifications" element={<SettingsNotifications />} />
              <Route path="/help" element={<Help />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/chat" element={<Chat />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
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
