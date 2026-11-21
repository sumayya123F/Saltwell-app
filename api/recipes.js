// Shared recipe storage for PanTree (Vercel serverless function + Upstash Redis).
// GET  /api/recipes            -> { recipes: [...] | null }   (anyone)
// POST /api/recipes            -> owner only; header x-admin-code must equal ADMIN_CODE
//        body { action: "check" }              -> { ok: true }
//        body { recipes: [...] }               -> saves the list
const crypto = require("crypto");

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "pantree:recipes";

const redis = async (path, body) => {
  const r = await fetch(`${URL_}/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body,
  });
  if (!r.ok) throw new Error("storage error " + r.status);
  return (await r.json()).result;
};

const same = (a, b) => {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

const clean = (list) =>
  Array.isArray(list) && list.length <= 500
    ? list.map((r) => ({
        id: String(r.id).slice(0, 80),
        name: String(r.name).slice(0, 120),
        ingredients: (r.ingredients || []).map((s) => String(s).slice(0, 300)).slice(0, 100),
        steps: (r.steps || []).map((s) => String(s).slice(0, 1000)).slice(0, 100),
      }))
    : null;

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const configured = { code: !!process.env.ADMIN_CODE, storage: !!(URL_ && TOKEN) };
      if (!URL_ || !TOKEN) return res.status(200).json({ recipes: null, configured });
      const raw = await redis(`get/${KEY}`);
      const saved = raw ? JSON.parse(raw) : null;
      // Older saves are a plain array (built-in version 1).
      const recipes = Array.isArray(saved) ? saved : saved ? saved.recipes : null;
      const ver = Array.isArray(saved) ? 1 : saved ? saved.ver || 0 : 0;
      return res.status(200).json({ recipes, ver, configured });
    }
    if (req.method === "POST") {
      const code = process.env.ADMIN_CODE;
      if (!code || !same(req.headers["x-admin-code"] || "", code)) return res.status(401).json({ error: "wrong code" });
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (body.action === "check") return res.status(200).json({ ok: true });
      const list = clean(body.recipes);
      if (!list) return res.status(400).json({ error: "bad recipes" });
      if (!URL_ || !TOKEN) return res.status(500).json({ error: "storage not set up" });
      const ver = Math.max(0, Math.min(1000, parseInt(body.ver, 10) || 0));
      await redis(`set/${KEY}`, JSON.stringify({ recipes: list, ver }));
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: "method not allowed" });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
};
