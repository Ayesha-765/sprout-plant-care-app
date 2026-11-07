import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppButton } from '@/components/AppButton';
import { Chip } from '@/components/Chip';
import { Light, usePlants } from '@/context/PlantsContext';
import { useTheme } from '@/context/ThemeContext';

const EMOJIS = ['🪴', '🌿', '🌵', '🌸', '🍀', '🌺'];
const LIGHTS: Light[] = ['Low', 'Medium', 'Bright'];

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { plants, updatePlant } = usePlants();
  const plant = plants.find((p) => p.id === id);

  // Start the form with the plant's current values
  const [name, setName] = useState(plant?.name ?? '');
  const [species, setSpecies] = useState(plant?.species ?? '');
  const [emoji, setEmoji] = useState(plant?.emoji ?? EMOJIS[0]);
  const [waterEvery, setWaterEvery] = useState(plant?.waterEvery ?? 7);
  const [light, setLight] = useState<Light>(plant?.light ?? 'Medium');
  const [saving, setSaving] = useState(false);

  if (!plant) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, fontSize: 18 }}>Plant not found 🥀</Text>
      </View>
    );
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
  ];

  const save = async () => {
    if (saving) return;
    if (!name.trim()) {
      Alert.alert('Name needed', 'Please give your plant a name.');
      return;
    }

    setSaving(true);
    const ok = await updatePlant(plant.id, {
      name: name.trim(),
      species: species.trim() || 'Unknown species',
      emoji,
      waterEvery,
      light,
    });
    setSaving(false);

    if (!ok) return;
    Keyboard.dismiss();
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: theme.subtext }]}>Icon</Text>
        <View style={styles.row}>
          {EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              style={[
                styles.emojiBtn,
                { backgroundColor: theme.chip },
                emoji === e && { borderColor: theme.primary },
              ]}
            >
              <Text style={{ fontSize: 26 }}>{e}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.subtext }]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Monty"
          placeholderTextColor={theme.subtext}
          style={inputStyle}
        />

        <Text style={[styles.label, { color: theme.subtext }]}>Species</Text>
        <TextInput
          value={species}
          onChangeText={setSpecies}
          placeholder="e.g. Monstera"
          placeholderTextColor={theme.subtext}
          style={inputStyle}
        />

        <Text style={[styles.label, { color: theme.subtext }]}>Water every</Text>
        <View style={styles.stepper}>
          <AppButton title="−" variant="ghost" onPress={() => setWaterEvery((n) => Math.max(1, n - 1))} />
          <Text style={[styles.stepValue, { color: theme.text }]}>{waterEvery} days</Text>
          <AppButton title="+" variant="ghost" onPress={() => setWaterEvery((n) => Math.min(30, n + 1))} />
        </View>

        <Text style={[styles.label, { color: theme.subtext }]}>Light</Text>
        <View style={styles.row}>
          {LIGHTS.map((l) => (
            <Chip key={l} label={l} selected={light === l} onPress={() => setLight(l)} />
          ))}
        </View>

        <View style={{ marginTop: 28, gap: 12 }}>
          <AppButton title={saving ? 'Saving...' : 'Save changes'} onPress={save} />
          <AppButton title="Cancel" variant="ghost" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  emojiBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepValue: { fontSize: 20, fontWeight: '700' },
});