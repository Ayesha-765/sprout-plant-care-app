import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { Chip } from '@/components/Chip';
import { CatalogItem, Difficulty, fetchCatalog } from '@/data/catalog';
import { usePlants } from '@/context/PlantsContext';
import { useTheme } from '@/context/ThemeContext';

const FILTERS: ('All' | Difficulty)[] = ['All', 'Easy', 'Medium', 'Hard'];

export default function ExploreScreen() {
  const { theme } = useTheme();
  const { addPlant } = usePlants();

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Difficulty>('All');

  async function load() {
    setLoading(true);
    setError(null);
    const result = await fetchCatalog();
    setCatalog(result.items);
    setError(result.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const results = catalog.filter(
    (c) =>
      (filter === 'All' || c.difficulty === filter) &&
      c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: theme.text }]}>Discover</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search plants..."
          placeholderTextColor={theme.subtext}
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, flexGrow: 0 }}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.subtext }]}>{error}</Text>
          <AppButton title="Retry" onPress={load} />
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={results}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <Text style={{ color: theme.subtext, textAlign: 'center', marginTop: 30 }}>
              No plants found.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                <Text style={{ color: theme.subtext, marginBottom: 6 }}>
                  {item.difficulty} · every {item.waterEvery} days · {item.light} light
                </Text>
                <Text style={{ color: theme.text, marginBottom: 12 }}>{item.tip}</Text>
                <AppButton
                  title="Add to my garden"
                  variant="ghost"
                  onPress={async () => {
                    const ok = await addPlant({
                      name: item.name,
                      species: item.species,
                      emoji: item.emoji,
                      waterEvery: item.waterEvery,
                      light: item.light,
                    });
                    if (ok) Alert.alert('Added 🌱', `${item.name} is now in your garden.`);
                  }}
                />
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  top: { paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { textAlign: 'center', marginBottom: 16 },
  list: { padding: 20, paddingBottom: 40 },
  card: { flexDirection: 'row', gap: 14, padding: 16, borderRadius: 18, borderWidth: 1 },
  emoji: { fontSize: 36 },
  name: { fontSize: 18, fontWeight: '700' },
});