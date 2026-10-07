import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import bookingsRoutes from "./routes/bookings.routes";
import availabilityRoutes from "./routes/availability.routes";
import reviewsRoutes from "./routes/reviews.routes";
import contactRoutes from "./routes/contact.routes";
import metaRoutes from "./routes/meta.routes";

const app = express();

// Comma-separated list of allowed frontend origins, e.g.
// "http://localhost:3000,https://universehvac.vercel.app"
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    // Admin auth uses a Bearer token in the Authorization header (see
    // src/auth.ts), not cookies, so credentials do not need to be enabled —
    // this keeps the CORS setup simple even when the frontend and backend
    // are deployed on completely different domains.
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Universe HVAC Solutions API" });
});
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/meta", metaRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[unhandled error]", err);
  res.status(500).json({ error: "Something went wrong." });
});

export default app;
