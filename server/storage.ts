import { 
  users, 
  profiles,
  journalEntries,
  tradingStrategies,
  backtestResults,
  marketAlerts,
  demoTrades,
  type User, 
  type InsertUser,
  type Profile,
  type InsertProfile,
  type JournalEntry,
  type InsertJournalEntry,
  type TradingStrategy,
  type InsertTradingStrategy,
  type BacktestResult,
  type DemoTrade,
  type InsertDemoTrade
} from "@shared/schema";

export interface IStorage {
  // Legacy user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Journal methods
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  
  // Trading strategy methods
  getTradingStrategies(userId: string): Promise<TradingStrategy[]>;
  createTradingStrategy(strategy: InsertTradingStrategy): Promise<TradingStrategy>;
  
  // Backtest methods
  getBacktestResults(userId: string, strategyId?: string): Promise<BacktestResult[]>;
  
  // Demo trading methods
  getDemoTrades(userId: string): Promise<DemoTrade[]>;
  createDemoTrade(trade: InsertDemoTrade): Promise<DemoTrade>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profiles: Map<string, Profile>;
  private journalEntries: Map<string, JournalEntry>;
  private tradingStrategies: Map<string, TradingStrategy>;
  private backtestResults: Map<string, BacktestResult>;
  private demoTrades: Map<string, DemoTrade>;
  
  private currentUserId: number;
  private generateId: () => string;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.journalEntries = new Map();
    this.tradingStrategies = new Map();
    this.backtestResults = new Map();
    this.demoTrades = new Map();
    this.currentUserId = 1;
    this.generateId = () => Math.random().toString(36).substr(2, 9);
  }

  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.email === email,
    );
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.generateId();
    const now = new Date();
    const profile: Profile = { 
      ...insertProfile, 
      id, 
      createdAt: now, 
      updatedAt: now,
      totalLikesReceived: 0,
      weeklyPostsUsed: 0,
      extraPostsEarned: 0,
      emailNotifications: true,
      priceAlerts: true,
      tradingAlerts: true
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updateData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;
    
    const updated: Profile = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.profiles.set(id, updated);
    return updated;
  }

  // Journal methods
  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.generateId();
    const entry: JournalEntry = {
      ...insertEntry,
      id,
      createdAt: new Date(),
      entryPrice: insertEntry.entryPrice.toString(),
      exitPrice: insertEntry.exitPrice.toString()
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  // Trading strategy methods
  async getTradingStrategies(userId: string): Promise<TradingStrategy[]> {
    return Array.from(this.tradingStrategies.values())
      .filter(strategy => strategy.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTradingStrategy(insertStrategy: InsertTradingStrategy): Promise<TradingStrategy> {
    const id = this.generateId();
    const now = new Date();
    const strategy: TradingStrategy = {
      ...insertStrategy,
      id,
      createdAt: now,
      updatedAt: now,
      isPublic: false
    };
    this.tradingStrategies.set(id, strategy);
    return strategy;
  }

  // Backtest methods
  async getBacktestResults(userId: string, strategyId?: string): Promise<BacktestResult[]> {
    return Array.from(this.backtestResults.values())
      .filter(result => result.userId === userId && (!strategyId || result.strategyId === strategyId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Demo trading methods
  async getDemoTrades(userId: string): Promise<DemoTrade[]> {
    return Array.from(this.demoTrades.values())
      .filter(trade => trade.userId === userId)
      .sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());
  }

  async createDemoTrade(insertTrade: InsertDemoTrade): Promise<DemoTrade> {
    const id = this.generateId();
    const now = new Date();
    const trade: DemoTrade = {
      ...insertTrade,
      id,
      openedAt: now,
      closedAt: null,
      status: "open",
      entryPrice: insertTrade.entryPrice.toString(),
      exitPrice: insertTrade.exitPrice ? insertTrade.exitPrice.toString() : null,
      volume: insertTrade.volume.toString(),
      quantity: insertTrade.quantity.toString(),
      stopLoss: insertTrade.stopLoss ? insertTrade.stopLoss.toString() : null,
      takeProfit: insertTrade.takeProfit ? insertTrade.takeProfit.toString() : null,
      pnl: insertTrade.pnl ? insertTrade.pnl.toString() : null
    };
    this.demoTrades.set(id, trade);
    return trade;
  }
}

export const storage = new MemStorage();
