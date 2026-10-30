import { createContext, ReactNode, useContext, useState } from 'react';

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

const DAY = 86_400_000;

// How many days until this plant needs water (0 or less = today)
export function daysUntilWater(p: Plant) {
  return Math.ceil((p.lastWatered + p.waterEvery * DAY - Date.now()) / DAY);
}

export function statusLabel(days: number) {
  if (days <= 0) return 'Water today';
  if (days === 1) return 'Water tomorrow';
  return `Water in ${days} days`;
}

const seed: Plant[] = [
  { id: '1', name: 'Monty', species: 'Monstera', emoji: '🌿', waterEvery: 7, light: 'Medium', lastWatered: Date.now() - 6 * DAY },
  { id: '2', name: 'Sunny', species: 'Snake Plant', emoji: '🪴', waterEvery: 14, light: 'Low', lastWatered: Date.now() - 3 * DAY },
  { id: '3', name: 'Fernie', species: 'Boston Fern', emoji: '🍀', waterEvery: 3, light: 'Medium', lastWatered: Date.now() - 4 * DAY },
];

type NewPlant = Omit<Plant, 'id' | 'lastWatered'>;

type PlantsCtx = {
  plants: Plant[];
  addPlant: (p: NewPlant) => void;
  waterPlant: (id: string) => void;
  removePlant: (id: string) => void;
  clearAll: () => void;
};

const PlantsContext = createContext<PlantsCtx | null>(null);

export function PlantsProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>(seed);

  const addPlant = (p: NewPlant) =>
    setPlants((prev) => [{ ...p, id: Date.now().toString(), lastWatered: Date.now() }, ...prev]);

  const waterPlant = (id: string) =>
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, lastWatered: Date.now() } : p)));

  const removePlant = (id: string) => setPlants((prev) => prev.filter((p) => p.id !== id));

  const clearAll = () => setPlants([]);

  return (
    <PlantsContext.Provider value={{ plants, addPlant, waterPlant, removePlant, clearAll }}>
      {children}
    </PlantsContext.Provider>
  );
}

export function usePlants() {
  const ctx = useContext(PlantsContext);
  if (!ctx) throw new Error('usePlants must be used inside PlantsProvider');
  return ctx;
}
