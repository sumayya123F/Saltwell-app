import type { ReactNode } from "react";
import { AlertCircle, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <UtensilsCrossed className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && <div className="text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 py-16 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
      <h2 className="text-lg font-semibold">Couldn't load recipes</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Retry</Button>}
      {/* No cached data and no network: point to the static offline page. */}
      {!navigator.onLine && <a href="/offline.html" className="text-sm text-primary underline">Open offline page</a>}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <CardContent className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading recipes" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading recipe" className="grid gap-6 md:grid-cols-2">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-4 w-full" />)}
      </div>
    </div>
  );
}
