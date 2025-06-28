// Tech + Compatibility Layer Module
// Provides compatibility with Lovable.dev and other platforms

import { LovableConverter } from './lovable-converter';
import { SupabaseAdapter } from './supabase-adapter';
import { GitHubSync } from './github-sync';

export {
  LovableConverter,
  SupabaseAdapter,
  GitHubSync
};

// Types
export * from './types'; 