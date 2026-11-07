import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { useAuth } from '@/context/AuthContext';
import { daysUntilWater, usePlants } from '@/context/PlantsContext';
import { useProfile } from '@/context/ProfileContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { theme, isDark, toggle } = useTheme();
  const { session } = useAuth();
  const { displayName, saveDisplayName } = useProfile();
  const { plants, clearAll } = usePlants();

  const [nameInput, setNameInput] = useState(displayName);
  const [saving, setSaving] = useState(false);

  // When the saved name arrives from Supabase, show it in the box
  useEffect(() => {
    setNameInput(displayName);
  }, [displayName]);

  const email = session?.user.email ?? '';
  const shownName = displayName || email.split('@')[0] || 'Plant Parent';
  const thirsty = plants.filter((p) => daysUntilWater(p) <= 0).length;

  const handleSaveName = async () => {
    if (saving) return;
    setSaving(true);
    const ok = await saveDisplayName(nameInput.trim());
    setSaving(false);
    if (ok) Alert.alert('Saved', 'Your name was updated.');
  };

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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.avatar, { backgroundColor: theme.chip }]}>
          <Text style={{ fontSize: 44 }}>🧑‍🌾</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{shownName}</Text>
        <Text style={[styles.email, { color: theme.subtext }]}>{email}</Text>

        <View style={styles.stats}>
          {stats.map(([value, label]) => (
            <View key={label} style={[styles.stat, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
              <Text style={{ color: theme.subtext }}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.subtext }]}>Display name</Text>
        <TextInput
          value={nameInput}
          onChangeText={setNameInput}
          placeholder="Your name"
          placeholderTextColor={theme.subtext}
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        />
        <AppButton title={saving ? 'Saving...' : 'Save name'} variant="ghost" onPress={handleSaveName} />

        <View style={[styles.setting, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>Dark mode</Text>
          <Switch value={isDark} onValueChange={toggle} trackColor={{ true: theme.primary }} />
        </View>

        <View style={{ marginTop: 24, gap: 12 }}>
          <AppButton title="Sign out" variant="ghost" onPress={() => supabase.auth.signOut()} />
          <AppButton title="Clear my garden" variant="danger" onPress={confirmClear} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, alignItems: 'stretch' },
  avatar: { alignSelf: 'center', width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  name: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginTop: 14 },
  email: { textAlign: 'center', marginBottom: 14 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  stat: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1 },
  statValue: { fontSize: 30, fontWeight: '800' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 12 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1, marginTop: 20 },
});