import { pgTable, text, serial, timestamp, boolean, numeric, integer, uuid, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (core authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  avatar: text("avatar"),
  referralCode: text("referral_code").unique(),
  totalReferralEarnings: numeric("total_referral_earnings").default("0"),
  referralPayoutWallet: text("referral_payout_wallet"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).unique(),
  language: text("language").default("en"),
  theme: text("theme").default("dark"),
  timezone: text("timezone").default("UTC"),
  notifications: boolean("notifications").default(true),
  experienceLevel: text("experience_level").default("beginner"),
  favoriteMarkets: jsonb("favorite_markets").default("[]"),
  preferredTimeframes: jsonb("preferred_timeframes").default("[]"),
  aiGoals: jsonb("ai_goals").default("[]"),
  riskProfile: text("risk_profile").default("moderate"),
  dashboardLayout: jsonb("dashboard_layout").default("{}"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trading strategies table
export const tradingStrategies = pgTable("trading_strategies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  strategy: text("strategy").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  pair: text("pair").notNull(),
  timeframe: text("timeframe").notNull(),
  entryPrice: numeric("entry_price").notNull(),
  exitPrice: numeric("exit_price").notNull(),
  chartUrl: text("chart_url"),
  reason: text("reason").notNull(),
  sentiment: text("sentiment").notNull(),
  tags: jsonb("tags").default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Market setups table
export const marketSetups = pgTable("market_setups", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  entry: numeric("entry").notNull(),
  sl: numeric("sl").notNull(),
  tp: numeric("tp").notNull(),
  tradeType: text("trade_type").notNull(),
  confidenceScore: numeric("confidence_score").default("0"),
  patternDescription: text("pattern_description"),
  indicatorData: jsonb("indicator_data"),
  aiGenerated: boolean("ai_generated").default(false),
  strategyId: uuid("strategy_id"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User referrals table
export const userReferrals = pgTable("user_referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: integer("referrer_id").references(() => users.id, { onDelete: "cascade" }),
  referredId: integer("referred_id").references(() => users.id, { onDelete: "cascade" }),
  status: text("status").default("pending"),
  signupDate: timestamp("signup_date").defaultNow(),
  earningsPercentage: numeric("earnings_percentage").default("10"),
});

// Wallet transactions table
export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  txHash: text("tx_hash").notNull().unique(),
  cryptocurrency: text("cryptocurrency").notNull(),
  amount: text("amount"),
  status: text("status").notNull(),
  confirmationTimestamp: timestamp("confirmation_timestamp"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(),
  status: text("status").notNull().default("active"),
  startsAt: timestamp("starts_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentReference: text("payment_reference"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
}).extend({
  email: z.string().email().optional(),
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  userId: true,
  fullName: true,
  avatar: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  language: true,
  theme: true,
  experienceLevel: true,
  riskProfile: true,
});

export const insertTradingStrategySchema = createInsertSchema(tradingStrategies).pick({
  userId: true,
  title: true,
  description: true,
  strategy: true,
  isPublic: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  userId: true,
  title: true,
  pair: true,
  timeframe: true,
  entryPrice: true,
  exitPrice: true,
  reason: true,
  sentiment: true,
});

export const insertMarketSetupSchema = createInsertSchema(marketSetups).pick({
  userId: true,
  symbol: true,
  timeframe: true,
  entry: true,
  sl: true,
  tp: true,
  tradeType: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type TradingStrategy = typeof tradingStrategies.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type MarketSetup = typeof marketSetups.$inferSelect;
export type UserReferral = typeof userReferrals.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
