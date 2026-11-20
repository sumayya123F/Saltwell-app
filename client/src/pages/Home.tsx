import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { CategoryChips } from "@/components/category-chips";
import { MealCard } from "@/components/meal-card";
import { EmptyState, ErrorState, GridSkeleton } from "@/components/states";
import { useToggleFavorite } from "@/features/favorites/useFavorites";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("c") ?? undefined;
  const { isFavorite, toggle } = useToggleFavorite();

  // A category filter wins over text search; otherwise search (empty q = TheMealDB's default list).
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: category ? ["category", category] : ["search", q],
    queryFn: () => (category ? api.byCategory(category) : api.search(q)),
  });

  const heading = category ? `${category} recipes` : q ? `Results for “${q}”` : "Browse recipes";

  return (
    <div className="space-y-6">
      <CategoryChips selected={category} onSelect={(c) => setParams(c ? { c } : {})} />
      <h1 className="text-2xl font-bold">{heading}</h1>

      {isLoading ? (
        <GridSkeleton />
      ) : error ? (
        <ErrorState message={(error as Error).message} onRetry={() => refetch()} />
      ) : !data?.length ? (
        <EmptyState title="No recipes found">Try another search term or category.</EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((m) => (
            <li key={m.id}>
              <MealCard meal={m} favorite={isFavorite(m.id)} onToggle={() => toggle(m)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
