import { users, profiles, userPreferences, tradingStrategies, journalEntries, marketSetups, userReferrals, walletTransactions, subscriptions, type User, type InsertUser, type Profile, type UserPreferences, type TradingStrategy, type JournalEntry, type MarketSetup } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: Partial<Profile>): Promise<Profile>;
  updateProfile(userId: number, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  // User preferences methods
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences>;
  updateUserPreferences(userId: number, updates: Partial<UserPreferences>): Promise<UserPreferences | undefined>;
  
  // Trading strategies methods
  getTradingStrategies(userId: number): Promise<TradingStrategy[]>;
  createTradingStrategy(strategy: Partial<TradingStrategy>): Promise<TradingStrategy>;
  
  // Journal entries methods
  getJournalEntries(userId: number): Promise<JournalEntry[]>;
  createJournalEntry(entry: Partial<JournalEntry>): Promise<JournalEntry>;
  
  // Market setups methods
  getMarketSetups(userId: number): Promise<MarketSetup[]>;
  createMarketSetup(setup: Partial<MarketSetup>): Promise<MarketSetup>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Profile methods
  async getProfile(userId: number): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0];
  }

  async createProfile(profile: Partial<Profile>): Promise<Profile> {
    const result = await db.insert(profiles).values(profile as any).returning();
    return result[0];
  }

  async updateProfile(userId: number, updates: Partial<Profile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set(updates).where(eq(profiles.userId, userId)).returning();
    return result[0];
  }

  // User preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
    return result[0];
  }

  async createUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const result = await db.insert(userPreferences).values(preferences as any).returning();
    return result[0];
  }

  async updateUserPreferences(userId: number, updates: Partial<UserPreferences>): Promise<UserPreferences | undefined> {
    const result = await db.update(userPreferences).set(updates).where(eq(userPreferences.userId, userId)).returning();
    return result[0];
  }

  // Trading strategies methods
  async getTradingStrategies(userId: number): Promise<TradingStrategy[]> {
    return await db.select().from(tradingStrategies).where(eq(tradingStrategies.userId, userId));
  }

  async createTradingStrategy(strategy: Partial<TradingStrategy>): Promise<TradingStrategy> {
    const result = await db.insert(tradingStrategies).values(strategy as any).returning();
    return result[0];
  }

  // Journal entries methods
  async getJournalEntries(userId: number): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries).where(eq(journalEntries.userId, userId));
  }

  async createJournalEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const result = await db.insert(journalEntries).values(entry as any).returning();
    return result[0];
  }

  // Market setups methods
  async getMarketSetups(userId: number): Promise<MarketSetup[]> {
    return await db.select().from(marketSetups).where(eq(marketSetups.userId, userId));
  }

  async createMarketSetup(setup: Partial<MarketSetup>): Promise<MarketSetup> {
    const result = await db.insert(marketSetups).values(setup as any).returning();
    return result[0];
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
