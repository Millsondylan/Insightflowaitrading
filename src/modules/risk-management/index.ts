// Risk Management Module
// Position sizing, pre-trade checks, and live paper trading integration

export * from './dynamic-sizing/position-sizing';
export * from './pre-trade-checks';
export * from './live-paper-adapter';
export * from './types';

// Module metadata
export const RISK_MANAGEMENT_MODULE = {
  name: 'Risk Management',
  version: '1.0.0',
  description: 'Advanced risk management and position sizing tools',
  features: [
    'Dynamic position sizing based on volatility',
    'Real-time pre-trade risk checks',
    'Live paper trading integration',
    'Drawdown protection rules',
  ],
} as const; 