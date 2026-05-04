/* =====================================================
   SHIFTSYNC — routes/jobs.js
   All job-related endpoints
   ===================================================== */

const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");
const Job        = require("../models/Job");
const CrewMember = require("../models/CrewMember");

// ── Status transition map (one step forward only) ───
const STATUS_CYCLE = {
  "scheduled":   "in-progress",
  "in-progress": "wrapped",
};

// ── Helpers ─────────────────────────────────────────
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ────────────────────────────────────────────────────
// GET /api/jobs
// Return all jobs with populated assignedCrew
// Optional query param: ?urgency=urgent|standard|flexible
// ────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.urgency) {
      const allowed = ["urgent", "standard", "flexible"];
      if (!allowed.includes(req.query.urgency)) {
        return res.status(400).json({ error: "Invalid urgency value" });
      }
      filter.urgency = req.query.urgency;
    }

    const jobs = await Job.find(filter)
      .populate("assignedCrew", "name roles availability")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// POST /api/jobs
// Create and save a new job. Returns 201 with saved document.
// ────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { title, description, urgency, minCrew, requiredRoles } = req.body;

    const job = new Job({
      title,
      description,
      urgency,
      minCrew,
      requiredRoles: requiredRoles || [],
    });

    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// PATCH /api/jobs/:id/status
// Advance status one step: scheduled → in-progress → wrapped
// Reject illegal transitions with 400
// ────────────────────────────────────────────────────
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid job ID" });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const nextStatus = STATUS_CYCLE[job.status];
    if (!nextStatus) {
      return res.status(400).json({
        error: `Illegal transition: job is already '${job.status}'. No further status advancement possible.`,
      });
    }

    job.status = nextStatus;
    const updated = await job.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// DELETE /api/jobs/:id
// Delete job by MongoDB _id. Returns 404 if not found.
// Also removes the job from assigned crew members' assignedJobs list.
// ────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid job ID" });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Remove this job from any crew member's assignedJobs
    if (job.assignedCrew.length > 0) {
      await CrewMember.updateMany(
        { _id: { $in: job.assignedCrew } },
        {
          $pull: { assignedJobs: job._id },
          $set:  { availability: "free" },
        }
      );
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────────────
// POST /api/jobs/:id/deploy/:crewId
// Assign a free crew member to a job
// ────────────────────────────────────────────────────
router.post("/:id/deploy/:crewId", async (req, res) => {
  try {
    const { id, crewId } = req.params;
    if (!isValidObjectId(id) || !isValidObjectId(crewId)) {
      return res.status(400).json({ error: "Invalid ID(s)" });
    }

    const [job, crew] = await Promise.all([
      Job.findById(id),
      CrewMember.findById(crewId),
    ]);

    if (!job)  return res.status(404).json({ error: "Job not found" });
    if (!crew) return res.status(404).json({ error: "Crew member not found" });

    if (crew.availability !== "free") {
      return res.status(400).json({ error: "Crew member is not free" });
    }
    if (job.assignedCrew.includes(crewId)) {
      return res.status(400).json({ error: "Crew member already assigned to this job" });
    }
    if (job.status === "wrapped") {
      return res.status(400).json({ error: "Cannot deploy to a wrapped job" });
    }

    job.assignedCrew.push(crewId);
    crew.assignedJobs.push(id);
    crew.availability = "on_shift";

    await Promise.all([job.save(), crew.save()]);

    const populated = await job.populate("assignedCrew", "name roles availability");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
