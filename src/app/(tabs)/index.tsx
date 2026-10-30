import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlantCard } from '@/components/PlantCard';
import { useTheme } from '@/context/ThemeContext';
import { daysUntilWater, usePlants } from '@/context/PlantsContext';

export default function GardenScreen() {
  const { theme } = useTheme();
  const { plants } = usePlants();
  const thirstyCount = plants.filter((p) => daysUntilWater(p) <= 0).length;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <FlatList
        data={plants}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.hello, { color: theme.subtext }]}>Good morning 🌱</Text>
            <Text style={[styles.title, { color: theme.text }]}>My Garden</Text>
            <View style={[styles.summary, { backgroundColor: theme.primary }]}>
              <Text style={[styles.summaryBig, { color: theme.primaryText }]}>{thirstyCount}</Text>
              <Text style={{ color: theme.primaryText, flex: 1 }}>
                {thirstyCount === 1 ? 'plant needs' : 'plants need'} water today
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.subtext }]}>
            Your garden is empty. Add a plant from the Add or Discover tab 🌿
          </Text>
        }
        renderItem={({ item }) => (
          // Like Next.js: router.push('/plant/1')
          <PlantCard plant={item} onPress={() => router.push(`/plant/${item.id}`)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  hello: { fontSize: 15 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 16 },
  summary: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, gap: 14 },
  summaryBig: { fontSize: 40, fontWeight: '800' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, lineHeight: 24 },
});
