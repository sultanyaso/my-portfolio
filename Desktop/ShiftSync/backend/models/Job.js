/* =====================================================
   SHIFTSYNC — models/Job.js
   Mongoose schema for a Job document
   ===================================================== */

const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [200, "Description cannot exceed 200 characters"],
      trim: true,
    },

    urgency: {
      type: String,
      enum: {
        values: ["urgent", "standard", "flexible"],
        message: "urgency must be urgent | standard | flexible",
      },
      required: [true, "Urgency is required"],
    },

    status: {
      type: String,
      enum: {
        values: ["scheduled", "in-progress", "wrapped"],
        message: "status must be scheduled | in-progress | wrapped",
      },
      default: "scheduled",
    },

    minCrew: {
      type: Number,
      default: 1,
      min: [1, "Minimum crew must be at least 1"],
    },

    requiredRoles: {
      type: [String],
      // e.g. ["Sound", "AV"]
      default: [],
    },

    assignedCrew: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CrewMember",
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt auto-managed
  }
);

module.exports = mongoose.model("Job", JobSchema);
