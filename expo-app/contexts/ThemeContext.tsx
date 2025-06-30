import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native-appearance';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  themePreference: ColorScheme;
  setThemePreference: (preference: ColorScheme) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [themePreference, setThemePreference] = useState<ColorScheme>('system');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() || 'dark'
  );
  
  // Load stored theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem('themePreference');
        if (storedPreference) {
          setThemePreference(storedPreference as ColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Update color scheme based on preference
  useEffect(() => {
    if (themePreference === 'system') {
      setColorScheme(Appearance.getColorScheme() || 'dark');
      
      // Listen for system theme changes
      const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
        if (newColorScheme) {
          setColorScheme(newColorScheme);
        }
      });
      
      return () => {
        subscription.remove();
      };
    } else {
      setColorScheme(themePreference);
    }
  }, [themePreference]);
  
  // Save theme preference
  const saveThemePreference = async (preference: ColorScheme) => {
    try {
      await AsyncStorage.setItem('themePreference', preference);
      setThemePreference(preference);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  // Toggle between light and dark (ignoring system)
  const toggleColorScheme = () => {
    const newPreference = colorScheme === 'dark' ? 'light' : 'dark';
    saveThemePreference(newPreference);
  };
  
  return (
    <ThemeContext.Provider 
      value={{
        colorScheme,
        themePreference,
        setThemePreference: saveThemePreference,
        toggleColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 