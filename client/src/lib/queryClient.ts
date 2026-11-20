import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

/**
 * Shared React Query client.
 * - Retries transient failures (not 4xx, not offline) with exponential backoff.
 * - `networkMode: "offlineFirst"` runs the queryFn even when offline, so the service worker
 *   cache can answer instead of React Query pausing the request.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      retry: (count, err) => {
        if (err instanceof ApiError && (err.status === 0 || (err.status >= 400 && err.status < 500))) return false;
        return count < 2;
      },
      retryDelay: (n) => Math.min(1000 * 2 ** n, 8000),
    },
  },
});
