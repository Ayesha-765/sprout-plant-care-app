import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PlantsProvider } from '@/context/PlantsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function Navigator() {
  const { theme, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="plant/[id]" options={{ title: 'Plant details' }} />
      </Stack>
    </>
  );
}

// Providers wrap the whole app, similar to layout.tsx in Next.js
export default function RootLayout() {
  return (
    <ThemeProvider>
      <PlantsProvider>
        <Navigator />
      </PlantsProvider>
    </ThemeProvider>
  );
}
