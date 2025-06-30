import { Home, Zap, LineChart, BookOpen, Eye, Wallet, Shield, Info, CreditCard, FileText, Lock, Download as DownloadIcon } from "lucide-react";
import Index from "@/pages/Index.tsx";
import JournalPage from "@/pages/Journal.tsx";
import StrategyPage from "@/pages/Strategy.tsx";
import BacktestPage from "@/pages/Backtest.tsx";
import VisionPage from "@/pages/Vision.tsx";
import WalletPage from "@/pages/Wallet.tsx";
import AcademyPage from "@/pages/Academy.tsx";
import AdminPage from "@/pages/Admin.tsx";
import AboutPage from "@/pages/About.tsx";
import PricingPage from "@/pages/Pricing.tsx";
import TermsPage from "@/pages/Terms.tsx";
import PrivacyPage from "@/pages/Privacy.tsx";
import DownloadPage from "@/pages/DownloadApp.tsx";
import About from "@/pages/About";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import Journal from "@/pages/Journal";
import NotFoundPage from "@/pages/NotFoundPage";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Settings from "@/pages/UserSettings";
import Strategy from "@/pages/Strategy";
import VerifyEmail from "@/pages/VerifyEmail";
import CryptoPaymentPage from "@/pages/CryptoPaymentPage";

/**
 * Route configuration for the main application navigation bar
 */
export const ROUTES = [
  { label: 'Strategy', href: '/strategy' },
  { label: 'Backtest', href: '/backtest' },
  { label: 'Journal', href: '/journal' },
  { label: 'Vision', href: '/vision' },
  { label: 'Academy', href: '/academy' },
  { label: 'Wallet', href: '/wallet' },
  { label: 'Admin', href: '/admin', adminOnly: true },
];

/**
 * Public routes for footer navigation
 */
export const PUBLIC_ROUTES = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Download', href: '/download' },
];

/**
 * All application routes including pages without navigation links
 */
export const ALL_ROUTES = [
  // Public landing pages
  {
    path: "/",
    name: "Home",
    component: Index,
    icon: Home,
    auth: false
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
    icon: Info,
    auth: false
  },
  {
    path: "/pricing",
    name: "Pricing",
    component: PricingPage,
    icon: CreditCard,
    auth: false
  },
  {
    path: "/terms",
    name: "Terms",
    component: TermsPage,
    icon: FileText,
    auth: false
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: PrivacyPage,
    icon: Lock,
    auth: false
  },
  {
    path: "/download",
    name: "Download",
    component: DownloadPage,
    icon: DownloadIcon,
    auth: false
  },
  
  // Main authenticated features
  {
    path: "/strategy",
    name: "Strategy",
    component: StrategyPage,
    icon: Zap,
    auth: false
  },
  {
    path: "/backtest",
    name: "Backtest",
    component: BacktestPage,
    icon: LineChart,
    auth: false
  },
  {
    path: "/journal",
    name: "Journal",
    component: JournalPage,
    icon: BookOpen,
    auth: true
  },
  {
    path: "/vision",
    name: "Vision",
    component: VisionPage,
    icon: Eye,
    auth: true
  },
  {
    path: "/academy",
    name: "Academy",
    component: AcademyPage,
    icon: BookOpen,
    auth: false
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    icon: Shield,
    auth: true,
    adminOnly: true
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: WalletPage,
    icon: Wallet,
    auth: true
  },
];

/**
 * Define application routes with authorization control
 * @remarks
 * Routes with auth: true require authentication
 * Routes with auth: false are accessible without authentication
 */
export const routes = {
  // ... existing routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  STRATEGY_BUILDER: "/strategy-builder",
  BACKTEST: "/backtest",
  JOURNAL: "/journal",
  ANALYTICS: "/analytics",
  COMMUNITY: "/community",
  ACADEMY: "/academy",
  
  // New AI Trading Setup Routes
  MARKET_SETUP: "/market-setup",
  SETUP_FINDER: "/setup-finder",
  BEST_SETUPS: "/best-setups",
};

export default ALL_ROUTES; 