/* =====================================================
   SHIFTSYNC — stats.aggregate.js
   MongoDB aggregation pipeline for dashboard stats
   ===================================================== */

const express    = require("express");
const router     = express.Router();
const Job        = require("./models/Job");
const CrewMember = require("./models/CrewMember");

// ────────────────────────────────────────────────────
// GET /api/stats
// Returns:
//   activeJobs    — count of in-progress jobs
//   urgentJobs    — count of urgent jobs (any status)
//   wrappedJobs   — count of wrapped jobs
//   totalCrew     — total registered crew
//   freeCrew      — crew with availability = "free"
//   onShiftCrew   — crew with availability = "on_shift"
//   jobsByStatus  — breakdown { scheduled, in-progress, wrapped }
//   jobsByUrgency — breakdown { urgent, standard, flexible }
// ────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const [jobAgg, crewAgg] = await Promise.all([
      // Jobs aggregation
      Job.aggregate([
        {
          $facet: {
            byStatus: [
              { $group: { _id: "$status", count: { $sum: 1 } } },
            ],
            byUrgency: [
              { $group: { _id: "$urgency", count: { $sum: 1 } } },
            ],
          },
        },
      ]),

      // Crew aggregation
      CrewMember.aggregate([
        {
          $group: {
            _id: "$availability",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Normalise jobs by status
    const byStatus = {};
    (jobAgg[0]?.byStatus || []).forEach(({ _id, count }) => {
      byStatus[_id] = count;
    });

    // Normalise jobs by urgency
    const byUrgency = {};
    (jobAgg[0]?.byUrgency || []).forEach(({ _id, count }) => {
      byUrgency[_id] = count;
    });

    // Normalise crew
    const crewByAvail = {};
    crewAgg.forEach(({ _id, count }) => {
      crewByAvail[_id] = count;
    });

    const totalCrew = Object.values(crewByAvail).reduce((a, b) => a + b, 0);

    res.json({
      activeJobs:   byStatus["in-progress"] || 0,
      urgentJobs:   byUrgency["urgent"]     || 0,
      wrappedJobs:  byStatus["wrapped"]     || 0,
      totalCrew,
      freeCrew:     crewByAvail["free"]     || 0,
      onShiftCrew:  crewByAvail["on_shift"] || 0,
      jobsByStatus: {
        scheduled:    byStatus["scheduled"]   || 0,
        "in-progress": byStatus["in-progress"] || 0,
        wrapped:      byStatus["wrapped"]     || 0,
      },
      jobsByUrgency: {
        urgent:   byUrgency["urgent"]   || 0,
        standard: byUrgency["standard"] || 0,
        flexible: byUrgency["flexible"] || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
