const CACHE = "pantree-v35";
const FILES = ["./", "index.html", "style.css", "app.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon-v2.png", "apple-touch-icon.png", "icons/favicon-32.png", "img/sw-chicken-tikka-masala.jpg", "img/sw-fish-tacos.jpg", "img/sw-grilled-salmon.jpg", "img/sw-lasagne.jpg", "img/sw-spaghetti-carbonara.jpg"];

// Cache each file on its own so one bad file can't stop the app from installing offline.
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(FILES.map((f) => fetch(f, { cache: "reload" }).then((r) => { if (r.ok) return c.put(f, r); })))
    )
  );
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// Network first, so updates show up straight away; the saved copy is used when offline.
// Covers pages, files, images and the recipe list (GET /api/recipes). Saving changes (POST) is never touched.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req, { ignoreSearch: true });
        if (hit) return hit;
        if (req.mode === "navigate") return (await caches.match("index.html")) || (await caches.match("./"));
        return Response.error();
      })
  );
});
