// Social Gamification Type Definitions

export interface StrategyListing {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  strategy: string; // Strategy code or configuration
  category: 'scalping' | 'swing' | 'day_trading' | 'long_term';
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  performance: StrategyPerformance;
  pricing: StrategyPricing;
  tags: string[];
  screenshots: string[];
  totalDownloads: number;
  rating: number; // 1-5 stars
  reviews: StrategyReview[];
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

export interface StrategyPerformance {
  backtestPeriod: string;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
}

export interface StrategyPricing {
  type: 'free' | 'one_time' | 'subscription' | 'revenue_share';
  price?: number; // For one_time purchases
  monthlyPrice?: number; // For subscriptions
  revenueSharePercent?: number; // For revenue sharing
  currency: 'USD' | 'EUR' | 'BTC' | 'ETH';
}

export interface StrategyReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean; // If user actually purchased/used strategy
  createdAt: Date;
}

export interface StrategyLicense {
  id: string;
  strategyId: string;
  userId: string;
  licenseType: 'trial' | 'full' | 'subscription';
  expiresAt?: Date;
  downloadCount: number;
  maxDownloads?: number;
  createdAt: Date;
}

// Achievement system types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'social' | 'learning' | 'milestone';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  criteria: AchievementCriteria;
  rewards: AchievementRewards;
  isHidden: boolean; // Secret achievements
  unlockedBy: string[]; // User IDs who unlocked this
}

export interface AchievementCriteria {
  type: 'trade_count' | 'profit_threshold' | 'streak' | 'social_engagement' | 'strategy_creation';
  targetValue: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all_time';
  conditions?: Record<string, any>; // Additional conditions
}

export interface AchievementRewards {
  points: number;
  badges: string[];
  titles: string[];
  unlocks?: string[]; // Features or content unlocked
  currency?: { amount: number; type: string };
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: Date;
  progress: number; // 0-100%
  isCompleted: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  experience: number;
  titles: string[];
  badges: Badge[];
  stats: UserStats;
  streaks: UserStreaks;
  joinedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

export interface UserStats {
  totalTrades: number;
  totalProfit: number;
  bestStreak: number;
  strategiesCreated: number;
  strategiesPurchased: number;
  socialInteractions: number;
  lessonsCompleted: number;
}

export interface UserStreaks {
  currentTradingStreak: number;
  longestTradingStreak: number;
  currentLearningStreak: number;
  longestLearningStreak: number;
  lastTradingDate: Date;
  lastLearningDate: Date;
}

// Live event room types
export interface LiveEventRoom {
  id: string;
  name: string;
  description: string;
  hostId: string;
  hostName: string;
  type: 'chart_watch' | 'strategy_demo' | 'education' | 'competition';
  symbol: string; // Primary symbol being watched
  participants: EventParticipant[];
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  startTime: Date;
  endTime?: Date;
  settings: RoomSettings;
  messages: RoomMessage[];
  annotations: ChartAnnotation[];
}

export interface EventParticipant {
  userId: string;
  username: string;
  avatar: string;
  role: 'host' | 'moderator' | 'participant';
  joinedAt: Date;
  isActive: boolean;
  permissions: ParticipantPermissions;
}

export interface ParticipantPermissions {
  canChat: boolean;
  canAnnotate: boolean;
  canShareScreen: boolean;
  canSpeak: boolean; // For voice events
}

export interface RoomSettings {
  isPublic: boolean;
  requiresApproval: boolean;
  allowChat: boolean;
  allowAnnotations: boolean;
  allowVoice: boolean;
  recordSession: boolean;
  chatModerationLevel: 'none' | 'basic' | 'strict';
}

export interface RoomMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  type: 'text' | 'system' | 'trade_alert' | 'chart_share';
  timestamp: Date;
  reactions: MessageReaction[];
  isModerated: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted
}

export interface ChartAnnotation {
  id: string;
  userId: string;
  username: string;
  type: 'line' | 'arrow' | 'text' | 'rectangle' | 'circle';
  coordinates: AnnotationCoordinates;
  style: AnnotationStyle;
  text?: string;
  timestamp: Date;
  isPersistent: boolean; // If annotation stays after user leaves
}

export interface AnnotationCoordinates {
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
}

export interface AnnotationStyle {
  color: string;
  thickness: number;
  opacity: number;
  fontSize?: number;
}

// Leaderboard types
export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'social' | 'learning' | 'strategy_creation';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all_time';
  entries: LeaderboardEntry[];
  updatedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  scoreType: 'profit' | 'percentage' | 'points' | 'count';
  badge?: string; // Special badge for top performers
  change: number; // Position change from last update
}

// Event types for social gamification
export type SocialEvent =
  | { type: 'ACHIEVEMENT_UNLOCKED'; payload: { userId: string; achievementId: string } }
  | { type: 'LEVEL_UP'; payload: { userId: string; newLevel: number } }
  | { type: 'STRATEGY_PUBLISHED'; payload: { strategyId: string; authorId: string } }
  | { type: 'ROOM_JOINED'; payload: { roomId: string; userId: string } }
  | { type: 'ROOM_CREATED'; payload: { roomId: string; hostId: string } }
  | { type: 'LEADERBOARD_UPDATE'; payload: { leaderboardId: string; topChanges: any // eslint-disable-line @typescript-eslint/no-explicit-any[] } };

// Notification types
export interface SocialNotification {
  id: string;
  userId: string;
  type: 'achievement' | 'level_up' | 'strategy_review' | 'room_invite' | 'leaderboard';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
} 