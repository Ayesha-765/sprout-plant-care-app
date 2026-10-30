import { Light } from '@/context/PlantsContext';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type CatalogItem = {
  id: string;
  name: string;
  species: string;
  emoji: string;
  difficulty: Difficulty;
  waterEvery: number;
  light: Light;
  tip: string;
};

export const catalog: CatalogItem[] = [
  { id: 'c1', name: 'Aloe Vera', species: 'Aloe barbadensis', emoji: '🌵', difficulty: 'Easy', waterEvery: 14, light: 'Bright', tip: 'Let the soil dry fully between waterings.' },
  { id: 'c2', name: 'Pothos', species: 'Epipremnum aureum', emoji: '🌿', difficulty: 'Easy', waterEvery: 7, light: 'Low', tip: 'Forgiving and fast-growing. Great for beginners.' },
  { id: 'c3', name: 'Peace Lily', species: 'Spathiphyllum', emoji: '🌸', difficulty: 'Medium', waterEvery: 5, light: 'Medium', tip: 'Droops when thirsty, so it tells you when to water.' },
  { id: 'c4', name: 'Fiddle Leaf Fig', species: 'Ficus lyrata', emoji: '🍀', difficulty: 'Hard', waterEvery: 7, light: 'Bright', tip: 'Dislikes being moved. Keep it in one bright spot.' },
  { id: 'c5', name: 'Spider Plant', species: 'Chlorophytum', emoji: '🪴', difficulty: 'Easy', waterEvery: 6, light: 'Medium', tip: 'Produces baby plants you can re-pot.' },
  { id: 'c6', name: 'Orchid', species: 'Phalaenopsis', emoji: '🌺', difficulty: 'Hard', waterEvery: 7, light: 'Medium', tip: 'Water the roots, not the leaves.' },
];
