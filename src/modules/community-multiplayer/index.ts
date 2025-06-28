// Community + Multiplayer Tools Module
// Provides community interaction and collaborative editing

import { CommunityGPT } from './community-gpt';
import { MultiplayerEditor } from './multiplayer-editor';
import { UserPresenceTagging } from './user-presence-tagging';

export {
  CommunityGPT,
  MultiplayerEditor,
  UserPresenceTagging
};

// Types
export * from './types';

// Community Multiplayer Module
export * from './live-event-room';

// Module configuration
export const communityMultiplayerModule = {
  name: 'Community & Multiplayer',
  description: 'Social trading, collaboration, and knowledge sharing',
  features: [
    'Live trading rooms',
    'Community discussions',
    'Collaborative strategy building',
    'Social trading insights',
    'Real-time market events'
  ]
}; 