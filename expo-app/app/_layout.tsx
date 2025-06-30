import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from '@/components/ui/View';

// Contexts
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { QueryClientProvider } from '@/contexts/QueryClientContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

// Supabase auth setup
import '@/lib/supabase';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <I18nProvider>
            <QueryClientProvider>
              <OnboardingProvider>
                <View style={{ flex: 1 }}>
                  <StatusBar style="auto" />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(onboarding)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="market/[symbol]" />
                    <Stack.Screen name="strategy/builder" />
                    <Stack.Screen name="subscription/crypto-payment" />
                  </Stack>
                </View>
              </OnboardingProvider>
            </QueryClientProvider>
          </I18nProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 