import { z } from 'zod';

const envSchema = z.object({
  // From user's example
  COINGECKO_API_KEY: z.string().optional(),

  // Supabase (handled via transform)
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),

  // Client-side AI Keys
  NEXT_PUBLIC_OPENAI_API_KEY: z.string(),
  NEXT_PUBLIC_ANTHROPIC_API_KEY: z.string(),
  NEXT_PUBLIC_GEMINI_API_KEY: z.string(),
  
  // App settings
  NEXT_PUBLIC_APP_URL: z.string().url(),
  TRADINGVIEW_SCRIPT_DEEPLINK: z.string().url().optional(),
  
  // Server-side keys
  SUPABASE_SERVICE_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AUDIT_WEBHOOK_URL: z.string().url().optional(),
  MARKET_API_KEY: z.string().optional(),
  ETHERSCAN_API_KEY: z.string().optional(),
  BLOCKCYPHER_TOKEN: z.string().optional(),
  BLOCKCHAIN_API_KEY: z.string().optional(),
  ROBOFLOW_API_KEY: z.string().optional(),
  BLOCKCHAIR_API_KEY: z.string().optional(),
  TRONGRID_API_KEY: z.string().optional(),
});

// We manually combine the different env sources.
// This is not ideal, but necessary for the diverse project setup.
const processEnv = {
    ...import.meta.env,
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    NEXT_PUBLIC_ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY,
    NEXT_PUBLIC_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    NEXT_PUBLIC_APP_URL: import.meta.env.VITE_APP_URL,
};


export const env = envSchema.parse(processEnv); 