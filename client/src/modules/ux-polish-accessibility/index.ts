// UX Polish & Accessibility Module
// Micro-interactions, mobile optimization, and localization

export * from './micro-interactions';
export * from './mobile-replay';
export * from './localization';
export * from './types';

// Module metadata
export const UX_POLISH_ACCESSIBILITY_MODULE = {
  name: 'UX Polish & Accessibility',
  version: '1.0.0',
  description: 'Enhanced user experience and accessibility features',
  features: [
    'Smooth micro-interactions and animations',
    'Mobile-optimized replay and controls',
    'Voice note integration',
    'Multi-language localization (i18n)',
    'Accessibility compliance (WCAG 2.1)',
    'Theme pack system',
  ],
} as const; 