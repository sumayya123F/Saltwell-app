const CACHE = "pantree-v70";
const FILES = ["./", "index.html", "style.css", "app.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon-v2.png", "apple-touch-icon.png", "icons/favicon-32.png", "img/fluffy-pancakes.jpg", "img/lupis.jpg", "img/paczki.jpg", "img/tiramisu.jpg", "img/banana-sour-cream-cheese-cake.jpg", "img/katsu-chicken-curry.jpg", "img/sw-chicken-tikka-masala.jpg", "img/sw-fish-tacos.jpg", "img/sw-grilled-salmon.jpg", "img/sw-lasagne.jpg", "img/sw-spaghetti-carbonara.jpg", "img/san-sebastian-cheesecake.jpg", "img/taiyaki.jpg", "img/peanut-butter-cheesecake.jpg", "img/kimbap.jpg", "img/tom-yum.jpg", "img/kung-pao-chicken.jpg", "img/chicken-biryani.jpg", "img/pad-thai.jpg", "img/chicken-adobo.jpg", "img/chicken-teriyaki.jpg", "img/bibimbap.jpg", "img/green-curry.jpg", "img/miso-soup.jpg", "img/soto-ayam.jpg", "img/beef-rendang.jpg", "img/mie-goreng.jpg", "img/nasi-goreng.jpg", "img/dodol.jpg", "img/martabak-manis.jpg", "img/es-cendol.jpg", "img/cheese-tteokbokki.jpg", "img/bubble-tea.jpg", "img/cinnamon-roll-biscuits.jpg", "img/cheese-sticks.jpg", "img/ice-cream-mochi.jpg", "img/khubz.jpg", "img/shawarma.jpg", "img/hummus.jpg", "img/tabbouleh.jpg", "img/falafel.jpg", "img/fattoush.jpg", "img/shakshuka.jpg", "img/kunafa.jpg", "img/lentil-soup.jpg", "img/umm-ali.jpg", "img/chicken-kabsa.jpg", "img/chicken-parmigiana.jpg", "img/spaghetti-bolognese.jpg", "img/mushroom-risotto.jpg", "img/margherita-pizza.jpg", "img/flan.jpg", "img/hazelnut-chocolate-spread.jpg", "img/panna-cotta.jpg", "img/minestrone.jpg", "img/gado-gado.jpg", "img/sate-ayam.jpg", "img/es-campur.jpg", "img/pisang-goreng.jpg", "img/pempek.jpg", "img/aglio-e-olio.jpg", "img/bakso.jpg", "img/vegetable-stir-fry.jpg", "img/arepas.jpg", "img/tomato-soup.jpg", "img/guacamole.jpg"];

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
