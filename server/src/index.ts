import "dotenv/config"; // must load before the routes module reads process.env
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

const { mealdbRouter, errorHandler } = await import("./routes/mealdb.js");

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const origins = (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(",").map((s) => s.trim());

app.disable("x-powered-by");
// Images come from TheMealDB's CDN, so this API server only needs default helmet.
app.use(helmet());
app.use(compression());
app.use(cors({ origin: origins, methods: ["GET"] }));

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use("/api", mealdbRouter);
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

app.listen(PORT, () => console.log(`API proxy listening on http://localhost:${PORT}`));
