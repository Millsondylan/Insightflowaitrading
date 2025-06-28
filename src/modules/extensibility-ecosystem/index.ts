// Extensibility Ecosystem Module
// Plugin SDK, webhooks, and API definitions

export * from './plugin-sdk';
export * from './webhooks';
export * from './insightflow-api';
export * from './types';

// Module metadata
export const EXTENSIBILITY_ECOSYSTEM_MODULE = {
  name: 'Extensibility Ecosystem',
  version: '1.0.0',
  description: 'Plugin system and external integrations',
  features: [
    'TypeScript plugin SDK',
    'Webhook integrations (Slack, Telegram, SMS)',
    'REST/GraphQL API definitions',
    'Third-party service connectors',
  ],
} as const; 