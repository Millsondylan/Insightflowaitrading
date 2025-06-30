import { useTheme } from '../contexts/ThemeContext';

export default function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}

export function useThemePreference() {
  const { themePreference, setThemePreference } = useTheme();
  return { themePreference, setThemePreference };
} 