export type ExperienceLevel = 'beginner' | 'intermediate' | 'pro';

export type TradingStyle = 'scalping' | 'swing' | 'long-term' | 'algorithmic' | 'manual';

export type MarketType = 'forex' | 'crypto' | 'indices' | 'stocks' | 'commodities' | 'bonds';

export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'W1' | 'MN';

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export type TradingIndicator = 
  | 'RSI' 
  | 'MACD' 
  | 'EMA' 
  | 'SMA' 
  | 'Bollinger Bands' 
  | 'Stochastic' 
  | 'Ichimoku' 
  | 'Volume' 
  | 'OBV' 
  | 'ATR' 
  | 'Fibonacci'
  | string; // Allow custom indicators

export interface UserProfile {
  id?: string;
  user_id: string;
  experience: ExperienceLevel | null;
  style: TradingStyle[] | null;
  favorite_markets: MarketType[] | null;
  favorite_timeframes: Timeframe[] | null;
  favorite_symbols: string[] | null;
  indicators: TradingIndicator[] | null;
  risk_profile: RiskProfile | null;
  struggles?: string | null;
  wants_ai_trading: boolean;
  wants_voice_coach: boolean;
  wants_alerts: boolean;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingFormData {
  experience: ExperienceLevel;
  style: TradingStyle[];
  favorite_markets: MarketType[];
  favorite_timeframes: Timeframe[];
  favorite_symbols: string[];
  indicators: TradingIndicator[];
  risk_profile: RiskProfile;
  struggles?: string;
  wants_ai_trading: boolean;
  wants_voice_coach: boolean;
  wants_alerts: boolean;
}

export const defaultUserProfile: UserProfile = {
  user_id: '',
  experience: null,
  style: null,
  favorite_markets: null,
  favorite_timeframes: null,
  favorite_symbols: null,
  indicators: null,
  risk_profile: null,
  struggles: null,
  wants_ai_trading: false,
  wants_voice_coach: false,
  wants_alerts: false,
  onboarding_completed: false
}; 