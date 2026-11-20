# 🍲 Recipes PWA

An installable, offline-capable recipe browser powered by [TheMealDB](https://www.themealdb.com/api.php).
A small Express proxy hides the API key; the React client only ever calls `/api/*`.

## Features
- Search by name, browse categories, recipe details (ingredients, instructions, tags, YouTube link)
- Favorites stored in **IndexedDB** — view, add and remove them fully offline
- Installable PWA: manifest, hand-written service worker, precached app shell, offline fallback page
- Skeleton loaders, empty/error states, error boundary, toasts (sonner), light/dark theme
- Accessible: skip link, landmarks, labelled controls, `aria-pressed` toggles, focus rings, alt text

## Tech stack
| Layer | Tools |
| --- | --- |
| Client | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui (Radix), TanStack Query, React Router, `idb`, sonner |
| Server | Node 18+, Express, helmet, compression, cors, dotenv, TypeScript (tsx for dev) |
| PWA | Manual service worker (no Workbox) injected with a precache list by a small Vite plugin |

## Project layout
```
server/   Express proxy (src/index.ts, src/routes/mealdb.ts)
client/   Vite app (src/pages, src/components, src/features/favorites, src/lib, src/sw.js)
```

## Setup
Two terminals:
```bash
cd server && cp .env.example .env && npm i && npm run dev
```
```bash
cd client && npm i && npm run dev
```
Open http://localhost:5173. Vite proxies `/api` to the server on port 3001.

Or from the repo root, run both together: `npm i && (cd server && cp .env.example .env && npm i) && (cd client && npm i) && npm run dev`.

## Environment variables (`server/.env`)
| Variable | Default | Purpose |
| --- | --- | --- |
| `MEALDB_API_KEY` | `1` | TheMealDB key (the public dev key). Never sent to the browser. |
| `MEALDB_API_BASE` | `https://www.themealdb.com/api/json/v1` | Upstream base URL |
| `PORT` | `3001` | Server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated allowed origins (only matters if client and API are on different origins) |

Client (build-time, optional): `VITE_API_BASE` — absolute URL of the API if it is not same-origin (e.g. `https://my-api.onrender.com`). `API_PROXY_TARGET` overrides the dev proxy target.

## API (proxy)
| Route | Upstream |
| --- | --- |
| `GET /api/search?q=` | `search.php?s=` |
| `GET /api/meal/:id` | `lookup.php?i=` |
| `GET /api/categories` | `categories.php` (1 h in-memory TTL cache) |
| `GET /api/filter?c=` | `filter.php?c=` |
| `GET /api/random` | `random.php` |

Upstream URLs are built as `${MEALDB_API_BASE}/${MEALDB_API_KEY}/<endpoint>`. Errors return `{ "error": "..." }` without leaking upstream URLs.

> Note: recipe **images** are loaded from TheMealDB's CDN URLs returned in the data (they contain no key). All *API* calls go through the proxy.

## shadcn/ui setup
The components used (`button`, `card`, `input`, `badge`, `dialog`, `skeleton`, `sonner`) are already included in `client/src/components/ui`, with `components.json` and the CSS-variable theme in `src/styles/globals.css`. To start from scratch or add more:
```bash
cd client
npm i tailwindcss@3 postcss autoprefixer tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init        # style: default, base color: slate, CSS variables: yes
npx shadcn@latest add button card input badge dialog skeleton sonner
```
The `@/*` alias is configured in `tsconfig.json` and `vite.config.ts`.

## PWA details
**Test offline** (the SW is registered in production builds only):
```bash
cd client && npm run build && npm run preview   # server must be running too
```
1. Open http://localhost:5173, browse a few recipes and open a couple of details.
2. DevTools → Application → Service Workers → tick **Offline** (or use the Network tab).
3. Reload: the app shell loads, cached searches/details show, favorites work (add from a cached detail page, view, remove). A toast announces you're offline.
4. A route with nothing cached shows an error state with a link to `/offline.html`; if even the app shell isn't cached, the browser shows `offline.html`.

**Installability:** Chrome shows an install button once the manifest + SW are served over HTTPS (or localhost). Check Lighthouse → PWA.

### Caching strategies (`client/src/sw.js`)
| Request | Strategy |
| --- | --- |
| App shell & static assets | Precached at install (list generated at build), cache-first |
| Navigations | Network-first (4 s timeout) → cached `/` shell → `/offline.html` |
| `/api/categories` | Stale-while-revalidate |
| Other `/api/*` (search, meal, filter) | Network-first (4 s timeout) → cache fallback |
| Images | Stale-while-revalidate, capped at 200 entries |

To change a strategy, edit the routing in the `fetch` listener at the bottom of `sw.js` (e.g. switch `networkFirst` ↔ `staleWhileRevalidate`), and tune `NETWORK_TIMEOUT_MS`, `MAX_IMAGES`, `MAX_API`. The precache version is a hash of the build output, so every deploy installs a fresh cache and removes the old one; runtime caches (`api-v1`, `img-v1`) persist — bump their names to invalidate them.

## Build & deploy
```bash
cd server && npm run build && npm start        # compiles to dist/, runs node dist/index.js
cd client && npm run build                     # outputs dist/ (with dist/sw.js)
```
- **Server → Render** (Web Service): root `server`, build `npm i && npm run build`, start `npm start`; set `MEALDB_API_KEY`, `MEALDB_API_BASE`, `CORS_ORIGIN=https://<your-client>`.
- **Client → Netlify/Vercel**: root `client`, build `npm run build`, publish `dist`. Either set `VITE_API_BASE` to the Render URL, or (better, same-origin so the SW can cache `/api/*`) add a rewrite: `/api/*` → `https://<render-app>/api/:splat` (Netlify `_redirects`: `/api/* https://<render-app>/api/:splat 200`; plus `/* /index.html 200` for SPA routing). Note the SW only intercepts same-origin `/api/` requests, so prefer the rewrite.

## Post-generation checklist
- [ ] Replace the placeholder icons in `client/public/icons` (192, 512, maskable 512, SVG) with real artwork
- [ ] Update `theme_color` / `background_color` in `manifest.webmanifest` and `index.html`
- [ ] Set your own `MEALDB_API_KEY` for production (key `1` is for development)
- [ ] Add more shadcn components with `npx shadcn@latest add <name>` as needed
- [ ] Run Lighthouse (PWA + a11y) against `npm run preview`
