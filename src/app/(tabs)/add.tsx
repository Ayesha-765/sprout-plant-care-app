import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { Chip } from '@/components/Chip';
import { Light, usePlants } from '@/context/PlantsContext';
import { useTheme } from '@/context/ThemeContext';

const EMOJIS = ['🪴', '🌿', '🌵', '🌸', '🍀', '🌺'];
const LIGHTS: Light[] = ['Low', 'Medium', 'Bright'];

export default function AddScreen() {
  const { theme } = useTheme();
  const { addPlant } = usePlants();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [waterEvery, setWaterEvery] = useState(7);
  const [light, setLight] = useState<Light>('Medium');

  const inputStyle = [styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }];

  const save = () => {
    if (!name.trim()) {
      Alert.alert('Name needed', 'Please give your plant a name.');
      return;
    }
    addPlant({ name: name.trim(), species: species.trim() || 'Unknown species', emoji, waterEvery, light });
    setName('');
    setSpecies('');
    Keyboard.dismiss();
    router.navigate('/'); // go back to the Garden tab
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: theme.text }]}>Add a plant</Text>

          <Text style={[styles.label, { color: theme.subtext }]}>Pick an icon</Text>
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
          <TextInput value={name} onChangeText={setName} placeholder="e.g. Monty" placeholderTextColor={theme.subtext} style={inputStyle} />

          <Text style={[styles.label, { color: theme.subtext }]}>Species (optional)</Text>
          <TextInput value={species} onChangeText={setSpecies} placeholder="e.g. Monstera" placeholderTextColor={theme.subtext} style={inputStyle} />

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

          <View style={{ marginTop: 28 }}>
            <AppButton title="Save plant" onPress={save} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  emojiBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepValue: { fontSize: 20, fontWeight: '700' },
});
