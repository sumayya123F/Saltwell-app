import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { mealdbRouter, errorHandler } from "./routes/mealdb.js";

const origins = (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(",").map((s) => s.trim());

export const app = express();

app.disable("x-powered-by");
// Images come from TheMealDB's CDN, so this API server only needs default helmet.
app.use(helmet());
app.use(compression());
app.use(cors({ origin: origins, methods: ["GET"] }));

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use("/api", mealdbRouter);
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);
