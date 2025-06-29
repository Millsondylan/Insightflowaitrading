import {
  generateCorrelationMatrix,
  getCorrelationColorPalette,
  getCorrelationColor,
  saveCorrelationSettings,
  getCorrelationSettings,
  createCorrelationAlert,
  isFavoritePair,
  toggleFavoritePair,
  type AssetPair,
  type CorrelationTimePeriod,
  type ColorPaletteTheme,
  type CorrelationMatrix,
  type CorrelationSettings,
  type CorrelationAlert
} from './market-correlation';

export {
  generateCorrelationMatrix,
  getCorrelationColorPalette,
  getCorrelationColor,
  saveCorrelationSettings,
  getCorrelationSettings,
  createCorrelationAlert,
  isFavoritePair,
  toggleFavoritePair,
  type AssetPair,
  type CorrelationTimePeriod,
  type ColorPaletteTheme,
  type CorrelationMatrix,
  type CorrelationSettings,
  type CorrelationAlert
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['user_correlation_settings', 'market_correlation_cache', 'market_alerts', 'user_notifications', 'audit_logs'],
  aiBlocks: ['correlationAnalysis', 'marketIntelligence'],
  functions: [
    'generateCorrelationMatrix',
    'getCorrelationColor',
    'saveUserSettings',
    'getFavoritePairs',
    'createAlert',
    'analyzeCorrelationPatterns'
  ]
}; 