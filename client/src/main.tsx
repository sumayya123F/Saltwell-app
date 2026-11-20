import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import { toast } from "sonner";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// Register the service worker in production builds only (dev HMR + SW caching don't mix).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((e) => console.error("SW registration failed", e));
  });
}

// The SW tells us when it answered an API call from cache because the network failed.
navigator.serviceWorker?.addEventListener("message", (e) => {
  if (e.data?.type === "SERVED_FROM_CACHE") {
    toast.info("Showing saved data", { description: "Can't reach the network right now.", id: "sw-cache" });
  }
});
