import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Meal, MealSummary } from "@/lib/api";
import { clearFavorites, getAllFavorites, removeFavorite, saveFavorite } from "./db";

const KEY = ["favorites"];

/** All favorites. `networkMode: "always"` because IndexedDB needs no network. */
export function useFavorites() {
  return useQuery({ queryKey: KEY, queryFn: getAllFavorites, networkMode: "always", staleTime: Infinity });
}

/** Toggle helper shared by cards and the details page. */
export function useToggleFavorite() {
  const qc = useQueryClient();
  const { data: favs = [] } = useFavorites();
  const ids = new Set(favs.map((f) => f.id));

  const m = useMutation({
    networkMode: "always",
    mutationFn: async ({ meal, on }: { meal: MealSummary | Meal; on: boolean }) => {
      if (on) await saveFavorite(meal);
      else await removeFavorite(meal.id);
    },
    onSuccess: (_d, { meal, on }) => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success(on ? `Saved "${meal.name}"` : `Removed "${meal.name}"`);
    },
    onError: () => toast.error("Could not update favorites."),
  });

  return {
    isFavorite: (id: string) => ids.has(id),
    toggle: (meal: MealSummary | Meal) => m.mutate({ meal, on: !ids.has(meal.id) }),
  };
}

export function useClearFavorites() {
  const qc = useQueryClient();
  return useMutation({
    networkMode: "always",
    mutationFn: clearFavorites,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("All favorites removed");
    },
  });
}
