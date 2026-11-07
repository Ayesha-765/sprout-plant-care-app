import { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { palette, Theme } from '@/constants/colors';
import { useProfile } from '@/context/ProfileContext';

type ThemeCtx = { theme: Theme; isDark: boolean; toggle: () => void };

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const { darkMode, setDarkMode } = useProfile();

  // Saved choice wins; if there is none, follow the phone
  const isDark = darkMode === null ? system === 'dark' : darkMode;

  const value: ThemeCtx = {
    theme: isDark ? palette.dark : palette.light,
    isDark,
    toggle: () => setDarkMode(!isDark),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}