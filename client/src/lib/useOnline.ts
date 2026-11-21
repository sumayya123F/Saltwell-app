import { useEffect, useState } from "react";
import { toast } from "sonner";

/** Tracks connectivity and shows friendly toasts when it changes. */
export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const off = () => {
      setOnline(false);
      toast.warning("You're offline", { description: "Showing saved and cached recipes.", id: "net" });
    };
    const on = () => {
      setOnline(true);
      toast.success("Back online", { id: "net" });
    };
    if (!navigator.onLine) off();
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    return () => {
      window.removeEventListener("offline", off);
      window.removeEventListener("online", on);
    };
  }, []);
  return online;
}
