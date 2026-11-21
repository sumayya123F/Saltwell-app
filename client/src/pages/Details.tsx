import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Youtube } from "lucide-react";
import { api, type Meal } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailsSkeleton, EmptyState, ErrorState } from "@/components/states";
import { FavoriteButton } from "@/components/favorite-button";
import { getFavorite } from "@/features/favorites/db";
import { useToggleFavorite } from "@/features/favorites/useFavorites";

export default function Details() {
  const { id = "" } = useParams();
  const { isFavorite, toggle } = useToggleFavorite();

  const { data: meal, isLoading, error, refetch } = useQuery<Meal | null>({
    queryKey: ["meal", id],
    queryFn: async () => {
      try {
        return await api.meal(id);
      } catch (e) {
        // Network/SW cache miss: fall back to the copy saved with the favorite (IndexedDB).
        const fav = await getFavorite(id);
        if (fav?.detail) return fav.detail;
        throw e;
      }
    },
  });

  if (isLoading) return <DetailsSkeleton />;
  if (error) return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
  if (!meal) return <EmptyState title="Recipe not found" />;

  return (
    <article className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</Link>
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        <img src={meal.thumb} alt={`Photo of ${meal.name}`} width={700} height={700} className="w-full rounded-lg bg-muted object-cover" />

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold">{meal.name}</h1>
            {/* Saving from here stores the FULL recipe for offline use. */}
            <FavoriteButton label active={isFavorite(meal.id)} name={meal.name} onClick={() => toggle(meal)} />
          </div>

          <div className="flex flex-wrap gap-2">
            {meal.category && <Badge>{meal.category}</Badge>}
            {meal.area && <Badge variant="secondary">{meal.area}</Badge>}
            {meal.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
          </div>

          <div className="flex flex-wrap gap-2">
            {meal.youtube && (
              <Button asChild variant="outline" size="sm">
                <a href={meal.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" aria-hidden="true" /> Watch on YouTube
                </a>
              </Button>
            )}
            {meal.source && (
              <Button asChild variant="outline" size="sm">
                <a href={meal.source} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> Source
                </a>
              </Button>
            )}
          </div>

          <section aria-labelledby="ing">
            <h2 id="ing" className="mb-2 text-xl font-semibold">Ingredients</h2>
            <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              {meal.ingredients.map((i) => (
                <li key={i.name} className="flex justify-between gap-2 rounded bg-muted px-2 py-1">
                  <span>{i.name}</span>
                  <span className="text-muted-foreground">{i.measure}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="ins">
        <h2 id="ins" className="mb-2 text-xl font-semibold">Instructions</h2>
        <div className="max-w-prose space-y-3 leading-relaxed">
          {meal.instructions.split(/\r?\n/).filter((p) => p.trim()).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>
    </article>
  );
}
