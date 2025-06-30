// Insight Flow AI Trading - Module Index
// Central export hub for all feature pillars

// Core modules
export { 
  MonteCarloSimulator,
  AltDataOverlayService,
  CorrelationMatrixService
} from './advanced-analytics';

export type { 
  RiskProfile,
  RiskAlert,
  RiskMetric
} from './risk-management';

export type { 
  AccessibilitySettings,
  ThemeCustomization,
  UserPreference
} from './ux-polish-accessibility';

export type { 
  StrategyAnalysis,
  PerformanceMetrics as StrategyPerformanceMetrics,
  RiskMetrics as StrategyRiskMetrics,
  Recommendation
} from './strategy-intelligence';

// Social and community
export type { 
  LeaderboardEntry,
  Achievement as SocialAchievement,
  Challenge
} from './social-gamification';

export type { 
  Participant,
  LiveEvent,
  ChatMessage
} from './community-multiplayer';

// Pro features
export type { 
  ProFeature,
  UnlockCode,
  UserUnlock
} from './pro-unlock';

// Learning and academy
export type { 
  LearningProgress,
  LearningRecommendation
} from './learning-engine';

export type { 
  LessonProgress,
  Achievement as AcademyAchievement
} from './academy/types';

// Market and trading
export type { 
  MarketSetup,
  SetupCondition,
  SetupAlert
} from './market-setup';

// Journaling and reflection
export type { 
  JournalEntry,
  JournalPrompt,
  MoodTrend
} from './mindset-journaling';

export type { 
  TradeReflection,
  ReflectionPrompt,
  ReflectionInsight
} from './trade-reflection';

// Tech and compatibility
export type { 
  PlatformCompatibility,
  IntegrationStatus,
  SystemRequirement
} from './tech-compatibility';

// Extra features
export type { 
  Feature,
  FeatureToggle,
  FeatureUsage
} from './extra-features';

// Copilot integration
export type { 
  CopilotContext,
  CopilotSuggestion,
  CopilotResponse
} from './copilot-integration';

// Specific component exports
export { VaultHeatmap } from './strategy-intelligence/vault-heatmap';
export { VaultGrid } from './strategy-intelligence/vault-grid';
export { AIStrategyBuilderV2 } from './strategy-intelligence/ai-strategy-builder-v2';
export { MarketScanner } from './market-setup/market-scanner';
export { TradeAnalyzer } from './trade-reflection/trade-analyzer';
export { JournalCompanion } from './mindset-journaling/journal-companion';
export { LiveEventRoom } from './community-multiplayer/live-event-room';
export { SubscriptionManager } from './pro-unlock/subscription-manager';
export { NarratorInjection } from './academy/narrator-injection';

// Module registry for dynamic loading
export const MODULES = {
  riskManagement: () => import('./risk-management'),
  advancedAnalytics: () => import('./advanced-analytics'),
  socialGamification: () => import('./social-gamification'),
  extensibilityEcosystem: () => import('./extensibility-ecosystem'),
  uxPolishAccessibility: () => import('./ux-polish-accessibility'),
  
  strategyIntelligence: () => import('./strategy-intelligence'),
  marketSetup: () => import('./market-setup'),
  tradeReflection: () => import('./trade-reflection'),
  mindsetJournaling: () => import('./mindset-journaling'),
  communityMultiplayer: () => import('./community-multiplayer'),
  proUnlock: () => import('./pro-unlock'),
  learningEngine: () => import('./learning-engine'),
  copilotIntegration: () => import('./copilot-integration'),
  techCompatibility: () => import('./tech-compatibility'),
  extraFeatures: () => import('./extra-features')
} as const;

export type ModuleKeys = keyof typeof MODULES;

// Register all modules
export const modules = [
  'strategy-intelligence',
  'market-setup',
  'trade-reflection',
  'mindset-journaling',
  'community-multiplayer',
  'pro-unlock',
  'learning-engine',
  'copilot-integration',
  'tech-compatibility',
  'extra-features'
];

// Module metadata
export const moduleMetadata = {
  'strategy-intelligence': {
    name: 'Strategy Intelligence Engine',
    description: 'AI-powered strategy creation, optimization, and management',
    icon: 'Brain'
  },
  'market-setup': {
    name: 'Market Setup',
    description: 'Market analysis, scanning, and opportunity detection',
    icon: 'LineChart'
  },
  'trade-reflection': {
    name: 'Trade Reflection',
    description: 'Post-trade analysis, journaling, and improvement',
    icon: 'Lightbulb'
  },
  'mindset-journaling': {
    name: 'Mindset Journaling',
    description: 'Emotional intelligence and psychological trading tools',
    icon: 'Heart'
  },
  'community-multiplayer': {
    name: 'Community & Multiplayer',
    description: 'Social trading, collaboration, and knowledge sharing',
    icon: 'Users'
  },
  'pro-unlock': {
    name: 'Pro Unlock',
    description: 'Premium features, subscription management, and monetization',
    icon: 'Star'
  },
  'learning-engine': {
    name: 'Learning Engine',
    description: 'Educational content, adaptive learning, and skill development',
    icon: 'GraduationCap'
  },
  'copilot-integration': {
    name: 'Copilot Integration',
    description: 'AI assistant for strategy building and market analysis',
    icon: 'Bot'
  },
  'tech-compatibility': {
    name: 'Tech Compatibility',
    description: 'System integration, API connections, and platform compatibility',
    icon: 'Code'
  },
  'extra-features': {
    name: 'Extra Features',
    description: 'Additional tools and utilities for advanced trading',
    icon: 'Plus'
  }
}; 