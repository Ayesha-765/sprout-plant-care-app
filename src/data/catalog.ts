import { Light } from "@/context/PlantsContext";
import { supabase } from "@/lib/supabase";

export type Difficulty = "Easy" | "Medium" | "Hard";

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

// One row exactly as it comes from the database (snake_case)
type CatalogRow = {
  id: string;
  name: string;
  species: string;
  emoji: string;
  difficulty: Difficulty;
  water_every: number;
  light: Light;
  tip: string;
};

export async function fetchCatalog(): Promise<{
  items: CatalogItem[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("catalog_plants")
    .select("id, name, species, emoji, difficulty, water_every, light, tip")
    .order("name");

  if (error) return { items: [], error: error.message };

  const items = (data as CatalogRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    species: row.species,
    emoji: row.emoji,
    difficulty: row.difficulty,
    waterEvery: row.water_every,
    light: row.light,
    tip: row.tip,
  }));

  return { items, error: null };
}
