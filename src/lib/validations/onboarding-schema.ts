import { z } from 'zod';
import { 
  ExperienceLevel, 
  TradingStyle, 
  MarketType, 
  Timeframe, 
  RiskProfile 
} from '@/types/profile';

// Define the schema for each step
export const experienceSchema = z.object({
  experience: z.enum(['beginner', 'intermediate', 'pro'] as const),
  struggles: z.string().optional(),
});

export const tradingStyleSchema = z.object({
  style: z.array(
    z.enum(['scalping', 'swing', 'long-term', 'algorithmic', 'manual'] as const)
  ).min(1, 'Select at least one trading style'),
});

export const marketsSchema = z.object({
  favorite_markets: z.array(
    z.enum(['forex', 'crypto', 'indices', 'stocks', 'commodities', 'bonds'] as const)
  ).min(1, 'Select at least one market'),
  favorite_symbols: z.array(z.string()).min(1, 'Enter at least one symbol'),
});

export const timeframesSchema = z.object({
  favorite_timeframes: z.array(
    z.enum(['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'] as const)
  ).min(1, 'Select at least one timeframe'),
});

export const indicatorsSchema = z.object({
  indicators: z.array(z.string()).min(1, 'Select at least one indicator'),
});

export const riskProfileSchema = z.object({
  risk_profile: z.enum(['conservative', 'moderate', 'aggressive'] as const),
});

export const aiPreferencesSchema = z.object({
  wants_ai_trading: z.boolean().default(false),
  wants_voice_coach: z.boolean().default(false),
  wants_alerts: z.boolean().default(false),
});

// Combine all schemas for the complete form
export const onboardingSchema = z.object({
  experience: z.enum(['beginner', 'intermediate', 'pro'] as const),
  struggles: z.string().optional(),
  style: z.array(
    z.enum(['scalping', 'swing', 'long-term', 'algorithmic', 'manual'] as const)
  ).min(1, 'Select at least one trading style'),
  favorite_markets: z.array(
    z.enum(['forex', 'crypto', 'indices', 'stocks', 'commodities', 'bonds'] as const)
  ).min(1, 'Select at least one market'),
  favorite_symbols: z.array(z.string()).min(1, 'Enter at least one symbol'),
  favorite_timeframes: z.array(
    z.enum(['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'] as const)
  ).min(1, 'Select at least one timeframe'),
  indicators: z.array(z.string()).min(1, 'Select at least one indicator'),
  risk_profile: z.enum(['conservative', 'moderate', 'aggressive'] as const),
  wants_ai_trading: z.boolean().default(false),
  wants_voice_coach: z.boolean().default(false),
  wants_alerts: z.boolean().default(false),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type TradingStyleFormData = z.infer<typeof tradingStyleSchema>;
export type MarketsFormData = z.infer<typeof marketsSchema>;
export type TimeframesFormData = z.infer<typeof timeframesSchema>;
export type IndicatorsFormData = z.infer<typeof indicatorsSchema>;
export type RiskProfileFormData = z.infer<typeof riskProfileSchema>;
export type AIPreferencesFormData = z.infer<typeof aiPreferencesSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>; 