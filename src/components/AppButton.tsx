import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
};

export function AppButton({ title, onPress, variant = 'primary' }: Props) {
  const { theme } = useTheme();

  const bg = variant === 'primary' ? theme.primary : 'transparent';
  const color =
    variant === 'primary' ? theme.primaryText : variant === 'danger' ? theme.danger : theme.primary;
  const borderColor = variant === 'danger' ? theme.danger : theme.primary;

  return (
    <Pressable
      onPress={onPress}
      // Pressable gives us `pressed` - a style function, like :active in CSS
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderColor },
        variant === 'primary' && { borderWidth: 0 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.label, { color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  label: { fontSize: 16, fontWeight: '600' },
});
