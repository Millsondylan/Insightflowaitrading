/**
 * Insight Flow AI Trading Platform
 * Audit Compliance System
 * 
 * This file centralizes exports for the audit compliance system,
 * ensuring all logging, monitoring, and data persistence features
 * are properly integrated and available throughout the application.
 */

// Database Persistence
export * from './db/academy';
export * from './db/userSettings';

// Monitoring & Logging
export {
  initializeSession,
  setAuditUser,
  useAuditLog,
  captureErrorBoundary,
  recordPerformanceMetric,
  saveUserState
} from './monitoring/auditLogger';

// AI Features
export {
  generateLessonNarration,
  type NarratorContext,
  type NarratorOptions
} from './academy/generateLessonNarrator';

// Notification System
export {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type UserNotification
} from './db/userSettings';

/**
 * The Insight Flow audit compliance system ensures:
 * 
 * 1. Complete database persistence of user interactions
 * 2. Comprehensive audit logging for all user actions
 * 3. AI behavior tracking and transparency
 * 4. User settings personalization and preferences
 * 5. Market data analysis integrity
 * 
 * This system is designed to meet regulatory requirements
 * while maintaining user privacy and security.
 */

// Note: Market correlations functionality can be imported directly from:
// import { getMarketCorrelations, saveCorrelationSettings } from './markets/correlations'; 