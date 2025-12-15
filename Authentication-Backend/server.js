// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import validateEnv from "./config/validateEnv.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
validateEnv();
const app = express();

// Security hardening
const allowedOrigins = (process.env.CLIENT_URL || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

app.set("trust proxy", 1);
app.use(
	cors({
		origin: allowedOrigins.length ? allowedOrigins : "*",
		credentials: true,
	})
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 120,
		standardHeaders: true,
		legacyHeaders: false,
	})
);

if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Test route
app.get("/", (req, res) => res.send("Backend Running Successfully 🚀"));

// Fallback handlers
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
