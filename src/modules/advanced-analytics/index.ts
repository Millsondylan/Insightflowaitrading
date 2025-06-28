// Advanced Analytics Module
// Monte Carlo simulation, alternative data, and correlation analysis

export * from './montecarlo-simulator';
export * from './altdata-overlay';
export * from './correlation-matrix';
export * from './types';

// Module metadata
export const ADVANCED_ANALYTICS_MODULE = {
  name: 'Advanced Analytics',
  version: '1.0.0',
  description: 'Sophisticated analytics tools for trading strategy evaluation',
  features: [
    'Monte Carlo simulation engine',
    'Alternative data integration',
    'Real-time correlation analysis',
    'Sentiment analysis overlay',
  ],
} as const; 