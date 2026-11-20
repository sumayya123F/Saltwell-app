import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, Search, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Header({ online }: { online: boolean }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  // Keep the box in sync when the URL changes (back button, chip click).
  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/?q=${encodeURIComponent(term)}` : "/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex flex-wrap items-center gap-3 py-3">
        <Link to="/" className="text-xl font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          🍲 Recipes
        </Link>

        <form role="search" onSubmit={submit} className="order-last flex w-full gap-2 sm:order-none sm:w-auto sm:flex-1 sm:max-w-md">
          <label htmlFor="search" className="sr-only">Search recipes by name</label>
          <Input id="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search recipes…" />
          <Button type="submit" size="icon" aria-label="Search">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </form>

        <nav aria-label="Main" className="ml-auto flex items-center gap-1">
          {!online && (
            <span className="mr-1 flex items-center gap-1 text-xs text-muted-foreground" role="status">
              <WifiOff className="h-4 w-4" aria-hidden="true" /> Offline
            </span>
          )}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              cn("inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", isActive && "bg-accent")
            }
          >
            <Heart className="h-4 w-4" aria-hidden="true" /> Favorites
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
