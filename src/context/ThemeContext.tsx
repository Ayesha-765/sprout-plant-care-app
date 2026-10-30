import { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { palette, Theme } from '@/constants/colors';

type ThemeCtx = { theme: Theme; isDark: boolean; toggle: () => void };

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme(); // phone's light/dark setting
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  const mode = override ?? system ?? 'light';
  const isDark = mode === 'dark';

  const value: ThemeCtx = {
    theme: palette[mode],
    isDark,
    toggle: () => setOverride(isDark ? 'light' : 'dark'),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
