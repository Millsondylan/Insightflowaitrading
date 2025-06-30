import {
  reflectOnEntry,
  analyzeJournalPatterns,
  generateCoachingFeedback,
  storeMemory,
  type JournalEntry,
  type AIReflection,
  type ReflectionOptions
} from './reflection-engine';

export {
  reflectOnEntry,
  analyzeJournalPatterns,
  generateCoachingFeedback,
  storeMemory,
  type JournalEntry,
  type AIReflection,
  type ReflectionOptions
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['journal_entries', 'ai_reflections', 'journal_memory', 'coaching_feedback', 'audit_logs'],
  aiBlocks: ['journalReflection', 'tradeCoaching', 'emotionalTags'],
  functions: [
    'analyzeJournalEntry',
    'generateReflection',
    'findPatterns',
    'storeMemory',
    'retrieveMemory',
    'analyzeJournalEntry',
    'saveJournalEntry',
    'getJournalInsights',
    'generateMindsetFeed',
    'emotion-patterns'
  ]
}; 