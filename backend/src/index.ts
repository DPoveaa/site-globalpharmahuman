import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import catalogRoutes from "./routes/catalog.routes";
import cartRoutes from "./routes/cart.routes";
import checkoutRoutes from "./routes/checkout.routes";
import adminRoutes from "./routes/admin.routes";
import ordersRoutes from "./routes/orders.routes";
import userRoutes from "./routes/user.routes";
import reviewsRoutes from "./routes/reviews.routes";
import shippingRoutes from "./routes/shipping.routes";
import loyaltyRoutes from "./routes/loyalty.routes";
import unitsRoutes from "./routes/units.routes";
import webhookRoutes from "./routes/webhook.routes";

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "*";
const origins = corsOrigin.includes(",") 
  ? corsOrigin.split(",").map(o => o.trim()) 
  : corsOrigin;

app.use(
  cors({
    origin: origins,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });
  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "globalpharmahuman-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/units", unitsRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

app.listen(port, () => {
  console.log(`[backend] running on http://localhost:${port}`);
});
