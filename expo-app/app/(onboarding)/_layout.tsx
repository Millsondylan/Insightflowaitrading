import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="experience" />
        <Stack.Screen name="favorite-pairs" />
        <Stack.Screen name="timeframes" />
        <Stack.Screen name="risk-settings" />
      </Stack>
    </OnboardingProvider>
  );
} 