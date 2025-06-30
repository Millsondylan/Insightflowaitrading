import { z } from 'zod';

// Define the schema for all required environment variables
const envSchema = z.object({
  // Supabase
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  
  // AI Providers
  VITE_OPENAI_API_KEY: z.string().min(1),
  VITE_ANTHROPIC_API_KEY: z.string().min(1),
  VITE_GROQ_API_KEY: z.string().min(1),
  
  // Market Data APIs
  VITE_POLYGON_API_KEY: z.string().min(1),
  VITE_ALPHA_VANTAGE_API_KEY: z.string().min(1),
  VITE_FINNHUB_API_KEY: z.string().min(1),
  
  // Crypto/Blockchain
  VITE_COINGECKO_API_KEY: z.string().min(1),
  VITE_ETHERSCAN_API_KEY: z.string().min(1),
  VITE_BLOCKCHAIN_API_KEY: z.string().min(1),
  
  // Optional but validated if present
  VITE_AUDIT_WEBHOOK_URL: z.string().url().optional(),
  VITE_TRADINGVIEW_SCRIPT_DEEPLINK: z.string().url().optional(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

// Parse and validate environment variables
export const env = envSchema.parse(import.meta.env);

// Type-safe environment variable access
export type Env = z.infer<typeof envSchema>; 