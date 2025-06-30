import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RiskSettings {
  defaultRiskPercent: number;
  maxRiskPerTrade: number;
}

interface OnboardingStore {
  hasSeenWelcome: boolean;
  experienceLevel: string;
  favoritePairs: string[];
  preferredTimeframes: string[];
  riskSettings: RiskSettings;
  
  // Actions
  setHasSeenWelcome: (seen: boolean) => void;
  setExperienceLevel: (level: string) => void;
  setFavoritePairs: (pairs: string[]) => void;
  setPreferredTimeframes: (timeframes: string[]) => void;
  setRiskSettings: (settings: RiskSettings) => void;
  resetOnboarding: () => void;
}

// Default values
const defaultRiskSettings: RiskSettings = {
  defaultRiskPercent: 2,
  maxRiskPerTrade: 5,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      // Initial state
      hasSeenWelcome: false,
      experienceLevel: 'intermediate',
      favoritePairs: ['EURUSD', 'GBPUSD', 'BTCUSD'],
      preferredTimeframes: ['H1', 'D1'],
      riskSettings: defaultRiskSettings,
      
      // Actions
      setHasSeenWelcome: (seen) => set({ hasSeenWelcome: seen }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setFavoritePairs: (pairs) => set({ favoritePairs: pairs }),
      setPreferredTimeframes: (timeframes) => set({ preferredTimeframes: timeframes }),
      setRiskSettings: (settings) => set({ riskSettings: settings }),
      resetOnboarding: () => set({
        hasSeenWelcome: false,
        experienceLevel: 'intermediate',
        favoritePairs: ['EURUSD', 'GBPUSD', 'BTCUSD'],
        preferredTimeframes: ['H1', 'D1'],
        riskSettings: defaultRiskSettings,
      }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 