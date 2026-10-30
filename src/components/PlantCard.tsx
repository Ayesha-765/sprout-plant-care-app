import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { daysUntilWater, Plant, statusLabel } from '@/context/PlantsContext';

type Props = { plant: Plant; onPress: () => void };

export function PlantCard({ plant, onPress }: Props) {
  const { theme } = useTheme();
  const days = daysUntilWater(plant);
  const thirsty = days <= 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: theme.chip }]}>
        <Text style={styles.emoji}>{plant.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{plant.name}</Text>
        <Text style={{ color: theme.subtext }} numberOfLines={1}>
          {plant.species}
        </Text>
      </View>

      <View
        style={[styles.badge, { backgroundColor: thirsty ? theme.danger : theme.chip }]}
      >
        <Text style={{ color: thirsty ? '#fff' : theme.text, fontSize: 12, fontWeight: '600' }}>
          {statusLabel(days)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // RN default is column, so we set row on purpose
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    // iOS shadow + Android elevation (both needed)
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28 },
  info: { flex: 1, marginLeft: 14, marginRight: 8 },
  name: { fontSize: 17, fontWeight: '700' },
  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
});
