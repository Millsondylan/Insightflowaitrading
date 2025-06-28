import React, { createContext, useContext, useState, ReactNode } from 'react';

export const themes = {
  dark: 'theme-dark',
  landing: 'theme-landing',
  academy: 'theme-academy',
  portfolio: 'theme-portfolio',
  NeonWave: 'theme-community',
  strategy: 'theme-strategy',
  journal: 'theme-journal',
  markets: 'theme-markets',
  wallet: 'theme-wallet',
  admin: 'theme-admin',
  insightflow: 'theme-insightflow',
} as const;

type ThemeContextType = {
  currentTheme: keyof typeof themes;
  setTheme: (theme: keyof typeof themes) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('dark');

  const setTheme = (theme: keyof typeof themes) => {
    setCurrentTheme(theme);
    // Apply theme class to body
    document.body.className = themes[theme];
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 