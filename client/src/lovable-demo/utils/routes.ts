import { Home, Zap, LineChart, BookOpen, Eye, Wallet, Shield, CreditCard } from "lucide-react";
import Index from "@/pages/Index.tsx";
import JournalPage from "@/pages/Journal.tsx";
import StrategyPage from "@/pages/Strategy.tsx";
import BacktestPage from "@/pages/Backtest.tsx";
import VisionPage from "@/pages/Vision.tsx";
import WalletPage from "@/pages/Wallet.tsx";
import AcademyPage from "@/pages/Academy.tsx";
import AdminPage from "@/pages/Admin.tsx";
import CryptoPaymentPage from "@/pages/CryptoPaymentPage.tsx";

/**
 * Route configuration for the application navigation bar
 */
export const ROUTES = [
  { label: 'Strategy', href: '/strategy' },
  { label: 'Backtest', href: '/backtest' },
  { label: 'Journal', href: '/journal' },
  { label: 'Vision', href: '/vision' },
  { label: 'Academy', href: '/academy' },
  { label: 'Admin', href: '/admin' },
  { label: 'Wallet', href: '/wallet' },
];

/**
 * All application routes including pages without navigation links
 */
export const ALL_ROUTES = [
  {
    path: "/",
    name: "Home",
    component: Index,
    icon: Home,
    auth: false
  },
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
    auth: false
  },
  {
    path: "/vision",
    name: "Vision",
    component: VisionPage,
    icon: Eye,
    auth: false
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
    auth: true
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: WalletPage,
    icon: Wallet,
    auth: false
  },
  {
    path: "/crypto-payment",
    name: "Crypto Payment",
    component: CryptoPaymentPage,
    icon: CreditCard,
    auth: true
  },
];

export default ALL_ROUTES; 