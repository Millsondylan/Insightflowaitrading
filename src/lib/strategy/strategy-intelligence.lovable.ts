import {
  createStrategy,
  updateStrategy,
  getStrategy,
  publishStrategy,
  compareVersions,
  type StrategyType,
  type StrategyInput,
  type StrategyRule,
  type ChecklistItem,
  type StrategyPerformance,
  type StrategyVersion,
  type Strategy
} from './strategy-intelligence';

export {
  createStrategy,
  updateStrategy,
  getStrategy,
  publishStrategy,
  compareVersions,
  type StrategyType,
  type StrategyInput,
  type StrategyRule,
  type ChecklistItem,
  type StrategyPerformance,
  type StrategyVersion,
  type Strategy
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['trading_strategies', 'strategy_versions', 'audit_logs'],
  aiBlocks: ['strategyIntelligence'],
  functions: [
    'generateStrategy',
    'optimizeStrategy',
    'saveStrategy',
    'getStrategies',
    'getStrategyVersions',
    'publishStrategy',
    'generateHeatmap',
    'filterStrategies',
    'getStrategyDetails',
    'compareVersions',
    'detect-missing-logic'
  ]
}; 