import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { daysUntilWater, usePlants } from '@/context/PlantsContext';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { theme, isDark, toggle } = useTheme();
  const { plants, clearAll } = usePlants();
  const thirsty = plants.filter((p) => daysUntilWater(p) <= 0).length;

  const confirmClear = () =>
    Alert.alert('Clear garden?', 'This removes every plant.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear all', style: 'destructive', onPress: clearAll },
    ]);

  const stats: [number, string][] = [
    [plants.length, 'Plants'],
    [thirsty, 'Thirsty'],
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={[styles.avatar, { backgroundColor: theme.chip }]}>
          <Text style={{ fontSize: 44 }}>🧑‍🌾</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>Plant Parent</Text>

        <View style={styles.stats}>
          {stats.map(([value, label]) => (
            <View key={label} style={[styles.stat, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
              <Text style={{ color: theme.subtext }}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.setting, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>Dark mode</Text>
          <Switch value={isDark} onValueChange={toggle} trackColor={{ true: theme.primary }} />
        </View>

        <View style={{ marginTop: 24 }}>
          <AppButton title="Clear my garden" variant="danger" onPress={confirmClear} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, alignItems: 'stretch' },
  avatar: { alignSelf: 'center', width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  name: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginVertical: 14 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  stat: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1 },
  statValue: { fontSize: 30, fontWeight: '800' },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1 },
});
