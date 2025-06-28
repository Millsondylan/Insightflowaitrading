/**
 * Environment variables configuration with type safety
 */

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL as string,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
};

// Crypto Wallet Addresses
export const WALLET_ADDRESSES = {
  eth: import.meta.env.VITE_RECEIVE_ETH_ADDRESS as string,
  usdt: import.meta.env.VITE_RECEIVE_USDT_ADDRESS as string,
  btc: import.meta.env.VITE_RECEIVE_BTC_ADDRESS as string,
};

// AI Provider API Keys
export const AI_PROVIDERS = {
  openai: import.meta.env.VITE_OPENAI_API_KEY as string,
  groq: import.meta.env.VITE_GROQ_API_KEY as string,
  gemini: import.meta.env.VITE_GEMINI_API_KEY as string,
};

// Market Data API Keys
export const MARKET_DATA = {
  yfinance: import.meta.env.VITE_YFINANCE_API_KEY as string,
  coingecko: import.meta.env.VITE_COINGECKO_API_KEY as string,
  alphaVantage: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY as string,
  polygon: import.meta.env.VITE_POLYGON_API_KEY as string,
  exchangeRate: import.meta.env.VITE_EXCHANGERATE_API_KEY as string,
  fixer: import.meta.env.VITE_FIXER_API_KEY as string,
  fmp: import.meta.env.VITE_FMP_API_KEY as string,
  etherscan: import.meta.env.VITE_ETHERSCAN_API_KEY as string,
  finnhub: import.meta.env.VITE_FINNHUB_API_KEY as string,
  newsApi: import.meta.env.VITE_NEWS_API_KEY as string,
};

// Messaging/Bots API Keys
export const MESSAGING = {
  telegramBotToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string,
};

// Email API Keys
export const EMAIL = {
  sendgrid: import.meta.env.VITE_SENDGRID_API_KEY as string,
  mailgun: import.meta.env.VITE_MAILGUN_API_KEY as string,
};

/**
 * Validates that required environment variables are present
 * @param requiredVars Array of required environment variable keys
 * @returns True if all required variables are present, false otherwise
 */
export function validateEnvVars(requiredVars: string[]): boolean {
  const missingVars = requiredVars.filter(
    (varName) => !(import.meta.env[`VITE_${varName}`])
  );
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
} 