import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (loading) return;

    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }

    // Confirm email ON: Supabase hides duplicates, so we check for empty identities
    if (data.user && data.user.identities?.length === 0) {
      Alert.alert('Account exists', 'An account with this email already exists. Please sign in instead.');
      return;
    }

    if (!data.session) {
      Alert.alert('Check your email', 'We sent you a link to confirm your account.');
    }
    // If a session came back, the root layout moves us to the Garden automatically.
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={[styles.title, { color: theme.text }]}>Create your garden</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Sign up to start tracking your plants
        </Text>

        <TextInput
          style={inputStyle}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={theme.subtext}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={inputStyle}
          value={password}
          onChangeText={setPassword}
          placeholder="Password (min 6 characters)"
          placeholderTextColor={theme.subtext}
          secureTextEntry
          autoCapitalize="none"
        />

        <AppButton title={loading ? 'Creating...' : 'Sign up'} onPress={handleSignUp} />

        <Text style={[styles.footer, { color: theme.subtext }]}>
          Already have an account?{' '}
          <Link href="/sign-in" replace style={{ color: theme.primary, fontWeight: '700' }}>
            Sign in
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 56, textAlign: 'center' },
  title: { fontSize: 30, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 28 },
  input: { borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 12 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 15 },
});