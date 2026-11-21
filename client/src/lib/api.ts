/**
 * Proxy client. The browser ONLY talks to `/api/*` (same origin in dev via the Vite proxy,
 * or via VITE_API_BASE in production if the API lives on another origin). TheMealDB and its
 * API key are never referenced here.
 */
import { LOCAL_RECIPES, getLocalRecipe, searchLocalRecipes } from "@/features/saltwell/recipes";

const BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";

/** Summary shape shared by search results, category filters and favorites. */
export interface MealSummary {
  id: string;
  name: string;
  thumb: string;
  category?: string;
  area?: string;
}

export interface Meal extends MealSummary {
  instructions: string;
  tags: string[];
  youtube?: string;
  source?: string;
  ingredients: { name: string; measure: string }[];
}

export interface Category {
  id: string;
  name: string;
  thumb: string;
  description: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  let res: Response;
  try {
    res = await fetch(`${BASE}/api${path}${qs}`);
  } catch {
    // fetch rejects when offline / server unreachable
    throw new ApiError(0, "You appear to be offline.");
  }
  // The service worker answers 503 {error:"offline"} when the network failed and nothing is cached.
  if (res.status === 503) throw new ApiError(0, "You appear to be offline and this isn't saved on your device.");
  if (!res.ok) throw new ApiError(res.status, `Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

// ---- Raw TheMealDB shapes -> app shapes ------------------------------------
type Raw = Record<string, string | null>;

const toSummary = (r: Raw): MealSummary => ({
  id: r.idMeal ?? "",
  name: r.strMeal ?? "Untitled",
  thumb: r.strMealThumb ?? "",
  category: r.strCategory ?? undefined,
  area: r.strArea ?? undefined,
});

/** TheMealDB flattens ingredients into strIngredient1..20 / strMeasure1..20. */
const toMeal = (r: Raw): Meal => {
  const ingredients: Meal["ingredients"] = [];
  for (let i = 1; i <= 20; i++) {
    const name = r[`strIngredient${i}`]?.trim();
    if (name) ingredients.push({ name, measure: r[`strMeasure${i}`]?.trim() ?? "" });
  }
  return {
    ...toSummary(r),
    instructions: r.strInstructions ?? "",
    tags: (r.strTags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    youtube: r.strYoutube || undefined,
    source: r.strSource || undefined,
    ingredients,
  };
};

export const api = {
  async search(q: string): Promise<Meal[]> {
    const local = searchLocalRecipes(q);
    try {
      const d = await get<{ meals: Raw[] | null }>("/search", { q });
      return [...local, ...(d.meals ?? []).map(toMeal)];
    } catch (e) {
      if (local.length) return local; // Saltwell recipes still work if the API/network is down
      throw e;
    }
  },
  async meal(id: string): Promise<Meal | null> {
    const local = getLocalRecipe(id);
    if (local) return local;
    const d = await get<{ meals: Raw[] | null }>(`/meal/${encodeURIComponent(id)}`);
    return d.meals?.[0] ? toMeal(d.meals[0]) : null;
  },
  async categories(): Promise<Category[]> {
    const d = await get<{ categories: Raw[] | null }>("/categories");
    return (d.categories ?? []).map((c) => ({
      id: c.idCategory ?? "",
      name: c.strCategory ?? "",
      thumb: c.strCategoryThumb ?? "",
      description: c.strCategoryDescription ?? "",
    }));
  },
  async byCategory(c: string): Promise<MealSummary[]> {
    const local = LOCAL_RECIPES.filter((r) => r.category === c);
    const d = await get<{ meals: Raw[] | null }>("/filter", { c });
    return [...local, ...(d.meals ?? []).map((m) => ({ ...toSummary(m), category: c }))];
  },
  async random(): Promise<Meal | null> {
    const d = await get<{ meals: Raw[] | null }>("/random");
    return d.meals?.[0] ? toMeal(d.meals[0]) : null;
  },
};
