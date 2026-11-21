import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** Horizontally-scrolling category filter. Selecting the active chip again clears it. */
export function CategoryChips({ selected, onSelect }: { selected?: string; onSelect: (c?: string) => void }) {
  const { data, isLoading } = useQuery({ queryKey: ["categories"], queryFn: api.categories, staleTime: 60 * 60_000 });

  if (isLoading) {
    return (
      <div className="flex gap-2" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-9 w-20 rounded-full" />)}
      </div>
    );
  }
  if (!data?.length) return null;

  return (
    <nav aria-label="Recipe categories">
      <ul className="flex gap-2 overflow-x-auto pb-2">
        {data.map((c) => (
          <li key={c.id}>
            <Button
              size="sm"
              variant={selected === c.name ? "default" : "outline"}
              className="rounded-full"
              aria-pressed={selected === c.name}
              onClick={() => onSelect(selected === c.name ? undefined : c.name)}
            >
              {c.name}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
