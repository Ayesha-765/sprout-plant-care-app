import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (loading) return;
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) Alert.alert('Sign in failed', error.message);
    // On success we do nothing: the session changes and the root layout shows the tabs.
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={[styles.title, { color: theme.text }]}>Sprout</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Sign in to your garden</Text>

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
          placeholder="Password"
          placeholderTextColor={theme.subtext}
          secureTextEntry
          autoCapitalize="none"
        />

        <AppButton title={loading ? 'Signing in...' : 'Sign in'} onPress={handleSignIn} />

        <Text style={[styles.footer, { color: theme.subtext }]}>
          New here?{' '}
          <Link href="/sign-up" replace style={{ color: theme.primary, fontWeight: '700' }}>
            Create an account
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
  title: { fontSize: 34, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 28 },
  input: { borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 12 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 15 },
});