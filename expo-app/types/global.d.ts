// Global type declarations for missing modules

// React Native types
declare module 'react-native' {
  export * from 'react-native';
}

// Expo modules
declare module 'expo-router' {
  export * from 'expo-router';
  export const useRouter: () => any;
  export const useLocalSearchParams: () => any;
  export const Link: any;
  export const Stack: any;
  export const Slot: any;
  export const Tabs: any;
  export const useSegments: () => string[];
}

declare module 'expo-status-bar' {
  export const StatusBar: any;
}

declare module 'expo-constants' {
  const Constants: {
    expoConfig?: {
      extra?: {
        supabaseUrl?: string;
        supabaseAnonKey?: string;
      };
    };
  };
  export default Constants;
}

// UI libraries
declare module 'lucide-react-native' {
  import React from 'react';
  export const ArrowLeft: React.FC<any>;
  export const ArrowRight: React.FC<any>;
  export const ArrowUpRight: React.FC<any>;
  export const ArrowDownRight: React.FC<any>;
  export const ArrowRightLeft: React.FC<any>;
  export const Bell: React.FC<any>;
  export const BookOpen: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const ChevronDown: React.FC<any>;
  export const ChevronUp: React.FC<any>;
  export const ChevronRight: React.FC<any>;
  export const Clock: React.FC<any>;
  export const Copy: React.FC<any>;
  export const CheckCircle: React.FC<any>;
  export const Eye: React.FC<any>;
  export const EyeOff: React.FC<any>;
  export const ExternalLink: React.FC<any>;
  export const Filter: React.FC<any>;
  export const Home: React.FC<any>;
  export const Info: React.FC<any>;
  export const Lightbulb: React.FC<any>; 
  export const LineChart: React.FC<any>;
  export const MessageCircle: React.FC<any>;
  export const Minus: React.FC<any>;
  export const Pencil: React.FC<any>;
  export const Plus: React.FC<any>;
  export const RefreshCw: React.FC<any>;
  export const Search: React.FC<any>;
  export const Send: React.FC<any>;
  export const Settings: React.FC<any>;
  export const Star: React.FC<any>;
  export const Save: React.FC<any>;
  export const Sparkles: React.FC<any>;
  export const Trash: React.FC<any>;
  export const TrendingUp: React.FC<any>;
  export const TrendingDown: React.FC<any>;
  export const X: React.FC<any>;
  export const AlertTriangle: React.FC<any>;
  export const Download: React.FC<any>;
  export const Share2: React.FC<any>;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaView: React.ComponentType<any>;
  export const SafeAreaProvider: React.ComponentType<any>;
}

declare module 'react-native-gesture-handler' {
  export const TouchableOpacity: React.ComponentType<any>;
  export const GestureHandlerRootView: React.ComponentType<any>;
}

declare module 'react-native-webview' {
  export const WebView: React.ComponentType<any>;
}

declare module 'react-native-qrcode-svg' {
  const QRCode: React.ComponentType<any>;
  export default QRCode;
}

declare module '@react-native-community/slider' {
  const Slider: React.ComponentType<any>;
  export default Slider;
}

// Project modules
declare module '@/api/dashboard' {
  export const fetchDashboardData: (userId: string) => Promise<any>;
}

declare module '@/api/strategy' {
  export const fetchUserStrategies: (userId: string) => Promise<any>;
  export const generateStrategyFromPrompt: (prompt: string, userId: string) => Promise<any>;
  export const saveStrategy: (data: any, userId: string) => Promise<any>;
}

declare module '@/api/markets' {
  export const fetchMarketData: (marketType: string) => Promise<any>;
  export const toggleFavorite: (userId: string, symbol: string, isFavorite: boolean) => Promise<any>;
  export const getMarketDetail: (symbol: string) => Promise<any>;
  export const generateMarketSetup: (symbol: string, timeframe: string, userId: string) => Promise<any>;
}

declare module '@/api/journal' {
  export const saveSetupToJournal: (userId: string, symbol: string, timeframe: string, setup: any) => Promise<any>;
}

declare module '@/api/wallet' {
  export const getPaymentDetails: (userId: string, plan: string) => Promise<any>;
  export const verifyTransaction: (userId: string, plan: string, walletAddress: string, txHash: string, currency: string) => Promise<any>;
  export const getExchangeRate: () => Promise<any>;
  export const calculateCryptoAmount: (fiatAmount: number, rate: number, currency: string) => number;
}

