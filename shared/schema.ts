import { 
  pgTable, 
  text, 
  serial, 
  timestamp, 
  uuid, 
  numeric,
  integer,
  boolean,
  jsonb,
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Core user profile table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  subscriptionTier: text("subscription_tier"),
  subscriptionEnd: timestamp("subscription_end"),
  baseTrialEnd: timestamp("base_trial_end"),
  trialExtendedUntil: timestamp("trial_extended_until"),
  currency: text("currency"),
  timezone: text("timezone"),
  theme: text("theme"),
  emailNotifications: boolean("email_notifications").default(true),
  priceAlerts: boolean("price_alerts").default(true),
  tradingAlerts: boolean("trading_alerts").default(true),
  mt5AccountId: text("mt5_account_id"),
  totalLikesReceived: integer("total_likes_received").default(0),
  weeklyPostsUsed: integer("weekly_posts_used").default(0),
  extraPostsEarned: integer("extra_posts_earned").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trading journal entries
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  pair: text("pair").notNull(),
  timeframe: text("timeframe").notNull(),
  entryPrice: numeric("entry_price", { precision: 15, scale: 8 }).notNull(),
  exitPrice: numeric("exit_price", { precision: 15, scale: 8 }).notNull(),
  reason: text("reason").notNull(),
  sentiment: text("sentiment").notNull(),
  tags: text("tags").array(),
  chartUrl: text("chart_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI reflections on journal entries
export const aiReflections = pgTable("ai_reflections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  journalEntryId: uuid("journal_entry_id").references(() => journalEntries.id, { onDelete: "cascade" }).notNull(),
  summary: text("summary").notNull(),
  suggestion: text("suggestion").notNull(),
  confidence: real("confidence").notNull(),
  tags: text("tags").array().default([]),
  provider: text("provider").default("gpt-4"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trading strategies
export const tradingStrategies = pgTable("trading_strategies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  strategyType: text("strategy_type"),
  parameters: jsonb("parameters"),
  code: text("code"),
  isPublic: boolean("is_public").default(false),
  performance: jsonb("performance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Backtest results
export const backtestResults = pgTable("backtest_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  strategyId: uuid("strategy_id").references(() => tradingStrategies.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  initialBalance: numeric("initial_balance", { precision: 15, scale: 2 }).default("10000"),
  finalBalance: numeric("final_balance", { precision: 15, scale: 2 }).notNull(),
  totalTrades: integer("total_trades"),
  winningTrades: integer("winning_trades"),
  losingTrades: integer("losing_trades"),
  winRate: numeric("win_rate", { precision: 5, scale: 2 }),
  profitFactor: numeric("profit_factor", { precision: 8, scale: 4 }),
  maxDrawdown: numeric("max_drawdown", { precision: 8, scale: 4 }),
  sharpeRatio: numeric("sharpe_ratio", { precision: 8, scale: 4 }),
  resultsData: jsonb("results_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Market alerts
export const marketAlerts = pgTable("market_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  alertType: text("alert_type").notNull(),
  conditionData: jsonb("condition_data").notNull(),
  message: text("message"),
  triggered: boolean("triggered").default(false),
  triggeredAt: timestamp("triggered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Portfolio snapshots
export const portfolioSnapshots = pgTable("portfolio_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  totalValue: numeric("total_value", { precision: 15, scale: 2 }).notNull(),
  totalPnl: numeric("total_pnl", { precision: 15, scale: 2 }),
  snapshotData: jsonb("snapshot_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community posts
export const communityPosts = pgTable("community_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postType: text("post_type"),
  symbol: text("symbol"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Demo trading accounts
export const demoAccounts = pgTable("demo_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  balance: numeric("balance", { precision: 15, scale: 2 }).default("10000"),
  equity: numeric("equity", { precision: 15, scale: 2 }),
  margin: numeric("margin", { precision: 15, scale: 2 }),
  marginLevel: numeric("margin_level", { precision: 8, scale: 2 }),
  totalProfit: numeric("total_profit", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Demo trades
export const demoTrades = pgTable("demo_trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  demoAccountId: uuid("demo_account_id").references(() => demoAccounts.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  tradeType: text("trade_type").notNull(), // "buy" or "sell"
  volume: numeric("volume", { precision: 15, scale: 8 }).notNull(),
  quantity: numeric("quantity", { precision: 15, scale: 8 }).notNull(),
  entryPrice: numeric("entry_price", { precision: 15, scale: 8 }).notNull(),
  exitPrice: numeric("exit_price", { precision: 15, scale: 8 }),
  stopLoss: numeric("stop_loss", { precision: 15, scale: 8 }),
  takeProfit: numeric("take_profit", { precision: 15, scale: 8 }),
  pnl: numeric("pnl", { precision: 15, scale: 2 }),
  status: text("status").default("open"), // "open", "closed"
  notes: text("notes"),
  mt5TicketId: text("mt5_ticket_id"),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
});

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  tier: text("tier").notNull(),
  status: text("status"),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  currency: text("currency"),
  paymentHash: text("payment_hash"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI chat messages
export const aiChatMessages = pgTable("ai_chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  messageType: text("message_type").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  analysisData: jsonb("analysis_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  journalEntries: many(journalEntries),
  aiReflections: many(aiReflections),
  tradingStrategies: many(tradingStrategies),
  backtestResults: many(backtestResults),
  marketAlerts: many(marketAlerts),
  portfolioSnapshots: many(portfolioSnapshots),
  communityPosts: many(communityPosts),
  demoAccounts: many(demoAccounts),
  demoTrades: many(demoTrades),
  subscriptions: many(subscriptions),
  aiChatMessages: many(aiChatMessages),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
  user: one(profiles, {
    fields: [journalEntries.userId],
    references: [profiles.id],
  }),
  aiReflections: many(aiReflections),
}));

export const tradingStrategiesRelations = relations(tradingStrategies, ({ one, many }) => ({
  user: one(profiles, {
    fields: [tradingStrategies.userId],
    references: [profiles.id],
  }),
  backtestResults: many(backtestResults),
}));

export const backtestResultsRelations = relations(backtestResults, ({ one }) => ({
  user: one(profiles, {
    fields: [backtestResults.userId],
    references: [profiles.id],
  }),
  strategy: one(tradingStrategies, {
    fields: [backtestResults.strategyId],
    references: [tradingStrategies.id],
  }),
}));

export const demoAccountsRelations = relations(demoAccounts, ({ one, many }) => ({
  user: one(profiles, {
    fields: [demoAccounts.userId],
    references: [profiles.id],
  }),
  trades: many(demoTrades),
}));

// Insert schemas for form validation
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertTradingStrategySchema = createInsertSchema(tradingStrategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDemoTradeSchema = createInsertSchema(demoTrades).omit({
  id: true,
  openedAt: true,
  closedAt: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;

export type TradingStrategy = typeof tradingStrategies.$inferSelect;
export type InsertTradingStrategy = z.infer<typeof insertTradingStrategySchema>;

export type BacktestResult = typeof backtestResults.$inferSelect;

export type DemoTrade = typeof demoTrades.$inferSelect;
export type InsertDemoTrade = z.infer<typeof insertDemoTradeSchema>;

export type AiChatMessage = typeof aiChatMessages.$inferSelect;

// Legacy users table for compatibility (can be removed after migration)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
