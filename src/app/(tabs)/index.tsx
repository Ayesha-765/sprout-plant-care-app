import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { PlantCard } from '@/components/PlantCard';
import { daysUntilWater, usePlants } from '@/context/PlantsContext';
import { useTheme } from '@/context/ThemeContext';

export default function GardenScreen() {
  const { theme } = useTheme();
  const { plants, loading, error, refresh, pullRefresh } = usePlants();
  const [refreshing, setRefreshing] = useState(false);
  const thirstyCount = plants.filter((p) => daysUntilWater(p) <= 0).length;

  const onPullRefresh = async () => {
    setRefreshing(true);
    await pullRefresh();
    setRefreshing(false);
  };

  // 1) Still loading from Supabase: show a spinner
  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.subtext, marginTop: 12 }}>Loading your garden...</Text>
      </SafeAreaView>
    );
  }

  // 2) Something failed: show the message and a Retry button
  if (error) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorTitle, { color: theme.text }]}>Something went wrong</Text>
        <Text style={[styles.errorText, { color: theme.subtext }]}>{error}</Text>
        <AppButton title="Retry" onPress={refresh} />
      </SafeAreaView>
    );
  }

  // 3) Everything is fine: show the garden
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <FlatList
        data={plants}
        refreshing={refreshing}
        onRefresh={onPullRefresh}
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
          <PlantCard plant={item} onPress={() => router.push(`/plant/${item.id}`)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  errorText: { textAlign: 'center', marginBottom: 16 },
  list: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  hello: { fontSize: 15 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 16 },
  summary: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, gap: 14 },
  summaryBig: { fontSize: 40, fontWeight: '800' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, lineHeight: 24 },
});