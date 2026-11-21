import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorite-button";
import type { MealSummary } from "@/lib/api";

interface Props {
  meal: MealSummary;
  favorite: boolean;
  onToggle: () => void;
  /** Extra control rendered next to the heart (e.g. nothing by default). */
}

export function MealCard({ meal, favorite, onToggle }: Props) {
  return (
    <Card className="group relative overflow-hidden focus-within:ring-2 focus-within:ring-ring">
      <Link to={`/meal/${meal.id}`} className="block focus-visible:outline-none">
        {/* Thumbnail; alt text names the dish. Width/height avoid layout shift. */}
        <img
          src={meal.thumb ? `${meal.thumb}/preview` : ""}
          alt={`Photo of ${meal.name}`}
          width={400}
          height={300}
          loading="lazy"
          className="aspect-[4/3] w-full bg-muted object-cover transition-transform group-hover:scale-105"
        />
        <CardContent className="space-y-2">
          <CardTitle className="line-clamp-2 pr-10">{meal.name}</CardTitle>
          <div className="flex flex-wrap gap-1">
            {meal.category && <Badge variant="secondary">{meal.category}</Badge>}
            {meal.area && <Badge variant="outline">{meal.area}</Badge>}
          </div>
        </CardContent>
      </Link>
      <FavoriteButton active={favorite} name={meal.name} onClick={onToggle} className="absolute right-2 top-2" />
    </Card>
  );
}
