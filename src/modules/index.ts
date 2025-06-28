// Insight Flow AI Trading - Module Index
// Central export hub for all feature pillars

export * from './risk-management';
export * from './advanced-analytics';
export * from './social-gamification';
export * from './extensibility-ecosystem';
export * from './ux-polish-accessibility';

// Module registry for dynamic loading
export const MODULES = {
  riskManagement: () => import('./risk-management'),
  advancedAnalytics: () => import('./advanced-analytics'),
  socialGamification: () => import('./social-gamification'),
  extensibilityEcosystem: () => import('./extensibility-ecosystem'),
  uxPolishAccessibility: () => import('./ux-polish-accessibility'),
} as const;

export type ModuleKeys = keyof typeof MODULES; 