import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import verifyCryptoPayment from "./api/verify-crypto-payment";
import handleAnalyzeMarketSetup from "./api/analyze-market-setup";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

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

  const httpServer = createServer(app);

  return httpServer;
}
