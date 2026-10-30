import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = { label: string; selected: boolean; onPress: () => void };

export function Chip({ label, selected, onPress }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? theme.primary : theme.chip },
      ]}
    >
      <Text style={{ color: selected ? theme.primaryText : theme.text, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginRight: 8 },
});
