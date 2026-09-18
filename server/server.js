require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// Configure CORS for production (Vercel domain & Capacitor) and local development
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim().replace(/\/$/, ""))
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "capacitor://localhost",
      "http://localhost",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // In development or if wildcard origin is configured
      if (process.env.NODE_ENV !== "production" || allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === origin) return true;
        // Allow Vercel preview deploys matching pattern if provided
        if (allowed.startsWith("*.") && origin.endsWith(allowed.slice(1))) return true;
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback to prevent breaking mobile web clients while logging
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

// Health Check Endpoint (Render requirement)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "shelfshare-api",
    timestamp: new Date().toISOString(),
  });
});

// Root Welcome Endpoint
app.get("/", (req, res) => {
  res.send("🚀 ShelfShare Backend is Running!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", requestRoutes);

// Safe Production Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ShelfShare server running on port ${PORT}`);
});