import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

/**
 * Builds the manual service worker.
 *
 * `src/sw.js` is plain JS (no bundler) containing two placeholders:
 *   __PRECACHE_MANIFEST__  -> array of every emitted asset URL (app shell + static files)
 *   __SW_VERSION__         -> hash of that list, so the cache name changes on every deploy
 * After the main build finishes we read the real file list from the bundle + public dir,
 * inject it, and write the result to `dist/sw.js`.
 */
function serviceWorkerPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "manual-sw",
    apply: "build",
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
    },
    closeBundle() {
      const urls: string[] = ["/"];
      const walk = (dir: string) => {
        for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, f.name);
          if (f.isDirectory()) walk(full);
          else {
            const rel = "/" + path.relative(outDir, full).split(path.sep).join("/");
            if (rel !== "/sw.js" && !rel.endsWith(".map")) urls.push(rel);
          }
        }
      };
      walk(outDir);
      const version = crypto.createHash("sha1").update(urls.join("|") + urls.map((u) => {
        try { return fs.statSync(path.join(outDir, u)).size; } catch { return 0; }
      }).join(",")).digest("hex").slice(0, 10);
      const src = fs.readFileSync(path.resolve(__dirname, "src/sw.js"), "utf8")
        .replace("__PRECACHE_MANIFEST__", JSON.stringify(urls))
        .replace("__SW_VERSION__", version);
      fs.writeFileSync(path.join(outDir, "sw.js"), src);
    },
  };
}

export default defineConfig({
  plugins: [react(), serviceWorkerPlugin()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  server: {
    port: 5173,
    // The client only ever calls /api/*; the dev server forwards it to Express.
    proxy: { "/api": process.env.API_PROXY_TARGET ?? "http://localhost:3001" },
  },
  preview: { proxy: { "/api": process.env.API_PROXY_TARGET ?? "http://localhost:3001" } },
});
