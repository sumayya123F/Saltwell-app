import { Toaster as Sonner } from "sonner";

/** shadcn-style wrapper around sonner, themed via our CSS variables. */
export function Toaster() {
  const dark = document.documentElement.classList.contains("dark");
  return (
    <Sonner
      theme={dark ? "dark" : "light"}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: "group border border-border bg-background text-foreground shadow-lg",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
