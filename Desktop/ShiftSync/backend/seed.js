/* =====================================================
   SHIFTSYNC — seed.js
   Clears and re-populates the DB with sample data.
   Run with: node seed.js
   ===================================================== */

require("dotenv").config();
const mongoose   = require("mongoose");
const Job        = require("./models/Job");
const CrewMember = require("./models/CrewMember");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shiftsync";

const seedCrew = [
  {
    name: "Yasir Sultan",
    contactEmail: "yasir.sultan@shiftsync.io",
    roles: ["Sound", "Lighting"],
    availability: "free",
  },
  {
    name: "Kashan K.",
    contactEmail: "kashan.k@shiftsync.io",
    roles: ["AV", "Rigging"],
    availability: "on_shift",
  },
  {
    name: "Sana J.",
    contactEmail: "sana.j@shiftsync.io",
    roles: ["Logistics", "Catering"],
    availability: "free",
  },
];

const seedJobs = [
  {
    title: "Main Stage Audio Setup",
    description: "PA system + monitor rig. Min 3 crew required.",
    urgency: "urgent",
    status: "scheduled",
    minCrew: 3,
    requiredRoles: ["Sound", "AV"],
  },
  {
    title: "Backstage Cabling Run",
    description: "Route power + signal cables to all stage positions.",
    urgency: "flexible",
    status: "scheduled",
    minCrew: 1,
    requiredRoles: ["Rigging"],
  },
  {
    title: "LED Screen Installation Hall B",
    description: "Mount and calibrate 2x panels. Engineering skills needed.",
    urgency: "standard",
    status: "in-progress",
    minCrew: 2,
    requiredRoles: ["AV", "Rigging"],
  },
  {
    title: "Green Room Catering Setup",
    description: "Catering stations across all backstage green rooms.",
    urgency: "flexible",
    status: "wrapped",
    minCrew: 2,
    requiredRoles: ["Catering", "Logistics"],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✓ Connected to MongoDB");

  // Clear existing data
  await Promise.all([Job.deleteMany(), CrewMember.deleteMany()]);
  console.log("✓ Cleared existing data");

  // Insert crew first
  const crew = await CrewMember.insertMany(seedCrew);
  console.log(`✓ Seeded ${crew.length} crew members`);

  // Assign Kashan to the LED Screen job
  const jobs = await Job.insertMany(seedJobs);
  const ledJob = jobs.find(j => j.title.includes("LED Screen"));
  const kashan = crew.find(c => c.name === "Kashan K.");

  if (ledJob && kashan) {
    ledJob.assignedCrew.push(kashan._id);
    kashan.assignedJobs.push(ledJob._id);
    await Promise.all([ledJob.save(), kashan.save()]);
  }

  console.log(`✓ Seeded ${jobs.length} jobs`);
  console.log("✓ Seed complete");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
