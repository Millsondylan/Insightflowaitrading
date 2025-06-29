import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { focusManager } from '@tanstack/react-query';

export function useAppState() {
  useEffect(() => {
    // Set up app state for React Query focus management
    const subscription = AppState.addEventListener('change', status => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
} 