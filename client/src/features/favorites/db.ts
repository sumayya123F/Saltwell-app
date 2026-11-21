import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Meal, MealSummary } from "@/lib/api";

/**
 * Favorites live in IndexedDB so they work with no network at all.
 * Key = meal id. We also keep the full recipe (`detail`) when we have it, so a favorited
 * recipe's Details page can render offline even if the SW cache was evicted.
 */
export interface FavoriteMeal extends MealSummary {
  savedAt: number;
  detail?: Meal;
}

interface FavoritesDB extends DBSchema {
  favorites: { key: string; value: FavoriteMeal; indexes: { "by-savedAt": number } };
}

let dbPromise: Promise<IDBPDatabase<FavoritesDB>> | null = null;

/** Lazily open (and on first run create) the database. */
function db() {
  dbPromise ??= openDB<FavoritesDB>("recipes-pwa", 1, {
    upgrade(d) {
      const store = d.createObjectStore("favorites", { keyPath: "id" });
      store.createIndex("by-savedAt", "savedAt");
    },
  });
  return dbPromise;
}

/** Add or overwrite a favorite. Pass a full `Meal` to keep the recipe offline. */
export async function saveFavorite(meal: MealSummary | Meal): Promise<void> {
  const existing = await getFavorite(meal.id);
  const detail = "ingredients" in meal ? meal : existing?.detail;
  const { id, name, thumb, category, area } = meal;
  await (await db()).put("favorites", {
    id, name, thumb,
    category: category ?? existing?.category,
    area: area ?? existing?.area,
    savedAt: existing?.savedAt ?? Date.now(),
    detail,
  });
}

export async function removeFavorite(id: string): Promise<void> {
  await (await db()).delete("favorites", id);
}

export async function getFavorite(id: string): Promise<FavoriteMeal | undefined> {
  return (await db()).get("favorites", id);
}

/** Newest first. */
export async function getAllFavorites(): Promise<FavoriteMeal[]> {
  const all = await (await db()).getAll("favorites");
  return all.sort((a, b) => b.savedAt - a.savedAt);
}

export async function clearFavorites(): Promise<void> {
  await (await db()).clear("favorites");
}
