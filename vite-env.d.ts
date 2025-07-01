/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_AI_FEATURES: string
  readonly VITE_ENABLE_COMMUNITY_FEATURES: string
  readonly VITE_ENABLE_ACADEMY_FEATURES: string
  readonly VITE_ENABLE_COPILOT_FEATURES: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_DEMO_MODE: string
  readonly VITE_ALPHA_VANTAGE_API_KEY: string
  readonly VITE_GA_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 