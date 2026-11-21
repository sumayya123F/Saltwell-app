import { Route, Routes } from "react-router-dom";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { EmptyState } from "@/components/states";
import { useOnline } from "@/lib/useOnline";
import Home from "@/pages/Home";
import Details from "@/pages/Details";
import Favorites from "@/pages/Favorites";

export default function App() {
  const online = useOnline();
  return (
    <>
      {/* Skip link: first focusable element, jumps past the header. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header online={online} />
      <main id="main" tabIndex={-1} className="container py-6 focus:outline-none">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meal/:id" element={<Details />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<EmptyState title="Page not found" />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <footer className="container py-6 text-center text-xs text-muted-foreground">
        Data from TheMealDB
      </footer>
      <Toaster />
    </>
  );
}
