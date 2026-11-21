import { Router, type Request, type Response, type NextFunction } from "express";

/**
 * Proxy routes for TheMealDB.
 *
 * The API key lives ONLY in the server environment. Every upstream URL is built as
 *   `${MEALDB_API_BASE}/${MEALDB_API_KEY}/<endpoint>?<params>`
 * so the browser only ever sees `/api/*` and never learns the key.
 */

const API_BASE = (process.env.MEALDB_API_BASE ?? "https://www.themealdb.com/api/json/v1").replace(/\/$/, "");
const API_KEY = process.env.MEALDB_API_KEY ?? "1";

/** Tiny in-memory TTL cache (used for rarely-changing data such as categories). */
class TtlCache<T> {
  private store = new Map<string, { value: T; expires: number }>();
  constructor(private ttlMs: number) {}
  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (hit.expires < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value;
  }
  set(key: string, value: T) {
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
  }
}

const categoriesCache = new TtlCache<unknown>(60 * 60 * 1000); // 1 hour

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Forward a request to TheMealDB and return parsed JSON. */
async function upstream(endpoint: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}/${API_KEY}/${endpoint}${qs ? `?${qs}` : ""}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000); // don't hang forever
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new HttpError(502, `Upstream responded ${res.status}`);
    // TheMealDB sometimes returns an empty body for no-match; treat as `{ meals: null }`.
    const text = await res.text();
    return text ? JSON.parse(text) : { meals: null };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if ((err as Error).name === "AbortError") throw new HttpError(504, "Upstream timed out");
    throw new HttpError(502, "Upstream request failed");
  } finally {
    clearTimeout(timer);
  }
}

/** Wrap async handlers so rejections reach the Express error handler. */
const wrap =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

/** Read a required, trimmed query param or throw 400. */
function requireQuery(req: Request, name: string): string {
  const v = req.query[name];
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) throw new HttpError(400, `Missing query parameter "${name}"`);
  if (s.length > 100) throw new HttpError(400, `Query parameter "${name}" too long`);
  return s;
}

export const mealdbRouter = Router();

// GET /api/search?q=chicken -> search.php?s=chicken
mealdbRouter.get(
  "/search",
  wrap(async (req, res) => {
    // Empty query is valid for TheMealDB (returns a sample list); allow `q=` as "browse".
    const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
    res.set("Cache-Control", "public, max-age=300");
    res.json(await upstream("search.php", { s: q }));
  })
);

// GET /api/meal/:id -> lookup.php?i=:id
mealdbRouter.get(
  "/meal/:id",
  wrap(async (req, res) => {
    const id = req.params.id;
    if (!/^\d{1,10}$/.test(id)) throw new HttpError(400, "Invalid meal id");
    res.set("Cache-Control", "public, max-age=3600");
    res.json(await upstream("lookup.php", { i: id }));
  })
);

// GET /api/categories -> categories.php (cached in memory for an hour)
mealdbRouter.get(
  "/categories",
  wrap(async (_req, res) => {
    let data = categoriesCache.get("categories");
    if (!data) {
      data = await upstream("categories.php");
      categoriesCache.set("categories", data);
    }
    res.set("Cache-Control", "public, max-age=3600");
    res.json(data);
  })
);

// GET /api/filter?c=Seafood -> filter.php?c=Seafood
mealdbRouter.get(
  "/filter",
  wrap(async (req, res) => {
    const c = requireQuery(req, "c");
    res.set("Cache-Control", "public, max-age=900");
    res.json(await upstream("filter.php", { c }));
  })
);

// GET /api/random -> random.php (never cacheable)
mealdbRouter.get(
  "/random",
  wrap(async (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(await upstream("random.php"));
  })
);

/** Router-level error handler: JSON errors, no leaking of upstream URLs/keys. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof HttpError ? err.message : "Internal server error";
  if (status >= 500) console.error("[api error]", (err as Error)?.message);
  res.status(status).json({ error: message });
}
