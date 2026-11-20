import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MealCard } from "@/components/meal-card";
import { EmptyState, GridSkeleton } from "@/components/states";
import { useClearFavorites, useFavorites, useToggleFavorite } from "@/features/favorites/useFavorites";

type Sort = "recent" | "name";

/** Reads exclusively from IndexedDB, so it works with no network. */
export default function Favorites() {
  const { data: favs, isLoading } = useFavorites();
  const { toggle } = useToggleFavorite();
  const clear = useClearFavorites();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  const shown = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const list = (favs ?? []).filter((m) => !f || m.name.toLowerCase().includes(f) || m.category?.toLowerCase().includes(f));
    return sort === "name" ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list; // db already newest-first
  }, [favs, filter, sort]);

  if (isLoading) return <GridSkeleton count={4} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold">Favorites {favs?.length ? `(${favs.length})` : ""}</h1>

        {!!favs?.length && (
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="fav-filter" className="sr-only">Filter favorites</label>
            <Input id="fav-filter" className="w-48" placeholder="Filter…" value={filter} onChange={(e) => setFilter(e.target.value)} />

            <label htmlFor="fav-sort" className="sr-only">Sort favorites</label>
            <select
              id="fav-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="recent">Recently saved</option>
              <option value="name">Name (A–Z)</option>
            </select>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><Trash2 className="h-4 w-4" aria-hidden="true" /> Remove all</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Remove all favorites?</DialogTitle>
                <DialogDescription>This deletes every saved recipe from this device.</DialogDescription>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <DialogClose asChild><Button variant="destructive" onClick={() => clear.mutate()}>Remove all</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {!favs?.length ? (
        <EmptyState title="No favorites yet">
          Tap the heart on any recipe to save it. <Link to="/" className="text-primary underline">Browse recipes</Link>
        </EmptyState>
      ) : !shown.length ? (
        <EmptyState title="No matches">No favorites match “{filter}”.</EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((m) => (
            <li key={m.id}>
              <MealCard meal={m} favorite onToggle={() => toggle(m)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
