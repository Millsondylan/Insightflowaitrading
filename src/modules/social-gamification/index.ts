// Social Gamification Module
// Strategy marketplace, achievements, and live event rooms

export * from './strategy-marketplace';
export * from './achievements';
export * from './live-event-room';
export * from './types';

// Module metadata
export const SOCIAL_GAMIFICATION_MODULE = {
  name: 'Social Gamification',
  version: '1.0.0',
  description: 'Community features and gamification elements',
  features: [
    'Strategy marketplace with licensing',
    'Achievement system with badges',
    'Live event rooms for chart watching',
    'Social trading leaderboards',
  ],
} as const; 