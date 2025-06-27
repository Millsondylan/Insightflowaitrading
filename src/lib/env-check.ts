import { validateEnvVars } from './config';

/**
 * Checks if critical environment variables are set
 * @returns True if all critical variables are set, false otherwise
 */
export function checkCriticalEnvVars(): boolean {
  // These are the minimum required variables for the app to function
  const criticalVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ];
  
  return validateEnvVars(criticalVars);
}

/**
 * Checks if AI provider environment variables are set
 * @returns Object containing availability status for each provider
 */
export function checkAIProviders() {
  return {
    openai: Boolean(import.meta.env.VITE_OPENAI_API_KEY),
    groq: Boolean(import.meta.env.VITE_GROQ_API_KEY),
    gemini: Boolean(import.meta.env.VITE_GEMINI_API_KEY),
  };
}

/**
 * Checks if payment wallet addresses are set
 * @returns Object containing availability status for each wallet type
 */
export function checkWalletAddresses() {
  return {
    eth: Boolean(import.meta.env.VITE_RECEIVE_ETH_ADDRESS),
    usdt: Boolean(import.meta.env.VITE_RECEIVE_USDT_ADDRESS),
    btc: Boolean(import.meta.env.VITE_RECEIVE_BTC_ADDRESS),
  };
} 