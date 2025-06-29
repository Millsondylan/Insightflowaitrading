import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

// 1. --- Theme Structure and Definitions ---

interface Theme {
  name: string;
  background: string;
  accent: string;
  text: string;
  font: string;
  glow: string;
}

export const themes = {
  landing: {
    name: 'landing',
    background: '#0a0a0f',
    accent: 'linear-gradient(45deg, #00f0ff, #ff00ea)',
    text: '#e0e0e0',
    font: "'Orbitron', sans-serif",
    glow: '0 0 15px #00f0ff, 0 0 25px #ff00ea',
  },
  academy: {
    name: 'academy',
    background: '#10101a',
    accent: 'linear-gradient(45deg, #ff00ea, #00f0ff)',
    text: '#d0d0d0',
    font: "'Space Grotesk', sans-serif",
    glow: '0 0 15px #ff00ea',
  },
  portfolio: {
    name: 'portfolio',
    background: '#0d1117',
    accent: 'linear-gradient(45deg, #00ffb8, #0078ff)',
    text: '#c9d1d9',
    font: "'Space Grotesk', sans-serif",
    glow: '0 0 15px #00ffb8',
  },
  markets: {
    name: 'markets',
    background: '#06090f',
    accent: 'linear-gradient(45deg, #00ffff, #0078ff)',
    text: '#b0c4de',
    font: "'Space Grotesk', sans-serif",
    glow: '0 0 15px #00ffff',
  },
  NeonWave: {
    name: 'NeonWave',
    background: '#0e0e23',
    accent: 'linear-gradient(45deg, #f0f, #0ff, #f0f)',
    text: '#f0f0f0',
    font: "'Orbitron', sans-serif",
    glow: '0 0 20px #f0f, 0 0 30px #0ff',
  },
  DeepBlack: {
    name: 'DeepBlack',
    background: '#000000',
    accent: 'linear-gradient(45deg, #444, #888)',
    text: '#a0a0a0',
    font: "'Inter', sans-serif",
    glow: '0 0 10px #555',
  },
  ElectricViolet: {
    name: 'ElectricViolet',
    background: '#1a0d2d',
    accent: 'linear-gradient(45deg, #9400d3, #ff00ff)',
    text: '#e6e6fa',
    font: "'Orbitron', sans-serif",
    glow: '0 0 20px #9400d3',
  },
};

export type ThemeName = keyof typeof themes;

// 2. --- Context Definition ---

type ThemeContextType = {
  theme: Theme;
  setTheme: (themeName: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>(undefined);

// 3. --- ThemeProvider Component ---

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'landing' }) => {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  const theme = themes[themeName];

  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.style.setProperty('--theme-background', theme.background);
      root.style.setProperty('--theme-accent', theme.accent);
      root.style.setProperty('--theme-text', theme.text);
      root.style.setProperty('--theme-font', theme.font);
      root.style.setProperty('--theme-glow', theme.glow);
      
      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.text;
      document.body.style.fontFamily = theme.font;

      // Add a class for theme-specific overrides
      document.body.className = `theme-${theme.name}`;
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: setThemeName,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. --- Custom Hook for Consuming Context ---

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
