import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import verifyCryptoPayment from "./api/verify-crypto-payment";
import handleAnalyzeMarketSetup from "./api/analyze-market-setup";

// Extend Express Request to include session
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set user session
      req.session.userId = user.id;
      req.session.username = user.username;

      // Get or create profile and preferences
      let profile = await storage.getProfile(user.id);
      if (!profile) {
        profile = await storage.createProfile({ userId: user.id });
      }

      let preferences = await storage.getUserPreferences(user.id);
      if (!preferences) {
        preferences = await storage.createUserPreferences({ userId: user.id });
      }

      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username, email: user.email },
        profile,
        preferences
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Create new user
      const newUser = await storage.createUser({ username, password, email });

      // Create profile and preferences
      const profile = await storage.createProfile({ userId: newUser.id });
      const preferences = await storage.createUserPreferences({ userId: newUser.id });

      // Set user session
      req.session.userId = newUser.id;
      req.session.username = newUser.username;

      res.json({ 
        success: true, 
        user: { id: newUser.id, username: newUser.username, email: newUser.email },
        profile,
        preferences
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not log out' });
      }
      res.json({ success: true });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const profile = await storage.getProfile(userId);
      const preferences = await storage.getUserPreferences(userId);

      res.json({ 
        user: { id: user.id, username: user.username, email: user.email },
        profile,
        preferences
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Crypto payment routes
  app.post('/api/verify-crypto-payment', verifyCryptoPayment);
  
  // Check payment status route
  app.post('/api/check-payment-status', async (req, res) => {
    // For now, reuse the verify endpoint logic
    // In production, you might want to store and retrieve payment status from database
    return verifyCryptoPayment(req, res);
  });

  // Market analysis route
  app.post('/api/analyze-market-setup', handleAnalyzeMarketSetup);

  // User data routes
  app.get('/api/trading-strategies', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const strategies = await storage.getTradingStrategies(userId);
      res.json(strategies);
    } catch (error) {
      console.error('Get strategies error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/trading-strategies', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const strategy = await storage.createTradingStrategy({
        userId,
        ...req.body
      });
      res.json(strategy);
    } catch (error) {
      console.error('Create strategy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/journal-entries', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error('Get journal entries error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/journal-entries', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const entry = await storage.createJournalEntry({
        userId,
        ...req.body
      });
      res.json(entry);
    } catch (error) {
      console.error('Create journal entry error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/market-setups', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const setups = await storage.getMarketSetups(userId);
      res.json(setups);
    } catch (error) {
      console.error('Get market setups error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
