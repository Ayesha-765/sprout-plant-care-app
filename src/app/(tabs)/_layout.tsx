import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type IconName = ComponentProps<typeof Ionicons>['name'];

// Returns a tabBarIcon function for the given icon name
const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={color as string} />
  );

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Garden', tabBarIcon: tabIcon('leaf') }} />
      <Tabs.Screen name="explore" options={{ title: 'Discover', tabBarIcon: tabIcon('compass') }} />
      <Tabs.Screen name="add" options={{ title: 'Add', tabBarIcon: tabIcon('add-circle') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}