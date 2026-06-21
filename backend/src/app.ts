import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import adminRoutes from './routes/admin';
import promoRoutes from './routes/promos';
import userRoutes from './routes/user';

dotenv.config();

const app: Express = express();

// Allowed origins
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [
      process.env.FRONTEND_URL,
      "https://quick-mart-virid-phi.vercel.app",
      "https://quick-mart-q63b.onrender.com",
      /^https:\/\/quick-mart.*\.vercel\.app$/,  // preview deployments
    ].filter(Boolean)
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:3000",
    ];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) =>
      typeof o === "string" ? o === origin : o instanceof RegExp ? o.test(origin) : false
    );
    if (allowed) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

import path from 'path';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/user", userRoutes);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

export default app;
