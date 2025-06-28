// Insight Flow AI Trading - Module Index
// Central export hub for all feature pillars

export * from './risk-management';
export * from './advanced-analytics';
export * from './social-gamification';
export * from './extensibility-ecosystem';
export * from './ux-polish-accessibility';

// New feature pillars
export * from './strategy-intelligence';
export { VaultHeatmap } from './strategy-intelligence/vault-heatmap';
export { VaultGrid } from './strategy-intelligence/vault-grid';
export { AIStrategyBuilderV2 } from './strategy-intelligence/ai-strategy-builder-v2';
export * from './strategy-intelligence/types';

// Market Setup
// export * from './market-setup';
export { MarketScanner } from './market-setup/market-scanner';

// Trade Reflection
// export * from './trade-reflection';
export { TradeAnalyzer } from './trade-reflection/trade-analyzer';

// Mindset Journaling
// export * from './mindset-journaling';
export { JournalCompanion } from './mindset-journaling/journal-companion';

// Community Multiplayer
export * from './community-multiplayer';
export { LiveEventRoom } from './community-multiplayer/live-event-room';

// Pro Unlock
export * from './pro-unlock';
export { SubscriptionManager } from './pro-unlock/subscription-manager';

// Learning Engine
export * from './learning-engine';
export { NarratorInjection } from './academy/narrator-injection';
export * from './academy/types';

// Copilot Integration
export * from './copilot-integration';

// Tech Compatibility
export * from './tech-compatibility';

// Extra Features
export * from './extra-features';

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