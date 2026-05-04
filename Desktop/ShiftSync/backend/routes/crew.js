/* =====================================================
   SHIFTSYNC — routes/crew.js
   All crew-related endpoints
   ===================================================== */

const express    = require("express");
const router     = express.Router();
const mongoose   = require("mongoose");
const CrewMember = require("../models/CrewMember");
const Job        = require("../models/Job");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ────────────────────────────────────────────────────
// GET /api/crew
// Return all crew members (populated assignedJobs)
// ────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const crew = await CrewMember.find()
      .populate("assignedJobs", "title status urgency")
      .sort({ createdAt: -1 });
    res.json(crew);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// POST /api/crew
// Register a new crew member.
// If contactEmail already exists → 409 Conflict
// ────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, contactEmail, roles } = req.body;

    // Check for duplicate email
    const existing = await CrewMember.findOne({
      contactEmail: contactEmail?.toLowerCase().trim(),
    });
    if (existing) {
      return res.status(409).json({
        error: "A crew member with this email already exists",
      });
    }

    const member = new CrewMember({ name, contactEmail, roles });
    const saved  = await member.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    // Mongo duplicate key (fallback)
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// GET /api/crew/:id
// Get a single crew member by ID
// ────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid crew ID" });

    const member = await CrewMember.findById(id)
      .populate("assignedJobs", "title status urgency");
    if (!member) return res.status(404).json({ error: "Crew member not found" });

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// PATCH /api/crew/:id/availability
// Update availability to "free" | "on_shift"
// ────────────────────────────────────────────────────
router.patch("/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid crew ID" });

    const allowed = ["free", "on_shift"];
    if (!allowed.includes(availability)) {
      return res.status(400).json({ error: "availability must be free | on_shift" });
    }

    const member = await CrewMember.findByIdAndUpdate(
      id,
      { availability },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ error: "Crew member not found" });

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// DELETE /api/crew/:id
// Remove a crew member and unassign from their jobs
// ────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid crew ID" });

    const member = await CrewMember.findById(id);
    if (!member) return res.status(404).json({ error: "Crew member not found" });

    // Pull this crew member from all jobs' assignedCrew arrays
    await Job.updateMany(
      { assignedCrew: member._id },
      { $pull: { assignedCrew: member._id } }
    );

    await member.deleteOne();
    res.json({ message: "Crew member deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
