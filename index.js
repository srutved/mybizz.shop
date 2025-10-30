import express from "express";
import cors from "cors";
import { initializeDb } from "./configs/db.js";
import dotenv from "dotenv";
import { responseHandler } from "./middlewares/responseHandler.js";
import authRoutes from "./routes/auth.route.js";
import websiteRoutes from "./routes/website.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

// Loads env vars
dotenv.config({ quiet: true });

// DB connection
await initializeDb();

// App definition
const app = express();

// Response handler middleware
app.use(responseHandler);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.SERVER_PORT || 3000;

// Server health check
app.get("/", (req, res) => {
  res.success(`App is running in ${NODE_ENV} mode on port ${PORT}`);
});

// Auth routes
app.use("/api/v1", authRoutes);

// Protected routes
app.use("/api/v1", websiteRoutes);

// Run when no endpoint is found
app.use((_, res) => {
  res.error("Not found!", 404);
});

// Error handler middleware
app.use(errorHandler);

// Server initialize
app.listen(PORT, () => {
  console.info(`🚀 Server running at http://localhost:${PORT}`);
});
