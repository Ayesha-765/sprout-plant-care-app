import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type ProfileCtx = {
  displayName: string;
  darkMode: boolean | null; // null = follow the phone's setting
  loading: boolean;
  saveDisplayName: (name: string) => Promise<boolean>;
  setDarkMode: (value: boolean) => Promise<void>;
};

const ProfileContext = createContext<ProfileCtx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [darkMode, setDarkModeState] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setDisplayName('');
      setDarkModeState(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('display_name, dark_mode')
        .eq('id', session!.user.id)
        .maybeSingle();

      if (cancelled) return;
      setDisplayName(data?.display_name ?? '');
      setDarkModeState(data?.dark_mode ?? null);
      setLoading(false);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const saveDisplayName = async (name: string) => {
    if (!session) return false;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, display_name: name });

    if (error) {
      Alert.alert('Could not save name', error.message);
      return false;
    }
    setDisplayName(name);
    return true;
  };

  const setDarkMode = async (value: boolean) => {
    if (!session) {
      setDarkModeState(value); // signed out: just change it for now
      return;
    }
    const previous = darkMode;
    setDarkModeState(value); // change the screen right away

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, dark_mode: value });

    if (error) {
      setDarkModeState(previous); // undo if saving failed
      Alert.alert('Could not save theme', error.message);
    }
  };

  return (
    <ProfileContext.Provider value={{ displayName, darkMode, loading, saveDisplayName, setDarkMode }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}