declare module '@/store/auth' {
  export const useAuthStore: () => {
    user: any;
    session: any;
    isLoading: boolean;
    ready: boolean;
    error: Error | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, metadata?: any) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    updateProfile: (profile: any) => Promise<void>;
    initialize: () => Promise<void>;
    refreshUser: () => Promise<void>;
  };
}

declare module '@/store/onboarding' {
  export const useOnboardingStore: () => {
    hasSeenWelcome: boolean;
    setHasSeenWelcome: (seen: boolean) => void;
    experienceLevel: string;
    setExperienceLevel: (level: string) => void;
    favoritePairs: string[];
    setFavoritePairs: (pairs: string[]) => void;
    preferredTimeframes: string[];
    setPreferredTimeframes: (timeframes: string[]) => void;
    riskSettings: {
      defaultRiskPercent: number;
      maxRiskPerTrade: number;
    };
    setRiskSettings: (settings: any) => void;
  };
}

declare module '@/hooks/useOnboardingStatus' {
  export const useOnboardingStatus: () => {
    onboardingCompleted: boolean;
    isLoading: boolean;
  };
}

declare module '@/hooks/useColorScheme' {
  export const useColorScheme: () => {
    colorScheme: 'light' | 'dark';
    toggleColorScheme: () => void;
  };
}

declare module '@/contexts/AuthContext' {
  export const AuthProvider: React.FC<{children: React.ReactNode}>;
}

declare module '@/contexts/ThemeContext' {
  export const ThemeProvider: React.FC<{children: React.ReactNode}>;
}

declare module '@/contexts/I18nContext' {
  export const I18nProvider: React.FC<{children: React.ReactNode}>;
}

declare module '@/contexts/QueryClientContext' {
  export const QueryClientProvider: React.FC<{children: React.ReactNode}>;
}

declare module '@/contexts/OnboardingContext' {
  export const OnboardingProvider: React.FC<{children: React.ReactNode}>;
}

declare module '@components/dashboard/DashboardHeader' {
  interface DashboardHeaderProps {
    hasNotifications?: boolean;
  }
  const DashboardHeader: React.FC<DashboardHeaderProps>;
  export default DashboardHeader;
}

declare module '@components/dashboard/PnLSummaryCard' {
  const PnLSummaryCard: React.FC<{data: any}>;
  export default PnLSummaryCard;
}

declare module '@components/dashboard/WatchlistCard' {
  const WatchlistCard: React.FC<{pairs: any[]}>;
  export default WatchlistCard;
}

declare module '@components/dashboard/UpcomingLessonCard' {
  const UpcomingLessonCard: React.FC<{lesson: any}>;
  export default UpcomingLessonCard;
}

declare module '@components/dashboard/StrategyPerformanceCard' {
  const StrategyPerformanceCard: React.FC<{strategies: any[]}>;
  export default StrategyPerformanceCard;
}

declare module '@components/dashboard/AlertsFeedCard' {
  const AlertsFeedCard: React.FC<{alerts: any[]}>;
  export default AlertsFeedCard;
}

declare module '@components/dashboard/MarketSetupCard' {
  const MarketSetupCard: React.FC<{setup: any}>;
  export default MarketSetupCard;
}

declare module '@components/strategy/StrategyCard' {
  const StrategyCard: React.FC<{strategy: any, onPress: () => void}>;
  export default StrategyCard;
}

declare module '@components/strategy/StrategyParameters' {
  const StrategyParameters: React.FC<{parameters: any[], onChange: (index: number, value: any) => void}>;
  export default StrategyParameters;
}

declare module '@components/markets/TimeframeSelector' {
  const TimeframeSelector: React.FC<{
    timeframes: string[],
    selectedTimeframe: string,
    onSelectTimeframe: (timeframe: string) => void
  }>;
  export default TimeframeSelector;
}

declare module '@components/markets/PriceInfoCard' {
  const PriceInfoCard: React.FC<{marketData: any}>;
  export default PriceInfoCard;
}

declare module '@components/markets/SetupCard' {
  const SetupCard: React.FC<{
    setupData: any,
    symbol: string,
    timeframe: string,
    onSaveToJournal: () => void,
    isSaving: boolean
  }>;
  export default SetupCard;
}

declare module '@components/wallet/CountdownTimer' {
  const CountdownTimer: React.FC<{
    initialTime: number,
    onFinish: () => void,
    onTick?: (secondsLeft: number) => void
  }>;
  export default CountdownTimer;
}

declare module '@components/navigation/BottomTabNavigator' {
  export const BottomTabNavigator: React.FC;
} 