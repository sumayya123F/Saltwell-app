/* eslint-env serviceworker */
/**
 * Manual service worker (no Workbox).
 *
 * Build step (see vite.config.ts) replaces the two double-underscore placeholders on the
 * VERSION / PRECACHE_URLS lines below and writes dist/sw.js:
 *   precache manifest -> every built file (hashed JS/CSS, icons, manifest, offline.html, "/")
 *   version           -> content hash, so each deploy gets fresh cache names.
 * (In dev the raw file is never registered.)
 *
 * Strategies
 *   - App shell / static assets : precached at install, cache-first.
 *   - Navigations               : network-first -> cached SPA shell ("/") -> /offline.html
 *   - /api/categories           : stale-while-revalidate
 *   - other /api/* (search, meal, filter): network-first with timeout -> cache fallback
 *   - Images (any origin)       : stale-while-revalidate, capped to MAX_IMAGES entries
 * To change a strategy, edit the routing in the `fetch` listener at the bottom.
 */
const VERSION = "__SW_VERSION__";
const PRECACHE_URLS = __PRECACHE_MANIFEST__;

const PRECACHE = `precache-${VERSION}`;
const API_CACHE = "api-v1";
const IMG_CACHE = "img-v1";
const KEEP = [PRECACHE, API_CACHE, IMG_CACHE];
const MAX_IMAGES = 200;
const MAX_API = 150;
const NETWORK_TIMEOUT_MS = 4000;

// ---- Lifecycle -------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((c) => c.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Drop precaches from older versions; runtime caches persist across deploys.
      for (const name of await caches.keys()) if (!KEEP.includes(name)) await caches.delete(name);
      await self.clients.claim();
    })()
  );
});

// ---- Helpers ---------------------------------------------------------------
/** Keep a cache from growing forever: delete oldest entries (insertion order). */
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

/** Opaque (cross-origin no-cors) responses have status 0 but are fine to cache for images. */
const cacheable = (res) => res && (res.ok || res.type === "opaque");

/** Tell open pages we answered from cache so they can show a friendly toast. */
async function notifyOffline() {
  for (const client of await self.clients.matchAll()) client.postMessage({ type: "SERVED_FROM_CACHE" });
}

function offlineJson() {
  return new Response(JSON.stringify({ error: "offline" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

/** Stale-while-revalidate: answer from cache immediately, refresh in the background. */
async function staleWhileRevalidate(event, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  const refresh = fetch(event.request)
    .then((res) => {
      if (cacheable(res)) {
        cache.put(event.request, res.clone()).then(() => trim(cacheName, max));
      }
      return res;
    })
    .catch(() => undefined);
  if (cached) {
    event.waitUntil(refresh); // keep SW alive until the background refresh settles
    return cached;
  }
  return (await refresh) ?? (cacheName === API_CACHE ? offlineJson() : Response.error());
}

/** Network-first: try the network (with timeout), fall back to whatever we cached. */
async function networkFirst(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), NETWORK_TIMEOUT_MS)),
    ]);
    if (res.ok) {
      cache.put(request, res.clone()).then(() => trim(cacheName, max));
    }
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      notifyOffline();
      return cached;
    }
    return offlineJson();
  }
}

/** Navigations: fresh HTML when online, otherwise the cached SPA shell, else offline.html. */
async function navigate(request) {
  try {
    return await Promise.race([
      fetch(request),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), NETWORK_TIMEOUT_MS)),
    ]);
  } catch {
    const cache = await caches.open(PRECACHE);
    // The SPA router renders any route (incl. /favorites) from the "/" shell.
    return (await cache.match("/")) || (await cache.match("/offline.html")) || Response.error();
  }
}

// ---- Routing ---------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(navigate(request));
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    if (url.pathname === "/api/categories") {
      event.respondWith(staleWhileRevalidate(event, API_CACHE, MAX_API));
    } else {
      event.respondWith(networkFirst(request, API_CACHE, MAX_API));
    }
    return;
  }

  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(event, IMG_CACHE, MAX_IMAGES));
    return;
  }

  // Same-origin static assets: serve from the precache, else network.
  // ignoreVary: precache entries were fetched with different request headers than <script type=module>
  // requests (which may carry Origin/CORS), and a `Vary` header would otherwise cause false misses.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request, { cacheName: PRECACHE, ignoreVary: true }).then((hit) => hit || fetch(request))
    );
  }
});
