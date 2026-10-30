import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { daysUntilWater, usePlants, statusLabel } from '@/context/PlantsContext';
import { useTheme } from '@/context/ThemeContext';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // like params in Next.js
  const { theme } = useTheme();
  const { plants, waterPlant, removePlant } = usePlants();
  const plant = plants.find((p) => p.id === id);

  if (!plant) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.text, fontSize: 18 }}>Plant not found 🥀</Text>
      </View>
    );
  }

  const confirmRemove = () =>
    Alert.alert('Remove plant?', `${plant.name} will be removed from your garden.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removePlant(plant.id);
          router.back();
        },
      },
    ]);

  const rows: [string, string][] = [
    ['Species', plant.species],
    ['Watering', `Every ${plant.waterEvery} days`],
    ['Light', plant.light],
    ['Next watering', statusLabel(daysUntilWater(plant))],
  ];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: plant.name }} />

      <View style={[styles.hero, { backgroundColor: theme.chip }]}>
        <Text style={styles.heroEmoji}>{plant.emoji}</Text>
      </View>
      <Text style={[styles.name, { color: theme.text }]}>{plant.name}</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {rows.map(([label, value], i) => (
          <View
            key={label}
            style={[styles.row, i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}
          >
            <Text style={{ color: theme.subtext }}>{label}</Text>
            <Text style={{ color: theme.text, fontWeight: '600' }}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 12, marginTop: 24 }}>
        <AppButton title="💧 I watered it" onPress={() => waterPlant(plant.id)} />
        <AppButton title="Remove plant" variant="danger" onPress={confirmRemove} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, alignItems: 'stretch' },
  hero: { alignSelf: 'center', width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  heroEmoji: { fontSize: 72 },
  name: { fontSize: 30, fontWeight: '800', textAlign: 'center', marginVertical: 16 },
  card: { borderRadius: 18, borderWidth: 1, paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
});
