// Extra Features Module
// Provides additional functionality like emotion tagging and replay annotations

import { EmotionTagging } from './emotion-tagging';
import { ReplayAnnotations } from './replay-annotations';
import { PublicStrategyPublisher } from './public-strategy-publisher';
import { VersionDiff } from './version-diff';
import { LocalFirstPrototype } from './local-first-prototype';

export {
  EmotionTagging,
  ReplayAnnotations,
  PublicStrategyPublisher,
  VersionDiff,
  LocalFirstPrototype
};

// Types
export * from './types'; 