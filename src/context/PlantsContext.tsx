import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export type Light = 'Low' | 'Medium' | 'Bright';

export type Plant = {
  id: string;
  name: string;
  species: string;
  emoji: string;
  waterEvery: number; // days between watering
  light: Light;
  lastWatered: number; // timestamp (ms)
};

// One row exactly as it comes from the database (snake_case)
type PlantRow = {
  id: string;
  name: string;
  species: string;
  emoji: string;
  water_every: number;
  light: Light;
  last_watered: string;
};

const COLUMNS = 'id, name, species, emoji, water_every, light, last_watered';

function toPlant(row: PlantRow): Plant {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    emoji: row.emoji,
    waterEvery: row.water_every,
    light: row.light,
    lastWatered: new Date(row.last_watered).getTime(),
  };
}

const DAY = 86_400_000;

export function daysUntilWater(p: Plant) {
  return Math.ceil((p.lastWatered + p.waterEvery * DAY - Date.now()) / DAY);
}

export function statusLabel(days: number) {
  if (days <= 0) return 'Water today';
  if (days === 1) return 'Water tomorrow';
  return `Water in ${days} days`;
}

type NewPlant = Omit<Plant, 'id' | 'lastWatered'>;
type PlantChanges = Pick<Plant, 'name' | 'species' | 'emoji' | 'waterEvery' | 'light'>;

type PlantsCtx = {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  pullRefresh: () => Promise<void>;
  addPlant: (p: NewPlant) => Promise<boolean>;
  updatePlant: (id: string, changes: PlantChanges) => Promise<boolean>;
  waterPlant: (id: string) => Promise<void>;
  removePlant: (id: string) => Promise<boolean>;
  clearAll: () => Promise<void>;
};

const PlantsContext = createContext<PlantsCtx | null>(null);

export function PlantsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPlants(showSpinner: boolean) {
    if (showSpinner) setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('plants')
      .select(COLUMNS)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPlants((data ?? []).map((row) => toPlant(row as PlantRow)));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!session) {
      setPlants([]);
      return;
    }
    loadPlants(true);
  }, [session?.user.id]);
  const refresh = () => loadPlants(true);
  const pullRefresh = () => loadPlants(false); 
  const addPlant = async (p: NewPlant) => {
    const { data, error: insertError } = await supabase
      .from('plants')
      .insert({
        name: p.name,
        species: p.species,
        emoji: p.emoji,
        water_every: p.waterEvery,
        light: p.light,
      })
      .select(COLUMNS)
      .single();

    if (insertError || !data) {
      Alert.alert('Could not add plant', insertError?.message ?? 'Please try again.');
      return false;
    }
    setPlants((prev) => [toPlant(data as PlantRow), ...prev]);
    return true;
  };

  const updatePlant = async (id: string, changes: PlantChanges) => {
  const { error: updateError } = await supabase
    .from('plants')
    .update({
      name: changes.name,
      species: changes.species,
      emoji: changes.emoji,
      water_every: changes.waterEvery,
      light: changes.light,
    })
    .eq('id', id);

  if (updateError) {
    Alert.alert('Could not save changes', updateError.message);
    return false;
  }
  setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  return true;
};

  const waterPlant = async (id: string) => {
    const now = new Date();
    const { error: updateError } = await supabase
      .from('plants')
      .update({ last_watered: now.toISOString() })
      .eq('id', id);

    if (updateError) {
      Alert.alert('Could not update plant', updateError.message);
      return;
    }
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, lastWatered: now.getTime() } : p)));
  };

  const removePlant = async (id: string) => {
    const { error: deleteError } = await supabase.from('plants').delete().eq('id', id);

    if (deleteError) {
      Alert.alert('Could not remove plant', deleteError.message);
      return false;
    }
    setPlants((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const clearAll = async () => {
    if (!session) return;
    const { error: clearError } = await supabase
      .from('plants')
      .delete()
      .eq('user_id', session.user.id);

    if (clearError) {
      Alert.alert('Could not clear garden', clearError.message);
      return;
    }
    setPlants([]);
  };

  return (
    <PlantsContext.Provider
      value={{ plants, loading, error, refresh, pullRefresh, addPlant, updatePlant, waterPlant, removePlant, clearAll }}
    >
      {children}
    </PlantsContext.Provider>
  );
}

export function usePlants() {
  const ctx = useContext(PlantsContext);
  if (!ctx) throw new Error('usePlants must be used inside PlantsProvider');
  return ctx;
}