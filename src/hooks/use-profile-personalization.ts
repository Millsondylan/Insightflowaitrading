import { useMemo } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { UserProfile, ExperienceLevel, RiskProfile } from '@/types/profile';

/**
 * Hook to get personalized content based on user profile
 */
export function useProfilePersonalization() {
  const { profile, isLoading } = useOnboarding();
  
  // Generate personalized AI prompt context
  const aiPromptContext = useMemo(() => {
    if (!profile) return '';
    
    const experienceText = getExperienceText(profile.experience);
    const riskText = getRiskText(profile.risk_profile);
    const styleText = profile.style?.length 
      ? `The user prefers ${profile.style.join(', ')} trading.` 
      : '';
    const timeframesText = profile.favorite_timeframes?.length 
      ? `They primarily trade on ${profile.favorite_timeframes.join(', ')} timeframes.` 
      : '';
    const marketsText = profile.favorite_markets?.length 
      ? `They focus on ${profile.favorite_markets.join(', ')} markets.` 
      : '';
    const indicatorsText = profile.indicators?.length 
      ? `Their preferred indicators are ${profile.indicators.join(', ')}.` 
      : '';
    
    return `
      ${experienceText}
      ${riskText}
      ${styleText}
      ${timeframesText}
      ${marketsText}
      ${indicatorsText}
    `.trim();
  }, [profile]);
  
  // Get default chart settings
  const defaultChartSettings = useMemo(() => {
    if (!profile) {
      return {
        timeframe: 'D1',
        symbols: ['BTC/USDT'],
        indicators: ['RSI', 'EMA']
      };
    }
    
    return {
      timeframe: profile.favorite_timeframes?.[0] || 'D1',
      symbols: profile.favorite_symbols?.slice(0, 5) || ['BTC/USDT'],
      indicators: profile.indicators?.slice(0, 3) || ['RSI', 'EMA']
    };
  }, [profile]);
  
  // Get personalized strategy template
  const strategyTemplate = useMemo(() => {
    if (!profile) return null;
    
    const templates = {
      beginner: {
        name: 'Simple Moving Average Crossover',
        description: 'A beginner-friendly strategy using moving average crossovers',
        indicators: ['SMA'],
        complexity: 'low'
      },
      intermediate: {
        name: 'MACD with RSI Filter',
        description: 'A momentum strategy with RSI confirmation',
        indicators: ['MACD', 'RSI'],
        complexity: 'medium'
      },
      pro: {
        name: 'Multi-Timeframe Analysis',
        description: 'Advanced strategy using multiple timeframes and indicators',
        indicators: ['EMA', 'RSI', 'Bollinger Bands', 'Volume'],
        complexity: 'high'
      }
    };
    
    const experienceLevel = profile.experience || 'beginner';
    return templates[experienceLevel];
  }, [profile]);
  
  // Get personalized risk parameters
  const riskParameters = useMemo(() => {
    if (!profile) {
      return {
        riskPerTrade: 1,
        stopLossPercent: 2,
        takeProfitRatio: 2
      };
    }
    
    const riskProfiles = {
      conservative: {
        riskPerTrade: 1,
        stopLossPercent: 1.5,
        takeProfitRatio: 2
      },
      moderate: {
        riskPerTrade: 2,
        stopLossPercent: 2.5,
        takeProfitRatio: 2.5
      },
      aggressive: {
        riskPerTrade: 3,
        stopLossPercent: 4,
        takeProfitRatio: 3
      }
    };
    
    const riskProfile = profile.risk_profile || 'moderate';
    return riskProfiles[riskProfile];
  }, [profile]);
  
  return {
    profile,
    isLoading,
    aiPromptContext,
    defaultChartSettings,
    strategyTemplate,
    riskParameters
  };
}

// Helper functions
function getExperienceText(experience: ExperienceLevel | null): string {
  switch (experience) {
    case 'beginner':
      return 'The user is a beginner trader with limited experience.';
    case 'intermediate':
      return 'The user is an intermediate trader with some experience.';
    case 'pro':
      return 'The user is an experienced professional trader.';
    default:
      return '';
  }
}

function getRiskText(riskProfile: RiskProfile | null): string {
  switch (riskProfile) {
    case 'conservative':
      return 'They have a conservative risk profile, focusing on capital preservation.';
    case 'moderate':
      return 'They have a moderate risk profile, balancing risk and reward.';
    case 'aggressive':
      return 'They have an aggressive risk profile, willing to take higher risks for higher returns.';
    default:
      return '';
  }
}

export default useProfilePersonalization; 