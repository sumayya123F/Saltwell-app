import { cn } from "@/lib/utils";

/** Pulsing placeholder block. Decorative, so hidden from assistive tech. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
