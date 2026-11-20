import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...p }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...p} />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...p }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...p} />
));
CardContent.displayName = "CardContent";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, children, ...p }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-tight tracking-tight", className)} {...p}>{children}</h3>
));
CardTitle.displayName = "CardTitle";

export { Card, CardContent, CardTitle };
