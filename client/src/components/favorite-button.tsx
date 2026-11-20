import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  active: boolean;
  name: string;
  onClick: () => void;
  className?: string;
  label?: boolean;
}

/** Toggle button; `aria-pressed` exposes state to screen readers. */
export function FavoriteButton({ active, name, onClick, className, label }: Props) {
  return (
    <Button
      type="button"
      variant={label ? (active ? "default" : "outline") : "secondary"}
      size={label ? "default" : "icon"}
      aria-pressed={active}
      aria-label={`${active ? "Remove" : "Add"} ${name} ${active ? "from" : "to"} favorites`}
      onClick={onClick}
      className={className}
    >
      <Heart className={cn("h-5 w-5", active && "fill-current")} aria-hidden="true" />
      {label && (active ? "Saved" : "Save")}
    </Button>
  );
}
