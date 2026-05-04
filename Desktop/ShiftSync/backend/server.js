/* =====================================================
   SHIFTSYNC — server.js
   Entry point: connects to MongoDB and mounts routes
   ===================================================== */

require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const jobRoutes  = require("./routes/jobs");
const crewRoutes = require("./routes/crew");
const statsRoute = require("./stats.aggregate");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────
app.use("/api/jobs",  jobRoutes);
app.use("/api/crew",  crewRoutes);
app.use("/api/stats", statsRoute);

// ── Health check ────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "ShiftSync API is running ✓" });
});

// ── 404 handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

// ── MongoDB connection ──────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shiftsync")
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  });
