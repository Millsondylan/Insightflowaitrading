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
    <themeprovider  >
      <queryclientprovider  >
        <router  >
          <applayout  >
            <routes  >
              <route path="/" >} />
              <route path="/auth" >} />

              {/* Strategy Routes */}
              <route path="/strategy/copilot" >} />
              <route path="/strategy/export" >} />

              {/* Backtest Routes */}
              <route path="/backtest/replay" >} />

              {/* Profile Routes */}
              <route path="/profile/risk-map" >} />

              {/* Protected Routes */}
              <route path="/vault" ><vaultpage  ></ProtectedRoute>} />
              <route path="/vault/:id" ><vaultdetailpage  ></ProtectedRoute>} />
              <route path="/replay/:id" ><replaypage  ></ProtectedRoute>} />
              <route path="/planner" ><plannerpage  ></ProtectedRoute>} />
              <route path="/journal" ><journal  ></ProtectedRoute>} />
              <route path="/coach" ><coachpage  ></ProtectedRoute>} />
              <route path="/feed" ><feedpage  ></ProtectedRoute>} />
              <route path="/broadcast" ><broadcastpage  ></ProtectedRoute>} />

              {/* New Themed Builder Routes */}
              <route path="/landing" >} />
              <route path="/strategy-builder" >} />
              <route path="/journal-builder" >} />
              <route path="/academy-builder" >} />

              {/* Lovable Routes */}
              <route path="/lovable/editor" >} />
              <route path="/lovable/demo" >} />

              {/* Legacy Routes */}
              <route path="/legacy" accessLevel="subscribed" ><index  ></OldProtectedRoute>} />
              <route path="/legacy/strategy" accessLevel="pro" ><strategy  ></OldProtectedRoute>} />
              <route path="/legacy/vision" accessLevel="subscribed" ><vision  ></OldProtectedRoute>} />
              <route path="/legacy/academy" accessLevel="subscribed" ><academy  ></OldProtectedRoute>} />
              <route path="/legacy/wallet" accessLevel="subscribed" ><wallet  ></OldProtectedRoute>} />
              <route path="/legacy/admin" accessLevel="admin" ><admin  ></OldProtectedRoute>} />

              {/* Public Routes */}
              <route path="/markets" >} />
              <route path="/portfolio" >} />
              <route path="/community" >} />
              <route path="/digest" >} />
              <route path="/demo" >} />
              <route path="/notifications" >} />
              <route path="/settings/notifications" >} />
              <route path="/help" >} />
              <route path="/faq" >} />
              <route path="/docs" >} />
              <route path="/chat" >} />

              {/* 404 Route */}
              <route path="*" >} />
            </Routes>
          </AppLayout>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export const lovable = { component: true };
